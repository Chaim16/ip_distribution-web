<template>
  <div id="container">
    <a-card title="订单列表" bordered class="order-card">
      <a-table
        :dataSource="orderList"
        :columns="columns"
        :pagination="pagination"
        class="order-table"
        rowKey="id"
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
                title="确定要退回订单吗？"
                ok-text="确认"
                cancel-text="取消"
                @confirm="handleReturnOrder(record)"
                :disabled="record.status !== 'paid'"
              >
                <a-button size="small" :disabled="record.status !== 'paid'">
                  原路退回
                </a-button>
              </a-popconfirm>

              <a-popconfirm
                title="确定要删除吗？"
                ok-text="确认"
                cancel-text="取消"
                @confirm="deleteOrder(record)"
              >
                <a-button danger size="small">删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { message } from "ant-design-vue";
import api from "@/api/api";
import { ApiResponse } from "@/utils/axios";
import { ORDER_STATUS_MAP } from "../../utils/constant";
import formatTimestamp from "@/utils/public";

const orderList = ref([]);

const getOrderList = () => {
  api.routerList({}).then((res: ApiResponse) => {
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

const pagination = ref({
  pageSize: 10,
  current: 1,
  total: orderList.value.length,
});

watch(orderList, () => {
  pagination.value.total = orderList.value.length;
});

const columns = [
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
    title: "购买人",
    key: "buyer",
    dataIndex: "buyer",
  },
  {
    title: "操作",
    key: "operate",
    dataIndex: "operate",
    width: 240,
  },
];

const handleReturnOrder = (record: object) => {
  const params = {
    order_id: record.id,
  };
  api.returnOrder(params).then((res: ApiResponse) => {
    if (res.code === 0) {
      message.success("退回成功");
      getOrderList();
    } else {
      message.error(res.message);
    }
  });
};

const deleteOrder = (record) => {
  api.deleteOrder({ order_id: record.id }).then((res: ApiResponse) => {
    if (res.code === 0) {
      message.success("删除成功");
      getOrderList();
    } else {
      message.error(res.message);
    }
  });
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
</style>
