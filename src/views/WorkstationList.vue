<template>
  <div id="container">
    <a-card title="工位列表" bordered class="order-card">
      <!-- 创建按钮 -->
      <div class="header-actions">
        <a-button type="primary" @click="toCreateWorkstation">创建</a-button>
      </div>
      <a-table
        :dataSource="workstationList"
        :columns="columns"
        class="order-table"
        rowKey="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'operate'">
            <a-button
              type="primary"
              size="small"
              @click="toModifyWorkstation(record)"
              style="margin-right: 10px"
              >编辑
            </a-button>
            <a-popconfirm
              title="确定要删除吗？"
              ok-text="确认"
              cancel-text="取消"
              @confirm="deleteWorkstation(record)"
              :disabled="record.role === 'administrator'"
            >
              <a-button danger :disabled="record.role === 'administrator'"
                >删除
              </a-button>
            </a-popconfirm>
          </template>
          <template v-else-if="column.key === 'role'">
            <a-tag :color="record.role === 'administrator' ? 'green' : 'blue'">
              {{ ROLE_MAP[record.role] }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'gender'">
            {{ record.gender === 1 ? "男" : "女" }}
          </template>
          <template v-else>
            <a-td>{{ record[column.dataIndex] }}</a-td>
          </template>
        </template>
      </a-table>
      <a-pagination
        :current="pagination.page"
        :pageSize="pagination.size"
        :total="pagination.count"
        @change="handlePageChange"
        style="margin-top: 20px; text-align: right"
      />
    </a-card>

    <a-modal
      v-model:visible="showWorkstationModal"
      title="工位信息"
      @ok="handleSubmit"
      @cancel="resetWorkstationForm"
      ok-text="保存"
      cancel-text="取消"
    >
      <a-form
        :model="workstationForm"
        :labelCol="{ span: 5 }"
        :wrapperCol="{ span: 19 }"
        style="margin-top: 50px"
      >
        <a-form-item label="编号">
          <a-input
            v-model:value="workstationForm.code"
            placeholder="请输入编号"
          />
        </a-form-item>
        <a-form-item label="所在位置">
          <a-input
            v-model:value="workstationForm.location"
            placeholder="请输入所在位置"
          />
        </a-form-item>
        <a-form-item label="员工">
          <a-select
            v-model:value="workstationForm.user_id"
            :options="userList"
            :field-names="{ label: 'nickname', value: 'id' }"
          >
          </a-select>
        </a-form-item>
        <a-form-item label="上联交换机">
          <a-select
            v-model:value="workstationForm.switch_id"
            @change="toDistribute"
            :options="switchList"
            :field-names="{ label: 'name', value: 'id' }"
          >
          </a-select>
        </a-form-item>
        <a-form-item label="分配地址">
          <a-input
            disabled
            v-model:value="workstationForm.distributed_ip_addr"
          />
        </a-form-item>
        <a-form-item label="分配网关">
          <a-input
            disabled
            v-model:value="workstationForm.distributed_gateway"
          />
        </a-form-item>
        <a-form-item label="分配DNS">
          <a-input disabled v-model:value="workstationForm.distributed_dns" />
        </a-form-item>
        <a-form-item label="子网掩码">
          <a-input disabled v-model:value="workstationForm.distributed_mask" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { message } from "ant-design-vue";
import api from "@/api/api";
import { ApiResponse } from "@/utils/axios";

const workstationList = ref([]);
const pagination = ref({
  size: 10,
  page: 1,
  count: null,
});

const getWorkstationList = () => {
  api.workstationList({}).then((res: ApiResponse) => {
    if (res.code === 0) {
      workstationList.value = res.data?.list.map((item: object) => {
        return item;
      });
      pagination.value.count = res.data?.count || 0;
    } else {
      message.error(res.message);
    }
  });
};

getWorkstationList();

const switchList = ref([]);

const getSwitchList = () => {
  const params = {
    page: 1,
    size: 9999,
  };
  api.switchList(params).then((res: ApiResponse) => {
    if (res.code === 0) {
      switchList.value = res.data?.list.map((item: object) => {
        return item;
      });
    } else {
      message.error(res.message);
    }
  });
};

const userList = ref([]);

const getUserList = () => {
  const params = {
    page: 1,
    size: 9999,
  };
  api.userList(params).then((res: ApiResponse) => {
    if (res.code === 0) {
      userList.value = res.data?.list.map((item: object) => {
        return item;
      });
    } else {
      message.error(res.message);
    }
  });
};

const columns = [
  { title: "ID", dataIndex: "id", key: "id" },
  { title: "编号", dataIndex: "code", key: "code" },
  { title: "所在位置", dataIndex: "location", key: "location" },
  { title: "员工", dataIndex: "user_nickname", key: "user_nickname" },
  {
    title: "IP地址",
    dataIndex: "ip_addr",
    key: "ip_addr",
  },
  { title: "网关", dataIndex: "gateway", key: "gateway" },
  { title: "DNS", dataIndex: "dns", key: "dns" },
  { title: "子网掩码", dataIndex: "mask", key: "mask" },
  { title: "操作", dataIndex: "operate", key: "operate" },
];

const handlePageChange = (newPage: number) => {
  pagination.value.page = newPage;
  getWorkstationList();
};

const deleteWorkstation = (record) => {
  const params = { id: record.id };
  api.deleteWorkstation(params).then((res: ApiResponse) => {
    if (res.code === 0) {
      message.success("删除成功");
      getWorkstationList();
    } else {
      message.error(res.message);
    }
  });
};

const showWorkstationModal = ref(false);

const workstationForm = reactive({
  id: null,
  code: "",
  location: "",
  switch_id: null,
  distributed_ip_addr: "",
  distributed_gateway: "",
  distributed_dns: "",
  distributed_mask: "",
  user_id: null,
});

const toCreateWorkstation = ref(() => {
  resetWorkstationForm();
  getWorkstationList();
  getUserList();
  getSwitchList();
  showWorkstationModal.value = true;
});

const toDistribute = ref(() => {
  const params = { switch_id: workstationForm.switch_id };
  api.distribute(params).then((res: ApiResponse) => {
    if (res.code === 0) {
      const data = res.data;
      workstationForm.distributed_ip_addr = data.ip_addr;
      workstationForm.distributed_gateway = data.gateway;
      workstationForm.distributed_dns = data.dns;
      workstationForm.distributed_mask = data.mask;
    } else {
      message.error(res.message);
    }
  });
});

const toModifyWorkstation = ref((record) => {
  // 获取详情
  api.workstationDetail({ id: record.id }).then((res: ApiResponse) => {
    if (res.code === 0) {
      const data = res.data;
      workstationForm.id = data.id;
      workstationForm.code = data.code;
      workstationForm.switch_id = data.switch_id;
      getSwitchList();
      workstationForm.distributed_ip_addr = data.ip_addr;
      workstationForm.distributed_gateway = data.gateway;
      workstationForm.distributed_dns = data.dns;
      workstationForm.distributed_mask = data.mask;
      workstationForm.location = data.location;
      workstationForm.user_id = data.user_id;
      getUserList();
    } else {
      message.error(res.message);
    }
  });
  showWorkstationModal.value = true;
});

const handleSubmit = () => {
  if (
    !workstationForm.code ||
    !workstationForm.location ||
    !workstationForm.switch_id ||
    !workstationForm.distributed_ip_addr ||
    !workstationForm.distributed_gateway ||
    !workstationForm.distributed_dns ||
    !workstationForm.distributed_mask
  ) {
    message.warning("请填写完整信息！");
    return;
  }
  console.log(workstationForm.id);
  console.log(workstationForm.id === null);

  if (workstationForm.id === null) {
    api
      .createWorkstation({
        code: workstationForm.code,
        location: workstationForm.location,
        switch_id: workstationForm.switch_id,
        distributed_ip_addr: workstationForm.distributed_ip_addr,
        user_id: workstationForm.user_id,
      })
      .then((res: ApiResponse) => {
        if (res.code === 0) {
          message.success("创建成功！");
          showWorkstationModal.value = false;
          resetWorkstationForm(); // 重置表单
          getWorkstationList(); // 刷新列表
        } else {
          message.error(res.message);
        }
      });
  } else {
    api
      .modifyWorkstation({
        id: workstationForm.id,
        code: workstationForm.code,
        location: workstationForm.location,
        switch_id: workstationForm.switch_id,
        distributed_ip_addr: workstationForm.distributed_ip_addr,
        user_id: workstationForm.user_id,
      })
      .then((res: ApiResponse) => {
        if (res.code === 0) {
          message.success("编辑成功！");
          showWorkstationModal.value = false;
          getWorkstationList(); // 刷新列表
          resetWorkstationForm(); // 重置表单
        } else {
          message.error(res.message);
        }
      });
  }
};

const resetWorkstationForm = () => {
  workstationForm.id = null;
  workstationForm.code = "";
  workstationForm.location = "";
  workstationForm.switch_id = null;
  workstationForm.distributed_ip_addr = "";
  workstationForm.distributed_gateway = "";
  workstationForm.distributed_dns = "";
  workstationForm.distributed_mask = "";
  workstationForm.user_id = null;
};
</script>

<style scoped>
#container {
  align-items: center;
  margin-left: 15%;
}

.order-card {
  width: 80%;
  align-items: center;
}

.order-table {
}

.header-actions {
  width: 80%;
  margin: 0 auto 16px auto;
  text-align: right;
}
</style>
