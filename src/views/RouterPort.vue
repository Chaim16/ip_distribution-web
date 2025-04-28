<template>
  <div id="container">
    <a-card title="路由器端口" bordered class="order-card">
      <!-- 创建按钮 -->
      <div class="header-actions">
        <a-button type="primary" @click="toCreateRouter">创建</a-button>
      </div>
      <a-table
        :dataSource="routerPortList"
        :columns="columns"
        :pagination="pagination"
        class="router-table"
        rowKey="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'create_time'">
            {{ formatTimestamp(record.create_time) }}
          </template>
          <template v-else-if="column.key === 'operate'">
            <a-space>
              <a-button
                type="primary"
                size="small"
                @click="toModifyRouterPort(record)"
                >编辑
              </a-button>
              <a-popconfirm
                title="确定要删除吗？"
                ok-text="确认"
                cancel-text="取消"
                @confirm="deleteRouterPort(record)"
              >
                <a-button danger size="small">删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal
      v-model:visible="showRouterPortModal"
      title="端口信息"
      @ok="handleSubmit"
      @cancel="resetRouterPortForm"
      ok-text="保存"
      cancel-text="取消"
    >
      <a-form
        :model="routerPortForm"
        :labelCol="{ span: 5 }"
        :wrapperCol="{ span: 19 }"
        style="margin-top: 50px"
      >
        <a-form-item label="名称">
          <a-input
            v-model:value="routerPortForm.name"
            placeholder="请输入路由器名称"
          />
        </a-form-item>
        <a-form-item label="型号">
          <a-input
            v-model:value="routerPortForm.model"
            placeholder="请输入型号"
          />
        </a-form-item>
        <a-form-item label="端口数量">
          <a-input-number
            v-model:value="routerPortForm.port_num"
            :default-value="20"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="所在位置">
          <a-input
            v-model:value="routerPortForm.location"
            placeholder="请输入位置"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { message } from "ant-design-vue";
import api from "@/api/api";
import { ApiResponse } from "@/utils/axios";
import formatTimestamp from "@/utils/public";
import { useRoute } from "vue-router";

const route = useRoute();

const router_id = ref(null);
if (route.query.router_id) {
  router_id.value = route.query.router_id;
}

const routerPortList = ref([]);

const getRouterPortList = () => {
  const params = {};
  if (router_id.value) {
    params.router_id = router_id.value;
  }
  api.routerPortList({}).then((res: ApiResponse) => {
    if (res.code === 0) {
      routerPortList.value = res.data?.list.map((item) => item);
    } else {
      message.error(res.message);
    }
  });
};
getRouterPortList();

const pagination = ref({
  pageSize: 10,
  current: 1,
  total: routerPortList.value.length,
});

watch(routerPortList, () => {
  pagination.value.total = routerPortList.value.length;
});

const columns = [
  { title: "ID", key: "id", dataIndex: "id", width: 180 },
  { title: "名称", key: "name", dataIndex: "name" },
  { title: "型号", key: "model", dataIndex: "model" },
  { title: "端口数量", key: "port_num", dataIndex: "port_num" },
  { title: "所在位置", key: "location", dataIndex: "location" },
  { title: "创建时间", key: "create_time", dataIndex: "create_time" },
  { title: "操作", key: "operate", dataIndex: "operate", width: 240 },
];

const deleteRouterPort = (record) => {
  api.deleteRouter({ id: record.id }).then((res: ApiResponse) => {
    if (res.code === 0) {
      message.success("删除成功");
      getRouterPortList();
    } else {
      message.error(res.message);
    }
  });
};

const showRouterPortModal = ref(false);

const routerPortForm = reactive({
  id: null,
  name: "",
  model: "",
  port_num: 1,
  location: "",
});

const toCreateRouter = ref(() => {
  resetRouterPortForm();
  showRouterPortModal.value = true;
});

const toModifyRouterPort = ref((record) => {
  // 获取详情
  api.routerDetail({ id: record.id }).then((res: ApiResponse) => {
    if (res.code === 0) {
      const data = res.data;
      routerPortForm.id = data.id;
      routerPortForm.name = data.name;
      routerPortForm.model = data.model;
      routerPortForm.port_num = data.port_num;
      routerPortForm.location = data.location;
    } else {
      message.error(res.message);
    }
  });
  showRouterPortModal.value = true;
});

const handleSubmit = () => {
  console.log(123);
  if (
    !routerPortForm.name ||
    !routerPortForm.model ||
    !routerPortForm.port_num ||
    !routerPortForm.location
  ) {
    message.warning("请填写完整信息！");
    return;
  }
  console.log(routerPortForm.id);
  console.log(routerPortForm.id === null);

  if (routerPortForm.id === null) {
    api
      .createRouter({
        name: routerPortForm.name,
        model: routerPortForm.model,
        port_num: routerPortForm.port_num,
        location: routerPortForm.location,
      })
      .then((res: ApiResponse) => {
        if (res.code === 0) {
          message.success("创建成功！");
          showRouterPortModal.value = false;
          resetRouterPortForm(); // 重置表单
          getRouterPortList(); // 刷新列表
        } else {
          message.error(res.message);
        }
      });
  } else {
    api
      .modifyRouter({
        id: routerPortForm.id,
        name: routerPortForm.name,
        model: routerPortForm.model,
        port_num: routerPortForm.port_num,
        location: routerPortForm.location,
      })
      .then((res: ApiResponse) => {
        if (res.code === 0) {
          message.success("编辑成功！");
          showRouterPortModal.value = false;
          getRouterPortList(); // 刷新列表
          resetRouterPortForm(); // 重置表单
        } else {
          message.error(res.message);
        }
      });
  }
};

const resetRouterPortForm = () => {
  routerPortForm.id = null;
  routerPortForm.name = "";
  routerPortForm.model = "";
  routerPortForm.port_num = 1;
  routerPortForm.location = "";
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

.router-table {
}

.header-actions {
  width: 80%;
  margin: 0 auto 16px auto;
  text-align: right;
}
</style>
