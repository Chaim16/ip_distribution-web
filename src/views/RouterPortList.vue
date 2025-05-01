<template>
  <div id="container">
    <a-card title="路由器端口" bordered class="order-card">
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
        <a-form-item label="编号">
          <a-input disabled v-model:value="routerPortForm.code" />
        </a-form-item>
        <a-form-item label="起始地址">
          <a-input
            v-model:value="routerPortForm.start_addr"
            placeholder="请输入起始地址"
          />
        </a-form-item>
        <a-form-item label="结束地址">
          <a-input
            v-model:value="routerPortForm.end_addr"
            :default-value="20"
            placeholder="请输入结束地址"
          />
        </a-form-item>
        <a-form-item label="子网掩码">
          <a-input
            v-model:value="routerPortForm.mask"
            placeholder="请输入子网掩码"
          />
        </a-form-item>
        <a-form-item label="网关">
          <a-input
            v-model:value="routerPortForm.gateway"
            placeholder="请输入网关"
          />
        </a-form-item>
        <a-form-item label="DNS">
          <a-input v-model:value="routerPortForm.dns" placeholder="请输入DNS" />
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

const pagination = ref({
  size: 10,
  page: 1,
  count: null,
});

const getRouterPortList = () => {
  const params = {
    page: pagination.value.page,
    size: pagination.value.size,
  };
  if (router_id.value) {
    params.router_id = router_id.value;
  }
  api.routerPortList(params).then((res: ApiResponse) => {
    if (res.code === 0) {
      routerPortList.value = res.data?.list.map((item) => item);
      pagination.value.count = res.data?.count;
    } else {
      message.error(res.message);
    }
  });
};
getRouterPortList();

const columns = [
  { title: "ID", key: "id", dataIndex: "id", width: 180 },
  { title: "编号", key: "code", dataIndex: "code", width: 180 },
  { title: "起始地址", key: "start_addr", dataIndex: "start_addr", width: 180 },
  { title: "结束地址", key: "end_addr", dataIndex: "end_addr", width: 180 },
  { title: "子网掩码", key: "mask", dataIndex: "mask", width: 180 },
  { title: "网关", key: "gateway", dataIndex: "gateway", width: 180 },
  { title: "DNS", key: "dns", dataIndex: "dns", width: 180 },
  { title: "操作", key: "operate", dataIndex: "operate", width: 240 },
];

const showRouterPortModal = ref(false);

const routerPortForm = reactive({
  id: null,
  code: "",
  start_addr: "",
  end_addr: "",
  mask: "",
  gateway: "",
  dns: "",
});

const toCreateRouter = ref(() => {
  resetRouterPortForm();
  showRouterPortModal.value = true;
});

const toModifyRouterPort = ref((record) => {
  // 获取详情
  api.routerPortDetail({ id: record.id }).then((res: ApiResponse) => {
    if (res.code === 0) {
      const data = res.data;
      routerPortForm.id = data.id;
      routerPortForm.code = data.code;
      routerPortForm.start_addr = data.start_addr;
      routerPortForm.end_addr = data.end_addr;
      routerPortForm.mask = data.mask;
      routerPortForm.gateway = data.gateway;
      routerPortForm.dns = data.dns;
    } else {
      message.error(res.message);
    }
  });
  showRouterPortModal.value = true;
});

const handleSubmit = () => {
  console.log(123);
  if (
    !routerPortForm.code ||
    !routerPortForm.start_addr ||
    !routerPortForm.end_addr ||
    !routerPortForm.mask ||
    !routerPortForm.gateway ||
    !routerPortForm.dns
  ) {
    message.warning("请填写完整信息！");
    return;
  }
  console.log(routerPortForm.id);
  console.log(routerPortForm.id === null);

  api
    .modifyRouterPort({
      id: routerPortForm.id,
      code: routerPortForm.code,
      start_addr: routerPortForm.start_addr,
      end_addr: routerPortForm.end_addr,
      mask: routerPortForm.mask,
      gateway: routerPortForm.gateway,
      dns: routerPortForm.dns,
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
};

const resetRouterPortForm = () => {
  routerPortForm.id = null;
  routerPortForm.code = "";
  routerPortForm.start_addr = "";
  routerPortForm.end_addr = "";
  routerPortForm.mask = "";
  routerPortForm.gateway = "";
  routerPortForm.dns = "";
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
