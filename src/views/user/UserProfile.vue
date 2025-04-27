<template>
  <div class="user-profile-container">
    <!-- 个人信息展示区 -->
    <a-card title="个人资料" class="profile-card">
      <a-descriptions :column="2">
        <a-descriptions-item label="用户名"
          >{{ userInfo.username }}
        </a-descriptions-item>
        <a-descriptions-item label="昵称"
          >{{ userInfo.nickname }}
        </a-descriptions-item>
        <a-descriptions-item label="手机号"
          >{{ userInfo.phone || "未绑定" }}
        </a-descriptions-item>
        <a-descriptions-item label="性别"
          >{{ GENDER_MAP[userInfo.gender] }}
        </a-descriptions-item>
        <a-descriptions-item label="角色">
          <a-tag :color="userInfo.role === '设计师' ? 'green' : 'blue'">
            {{ ROLE_MAP[userInfo.role] }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="账户余额">
          <span class="balance">¥{{ userInfo.balance.toFixed(2) }}</span>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>

    <!-- 操作按钮区 -->
    <div class="action-area">
      <a-space :size="16">
        <a-button type="primary" @click="showEditModal">
          <template #icon>
            <EditOutlined />
          </template>
          修改信息
        </a-button>

        <a-button
          v-if="userInfo.role === 'general'"
          @click="showApplicationModal"
        >
          <template #icon>
            <UserAddOutlined />
          </template>
          申请设计师
        </a-button>

        <a-button type="dashed" @click="showRechargeModal">
          <template #icon>
            <WalletOutlined />
          </template>
          立即充值
        </a-button>
      </a-space>
    </div>

    <!-- 订单列表区 -->
    <a-card title="我的订单" class="order-card">
      <a-table
        :columns="orderColumns"
        :data-source="orderList"
        :pagination="{ pageSize: 8 }"
        row-key="orderUuid"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag
              :color="
                record.status === 'paid'
                  ? 'green'
                  : record.status === 'pay_failed'
                  ? 'red'
                  : 'blue'
              "
            >
              {{ ORDER_STATUS_MAP[record.status] }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'createTime'">
            {{ formatTimestamp(record.createTime) }}
          </template>
          <template v-else-if="column.key === 'operate'">
            <a-space>
              <a-popconfirm
                title="确定要支付吗？"
                ok-text="确认"
                cancel-text="取消"
                @confirm="handleCreateOrder(record)"
                :disabled="record.status !== 'pending'"
              >
                <a-button size="small" :disabled="record.status !== 'pending'">
                  确认支付
                </a-button>
              </a-popconfirm>

              <a-popconfirm
                title="确定要删除吗？"
                ok-text="确认"
                cancel-text="取消"
                @confirm="handleDeleteOrder(record)"
              >
                <a-button danger size="small">删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 修改信息模态框 -->
    <a-modal
      v-model:visible="editVisible"
      title="修改个人信息"
      @ok="handleEditSubmit"
      @cancel="handleEditCancel"
      :destroyOnClose="true"
    >
      <a-form :model="editForm" layout="vertical">
        <a-form-item label="昵称" required>
          <a-input v-model:value="editForm.nickname" />
        </a-form-item>
        <a-form-item label="手机号" required>
          <a-input v-model:value="editForm.phone" />
        </a-form-item>
        <a-form-item label="性别" required>
          <a-select v-model:value="editForm.gender">
            <a-select-option value="male">男</a-select-option>
            <a-select-option value="female">女</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 充值模态框 -->
    <a-modal
      v-model:visible="rechargeVisible"
      title="账户充值"
      @ok="handleRecharge"
      @cancel="handleRechargeCancel"
    >
      <a-radio-group v-model:value="selectedAmount" class="recharge-options">
        <a-radio-button :value="50">50元</a-radio-button>
        <a-radio-button :value="100">100元</a-radio-button>
        <a-radio-button :value="200">200元</a-radio-button>
        <a-radio-button :value="500">500元</a-radio-button>
      </a-radio-group>
    </a-modal>

    <!-- 申请设计师模态框 -->
    <a-modal
      v-model:visible="applicationVisible"
      :title="applicationTitle"
      @ok="handleApplicationSubmit"
      @cancel="handleApplicationCancel"
      :destroyOnClose="true"
    >
      <div v-if="applicationInfo.status === 'wait_apply'">
        <a-form :model="applicationForm" layout="vertical">
          <a-form-item label="申请理由" required>
            <a-textarea v-model:value="applicationForm.reason" />
          </a-form-item>
        </a-form>
        <a-form layout="vertical">
          <a-form-item label="申请材料">
            <a-upload-dragger
              v-model:fileList="fileList"
              :class="{ uploaded: fileList.length }"
              :before-upload="beforeUpload"
            >
              <p class="ant-upload-drag-icon">
                <inbox-outlined></inbox-outlined>
              </p>
              <p class="ant-upload-text">点击或拖拽文件到此区域</p>
              <p class="ant-upload-hint">
                支持上传pdf、word、jpg、png格式文件，大小不超过2M
              </p>
            </a-upload-dragger>
          </a-form-item>
        </a-form>
      </div>
      <div v-else>
        <p>
          审批状态：
          <a-tag :color="applicationInfo.status === 'pass' ? 'green' : 'blue'">
            {{ DESIGNER_APPLICATION_STATUS_MAP[applicationInfo.status] }}
          </a-tag>
        </p>
        <a-divider />
        <p>申请时间： {{ formatTimestamp(applicationInfo.createTime) }}</p>
        <p>申请理由： {{ applicationInfo.reason }}</p>
        <a-divider />
        <p>
          审批时间：
          {{
            applicationInfo.approvalTime
              ? formatTimestamp(applicationInfo.approvalTime)
              : ""
          }}
        </p>
        <p>审批意见： {{ applicationInfo.approvalOpinions }}</p>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { InboxOutlined } from "@ant-design/icons-vue";
import {
  EditOutlined,
  UserAddOutlined,
  WalletOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import api from "@/api/api";
import {
  GENDER_MAP,
  ROLE_MAP,
  DESIGNER_APPLICATION_STATUS_MAP,
  ORDER_STATUS_MAP,
} from "@/utils/constant";
import { ApiResponse } from "@/utils/axios";
import formatTimestamp from "@/utils/public";

const fileList = ref([]);

// 用户数据
const userInfo = reactive({
  username: "",
  nickname: "",
  phone: "",
  gender: "",
  role: "",
  balance: 0,
});

const getUserInfo = () => {
  api.userDetail().then((res) => {
    if (res.code === 0) {
      userInfo.username = res.data.username;
      userInfo.nickname = res.data.nickname;
      userInfo.phone = res.data.phone;
      userInfo.gender = res.data.gender === 1 ? "male" : "female";
      userInfo.role = res.data.role;
      userInfo.balance = res.data.balance;
    } else {
      message.error(res.message);
    }
  });
};
getUserInfo();

// 订单数据
const orderList = ref<[]>([]);

const getOrderList = () => {
  api.orderList({}).then((res: ApiResponse) => {
    if (res.code === 0) {
      orderList.value = res.data?.list.map((item) => {
        item.orderUuid = item.order_uuid;
        item.draftTitle = item.draft_title;
        item.createTime = item.create_time;
        return item;
      });
    } else {
      message.error(res.message);
    }
  });
};
getOrderList();

// 表格列配置
const orderColumns = [
  { title: "订单号", key: "orderUuid", dataIndex: "orderUuid", width: 180 },
  {
    title: "画稿标题",
    key: "draftTitle",
    dataIndex: "draftTitle",
  },
  {
    title: "下单时间",
    key: "createTime",
    dataIndex: "createTime",
  },
  { title: "金额（元）", key: "amount", dataIndex: "amount" },
  {
    title: "状态",
    key: "status",
    dataIndex: "status",
  },
  {
    title: "设计师",
    key: "designer",
    dataIndex: "designer",
  },
  {
    title: "操作",
    key: "operate",
    dataIndex: "operate",
    width: 240,
  },
];

// 编辑功能
const editVisible = ref(false);
const editForm = reactive({
  nickname: "",
  gender: "",
  phone: "",
});

const showEditModal = () => {
  editForm.nickname = userInfo.nickname;
  editForm.gender = userInfo.gender;
  editForm.phone = userInfo.phone;
  editVisible.value = true;
};

const beforeUpload = (file, fileList) => {
  return Promise.resolve(file);
};

const handleEditSubmit = () => {
  const params = {
    nickname: editForm.nickname,
    gender: editForm.gender == "male" ? 1 : 0,
    phone: editForm.phone,
  };
  try {
    api.userModify(params).then((res: ApiResponse) => {
      if (res.code === 0) {
        message.success("个人信息更新成功");
        getUserInfo();
      } else {
        message.error(res.message);
      }
    });
  } catch (e) {
    message.error("更新失败!");
  } finally {
    editVisible.value = false;
  }
};

// 充值功能
const rechargeVisible = ref(false);
const selectedAmount = ref(50);

const showRechargeModal = () => {
  rechargeVisible.value = true;
};

const handleRecharge = () => {
  const amount = selectedAmount.value;
  const params = {
    amount: amount,
  };
  api.walletRecharge(params).then((res: ApiResponse) => {
    if (res.code === 0) {
      const url = res.data?.url;
      console.log("url:", url);
      message.success("请支付后刷新页面查看余额");
      // 打开url
      window.open(url, "_blank");
    } else {
      message.error(res.message);
    }
  });
  rechargeVisible.value = false;
};

const handleCreateOrder = (order: object) => {
  const params = {
    order_id: order.id,
  };
  api.orderPay(params).then((res) => {
    if (res.code === 0) {
      message.success("支付成功");
      getOrderList();
      getUserInfo();
    } else {
      message.error(res.message);
    }
  });
};

const handleDeleteOrder = (record) => {
  api.deleteOrder({ order_id: record.id }).then((res: ApiResponse) => {
    if (res.code === 0) {
      message.success("删除成功");
      getOrderList();
    } else {
      message.error(res.message);
    }
  });
};

// 申请设计师功能
const applicationVisible = ref(false);
const applicationForm = reactive({
  reason: "",
});

const applicationInfo = reactive({
  status: "wait_apply",
  reason: "",
  createTime: "",
  approvalOpinions: "",
  approvalTime: "",
});

const showApplicationModal = () => {
  // 判断用户是否已经提交过申请
  checkApplicationStatus();
  applicationVisible.value = true;
};

const checkApplicationStatus = () => {
  api.designerApplicationRecord().then((res: ApiResponse) => {
    if (res.code !== 0) {
      message.error(res.message);
    } else {
      if (res.data?.status !== undefined) {
        const record = res.data;
        applicationInfo.status = record.status;
        applicationInfo.reason = record.reason;
        applicationInfo.createTime = record.create_time;
        applicationInfo.approvalOpinions = record.approval_opinions;
        applicationInfo.approvalTime = record.approval_time;
      } else {
        applicationInfo.status = "wait_apply"; // 如果没有申请记录，则显示为待申请状态
      }
    }
  });
};

const handleApplicationSubmit = () => {
  if (applicationInfo.status === "wait_apply") {
    const params = {
      reason: applicationForm.reason,
    };
    api.applyAsDesigner(params).then((res: ApiResponse) => {
      if (res.code === 0) {
        message.success("提交成功，请等待审批");
      } else {
        message.error(res.message);
      }
    });
  }
  applicationVisible.value = false;
};

const handleApplicationCancel = () => {
  applicationVisible.value = false;
};

const applicationTitle = computed(() => {
  return applicationInfo.status === "wait_apply" ? "申请设计师" : "审批信息";
});
</script>

<style scoped lang="scss">
.user-profile-container {
  max-width: 1200px;
  margin: 24px auto;
  padding: 0 20px;

  .profile-card {
    margin-bottom: 24px;

    :deep(.ant-descriptions-item-label) {
      width: 100px;
      color: #666;
      font-weight: normal;
    }

    .balance {
      color: #ff4d4f;
      font-size: 18px;
      font-weight: bold;
    }
  }

  .action-area {
    margin-bottom: 32px;
    padding: 16px;
    background: #fafafa;
    border-radius: 8px;
  }

  .order-card {
    :deep(.ant-table-thead th) {
      background: #fafafa;
    }

    .artwork-link {
      color: #40a9ff;

      &:hover {
        color: #1890ff;
        text-decoration: underline;
      }
    }

    :deep(.ant-btn-link[disabled]) {
      color: rgba(0, 0, 0, 0.25);
    }
  }

  .recharge-options {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-bottom: 16px;

    :deep(.ant-radio-button-wrapper) {
      text-align: center;
    }
  }

  .custom-amount {
    width: 100%;
    margin-top: 12px;
  }
}

@media (max-width: 768px) {
  .user-profile-container {
    padding: 0 12px;

    .profile-card :deep(.ant-descriptions-item) {
      display: block;
      padding: 8px 0;
    }

    .action-area :deep(.ant-space) {
      width: 100%;
      flex-direction: column;

      .ant-btn {
        width: 100%;
        margin-bottom: 8px;
      }
    }

    .recharge-options {
      grid-template-columns: 1fr;
    }
  }
}
</style>
