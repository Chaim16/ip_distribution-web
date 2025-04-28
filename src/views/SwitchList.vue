<template>
  <div id="container">
    <a-card title="交换机列表" bordered class="order-card">
      <!-- 创建按钮 -->
      <div class="header-actions">
        <a-button type="primary" @click="toCreateSwitch">创建</a-button>
      </div>
      <a-table
        :dataSource="switchList"
        :columns="columns"
        :pagination="pagination"
        class="order-table"
        rowKey="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'operate'">
            <a-popconfirm
              title="确定要删除吗？"
              ok-text="确认"
              cancel-text="取消"
              @confirm="deleteswitch(record)"
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
    </a-card>

    <a-modal
      v-model:visible="showSwitchModal"
      title="工位信息"
      @ok="handleSubmit"
      @cancel="resetswitchForm"
      ok-text="保存"
      cancel-text="取消"
    >
      <a-form
        :model="switchForm"
        :labelCol="{ span: 5 }"
        :wrapperCol="{ span: 19 }"
        style="margin-top: 50px"
      >
        <a-form-item label="上联交换机">
          <a-select :options="switchList"></a-select>
          <a-input
            v-model:value="switchForm.name"
            placeholder="请输入路由器名称"
          />
        </a-form-item>
        <a-form-item label="型号">
          <a-input v-model:value="switchForm.model" placeholder="请输入型号" />
        </a-form-item>
        <a-form-item label="端口数量">
          <a-input-number
            v-model:value="switchForm.port_num"
            :default-value="20"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="所在位置">
          <a-input
            v-model:value="switchForm.location"
            placeholder="请输入位置"
          />
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

const switchList = ref([]);

const getSwitchList = () => {
  console.log(123);
  api.switchList({}).then((res: ApiResponse) => {
    if (res.code === 0) {
      switchList.value = res.data?.list.map((item: object) => {
        return item;
      });
    } else {
      message.error(res.message);
    }
  });
};

const pagination = ref({
  pageSize: 10,
  current: 1,
  total: switchList.value.length,
});

watch(switchList, () => {
  pagination.value.total = switchList.value.length;
});

const columns = [
  { title: "序号", dataIndex: "id", key: "id" },
  { title: "编号", dataIndex: "code", key: "code" },
  { title: "所在位置", dataIndex: "location", key: "location" },
  {
    title: "IP地址",
    dataIndex: "ip_addr",
    key: "ip_addr",
  },
  { title: "网关", dataIndex: "gateway", key: "gateway" },
  { title: "DNS", dataIndex: "dns", key: "dns" },
  { title: "子网掩码", dataIndex: "mask", key: "mask" },
];

const deleteswitch = (record) => {
  const params = { username: record.username };
  api.deleteswitch(params).then((res: ApiResponse) => {
    if (res.code === 0) {
      message.success("删除成功");
      getSwitchList();
    } else {
      message.error(res.message);
    }
  });
};

const showSwitchModal = ref(false);

const switchForm = reactive({
  id: null,
  name: "",
  model: "",
  port_num: 1,
  location: "",
});

const toCreateSwitch = ref(() => {
  resetSwitchForm();
  getSwitchList();
  showSwitchModal.value = true;
});

const toModifySwitch = ref((record) => {
  // 获取详情
  api.routerDetail({ id: record.id }).then((res: ApiResponse) => {
    if (res.code === 0) {
      const data = res.data;
      switchForm.id = data.id;
      switchForm.name = data.name;
      switchForm.model = data.model;
      switchForm.port_num = data.port_num;
      switchForm.location = data.location;
    } else {
      message.error(res.message);
    }
  });
  showSwitchModal.value = true;
});

const handleSubmit = () => {
  console.log(123);
  if (
    !switchForm.name ||
    !switchForm.model ||
    !switchForm.port_num ||
    !switchForm.location
  ) {
    message.warning("请填写完整信息！");
    return;
  }
  console.log(switchForm.id);
  console.log(switchForm.id === null);

  if (switchForm.id === null) {
    api
      .createRouter({
        name: switchForm.name,
        model: switchForm.model,
        port_num: switchForm.port_num,
        location: switchForm.location,
      })
      .then((res: ApiResponse) => {
        if (res.code === 0) {
          message.success("创建成功！");
          showSwitchModal.value = false;
          resetSwitchForm(); // 重置表单
          getSwitchList(); // 刷新列表
        } else {
          message.error(res.message);
        }
      });
  } else {
    api
      .modifyRouter({
        id: switchForm.id,
        name: switchForm.name,
        model: switchForm.model,
        port_num: switchForm.port_num,
        location: switchForm.location,
      })
      .then((res: ApiResponse) => {
        if (res.code === 0) {
          message.success("编辑成功！");
          showSwitchModal.value = false;
          getSwitchList(); // 刷新列表
          resetSwitchForm(); // 重置表单
        } else {
          message.error(res.message);
        }
      });
  }
};

const resetSwitchForm = () => {
  switchForm.id = null;
  switchForm.name = "";
  switchForm.model = "";
  switchForm.port_num = 1;
  switchForm.location = "";
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
