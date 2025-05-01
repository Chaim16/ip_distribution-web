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
            <a-button
              type="primary"
              size="small"
              @click="toModifySwitch(record)"
              style="margin-right: 10px"
              >编辑
            </a-button>
            <a-popconfirm
              title="确定要删除吗？"
              ok-text="确认"
              cancel-text="取消"
              @confirm="deleteswitch(record)"
              :disabled="record.role === 'administrator'"
            >
              <a-button
                size="small"
                danger
                :disabled="record.role === 'administrator'"
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
      title="交换机信息"
      @ok="handleSubmit"
      @cancel="resetswitchForm"
      ok-text="保存"
      cancel-text="取消"
    >
      <a-form
        :model="switchForm"
        :labelCol="{ span: 4 }"
        :wrapperCol="{ span: 23 }"
        style="margin-top: 50px"
      >
        <a-form-item label="名称">
          <a-input v-model:value="switchForm.name" placeholder="请输入名称" />
        </a-form-item>
        <a-form-item label="编号">
          <a-input v-model:value="switchForm.code" placeholder="请输入编号" />
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
        <a-form-item label="上联路由器">
          <a-select
            v-model:value="switchForm.router_id"
            @change="getRouterPortList"
            :options="routerList"
            :field-names="{ label: 'name', value: 'id' }"
          >
          </a-select>
        </a-form-item>
        <a-form-item label="上联端口">
          <a-select
            v-model:value="switchForm.router_port_id"
            :options="routerPortList"
            :field-names="{ label: 'label', value: 'id' }"
          ></a-select>
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

getSwitchList();

const pagination = ref({
  pageSize: 10,
  current: 1,
  total: switchList.value.length,
});

watch(switchList, () => {
  pagination.value.total = switchList.value.length;
});

const columns = [
  { title: "ID", dataIndex: "id", key: "id" },
  { title: "名称", dataIndex: "name", key: "name" },
  { title: "编号", dataIndex: "code", key: "code" },
  { title: "型号", dataIndex: "model", key: "model" },
  { title: "所在位置", dataIndex: "location", key: "location" },
  {
    title: "端口数量",
    dataIndex: "port_num",
    key: "port_num",
  },
  { title: "上联路由器", dataIndex: "router_name", key: "router_name" },
  { title: "上联端口", dataIndex: "router_port_code", key: "router_port_code" },

  { title: "网关", dataIndex: "gateway", key: "gateway" },
  { title: "DNS", dataIndex: "dns", key: "dns" },
  { title: "子网掩码", dataIndex: "mask", key: "mask" },
  { title: "创建时间", dataIndex: "create_time", key: "create_time" },
  { title: "操作", key: "operate" },
];

const deleteswitch = (record) => {
  const params = { id: record.id };
  api.deleteSwitch(params).then((res: ApiResponse) => {
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
  code: "",
  model: "",
  location: "",
  router_id: "",
  router_port_id: "",
  port_num: 20,
});

const routerList = ref([]);
const routerPortList = ref([]);

const getRouterList = () => {
  api.routerList({}).then((res: ApiResponse) => {
    if (res.code === 0) {
      routerList.value = res.data?.list.map((item: object) => {
        return item;
      });
    } else {
      message.error(res.message);
    }
  });
};

const getRouterPortList = () => {
  const params = {};
  if (!switchForm.router_id) {
    return;
  }
  params.router_id = switchForm.router_id;
  api.routerPortList(params).then((res: ApiResponse) => {
    if (res.code === 0) {
      routerPortList.value = res.data?.list.map((item: object) => {
        item.label =
          item.code +
          " 网关" +
          item.gateway +
          " 起始" +
          item.start_addr +
          " 结束" +
          item.end_addr;
        console.log(item.label);
        return item;
      });
    } else {
      message.error(res.message);
    }
  });
};

const toCreateSwitch = ref(() => {
  getRouterList();
  resetSwitchForm();
  getSwitchList();
  showSwitchModal.value = true;
});

const toModifySwitch = ref((record) => {
  getRouterList();
  // 获取详情
  api.switchDetail({ id: record.id }).then((res: ApiResponse) => {
    if (res.code === 0) {
      const data = res.data;
      switchForm.id = data.id;
      switchForm.code = data.code;
      switchForm.name = data.name;
      switchForm.model = data.model;
      switchForm.router_id = data.router_id;
      getRouterPortList();
      switchForm.router_port_id = data.router_port_id;
      switchForm.port_num = data.port_num;
      switchForm.location = data.location;
    } else {
      message.error(res.message);
    }
  });
  showSwitchModal.value = true;
});

const handleSubmit = () => {
  if (
    !switchForm.name ||
    !switchForm.code ||
    !switchForm.model ||
    !switchForm.location ||
    !switchForm.router_id ||
    !switchForm.router_port_id ||
    !switchForm.port_num
  ) {
    message.warning("请填写完整信息！");
    return;
  }
  console.log(switchForm.id);
  console.log(switchForm.id === null);

  if (switchForm.id === null) {
    api
      .createSwitch({
        name: switchForm.name,
        code: switchForm.code,
        location: switchForm.location,
        model: switchForm.model,
        router_id: switchForm.router_id,
        router_port_id: switchForm.router_port_id,
        port_num: switchForm.port_num,
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
      .modifySwitch({
        id: switchForm.id,
        name: switchForm.name,
        code: switchForm.code,
        model: switchForm.model,
        router_id: switchForm.router_id,
        router_port_id: switchForm.router_port_id,
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
  switchForm.code = "";
  switchForm.model = "";
  switchForm.location = "";
  switchForm.router_id = "";
  switchForm.router_port_id = "";
  switchForm.port_num = 20;
};
</script>

<style scoped>
#container {
  align-items: center;
  margin-left: 10%;
  width: 100%;
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
