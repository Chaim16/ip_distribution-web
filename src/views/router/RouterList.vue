<template>
  <div id="container">
    <a-card title="路由器列表" bordered class="order-card">
      <!-- 创建按钮 -->
      <div class="header-actions">
        <a-button type="primary" @click="toCreateRouter">创建</a-button>
      </div>
      <a-table
        :dataSource="routerList"
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
                @click="toModifyRouter(record)"
                >编辑
              </a-button>
              <a-popconfirm
                title="确定要删除吗？"
                ok-text="确认"
                cancel-text="取消"
                @confirm="deleteRouter(record)"
              >
                <a-button danger size="small">删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal
      v-model:visible="showRouterModal"
      title="编辑路由器"
      @ok="handleSubmit"
      @cancel="resetRouterForm"
      ok-text="保存"
      cancel-text="取消"
    >
      <a-form
        :model="routerForm"
        :labelCol="{ span: 5 }"
        :wrapperCol="{ span: 19 }"
        style="margin-top: 50px"
      >
        <a-form-item label="名称">
          <a-input
            v-model:value="routerForm.name"
            placeholder="请输入路由器名称"
          />
        </a-form-item>
        <a-form-item label="型号">
          <a-input v-model:value="routerForm.model" placeholder="请输入型号" />
        </a-form-item>
        <a-form-item label="端口数量">
          <a-input-number
            v-model:value="routerForm.port_num"
            :default-value="20"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="所在位置">
          <a-input
            v-model:value="routerForm.location"
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

const routerList = ref([]);

const getRouterList = () => {
  api.routerList({}).then((res: ApiResponse) => {
    if (res.code === 0) {
      routerList.value = res.data?.list.map((item) => item);
    } else {
      message.error(res.message);
    }
  });
};
getRouterList();

const pagination = ref({
  pageSize: 10,
  current: 1,
  total: routerList.value.length,
});

watch(routerList, () => {
  pagination.value.total = routerList.value.length;
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

const deleteRouter = (record) => {
  api.deleteRouter({ id: record.id }).then((res: ApiResponse) => {
    if (res.code === 0) {
      message.success("删除成功");
      getRouterList();
    } else {
      message.error(res.message);
    }
  });
};

const showRouterModal = ref(false);

const routerForm = reactive({
  id: null,
  name: "",
  model: "",
  port_num: 1,
  location: "",
});

const toCreateRouter = ref(() => {
  showRouterModal.value = true;
});

const toModifyRouter = ref((record) => {
  // 获取详情
  api.routerDetail({ id: record.id }).then((res: ApiResponse) => {
    if (res.code === 0) {
      const data = res.data;
      routerForm.id = data.id;
      routerForm.name = data.name;
      routerForm.model = data.model;
      routerForm.port_num = data.port_num;
      routerForm.location = data.location;
    } else {
      message.error(res.message);
    }
  });
  showRouterModal.value = true;
});

const handleSubmit = () => {
  console.log(123);
  if (
    !routerForm.name ||
    !routerForm.model ||
    !routerForm.port_num ||
    !routerForm.location
  ) {
    message.warning("请填写完整信息！");
    return;
  }
  console.log(routerForm.id);
  console.log(routerForm.id === null);

  if (routerForm.id === null) {
    api
      .createRouter({
        name: routerForm.name,
        model: routerForm.model,
        port_num: routerForm.port_num,
        location: routerForm.location,
      })
      .then((res: ApiResponse) => {
        if (res.code === 0) {
          message.success("创建成功！");
          showRouterModal.value = false;
          resetRouterForm(); // 重置表单
          getRouterList(); // 刷新列表
        } else {
          message.error(res.message);
        }
      });
  } else {
    api
      .modifyRouter({
        id: routerForm.id,
        name: routerForm.name,
        model: routerForm.model,
        port_num: routerForm.port_num,
        location: routerForm.location,
      })
      .then((res: ApiResponse) => {
        if (res.code === 0) {
          message.success("编辑成功！");
          showRouterModal.value = false;
          getRouterList(); // 刷新列表
          resetRouterForm(); // 重置表单
        } else {
          message.error(res.message);
        }
      });
  }
};

const resetRouterForm = () => {
  routerForm.id = null;
  routerForm.name = "";
  routerForm.model = "";
  routerForm.port_num = 1;
  routerForm.location = "";
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
