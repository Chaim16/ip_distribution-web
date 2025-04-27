<template>
  <div class="container">
    <div class="draft-list">
      <!-- 商品展示区 -->
      <div class="draft-content">
        <a-row :gutter="[24, 24]" class="draft-content-row">
          <a-col
            v-for="draft in displayedDraft"
            :key="draft.id"
            :xs="6"
            :sm="6"
            :md="6"
            :lg="6"
            :xl="6"
          >
            <a-card hoverable>
              <template #cover>
                <a-image
                  :src="draft.image_path"
                  :preview="false"
                  height="200px"
                  :fallback="fallbackImage"
                  lazy
                />
              </template>
              <a-card-meta>
                <template #title>
                  <div class="draft-title">{{ draft.title }}</div>
                </template>
                <template #description>
                  <div class="product-info">
                    <div class="price">¥{{ draft.price }}</div>
                    <div class="designer">
                      <user-outlined />
                      {{ draft.designer }}
                      <span style="width: 8px"></span>
                      <a-button
                        type="primary"
                        size="small"
                        @click="openPurchaseModal(draft)"
                        >购买
                      </a-button>
                    </div>
                  </div>
                </template>
              </a-card-meta>
            </a-card>
          </a-col>
        </a-row>
      </div>
      <div class="pagination-wrapper">
        <a-pagination
          v-model:current="currentPage"
          :total="totalDraft"
          :page-size="pageSize"
          show-less-items
          show-quick-jumper
          @change="handlePageChange"
        />
      </div>
    </div>

    <!-- 购买模态框 -->
    <a-modal
      v-model:visible="isPurchaseModalVisible"
      title="确认订单"
      @ok="handlePurchase"
      @cancel="closePurchaseModal"
      okText="创建订单"
      cancelText="取消"
      width="400px"
    >
      <div class="purchase-modal-content">
        <div class="draft-detail-wrapper">
          <p>标题: {{ selectedDraft?.title }}</p>
          <p>描述：{{ selectedDraft?.description }}</p>
          <p>设计师：{{ selectedDraft?.designer }}</p>
          <p>价格： ¥{{ selectedDraft?.price }}</p>
        </div>
        <div class="balance-wrapper">您的余额：¥{{ userBalance }}</div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { UserOutlined } from "@ant-design/icons-vue";
import api from "@/api/api";
import { message } from "ant-design-vue";
import { staticURL } from "@/utils/axios";

// 模拟数据（实际应通过API获取）
const draftList = ref([]);

const getDraftList = () => {
  api.draftList({}).then((res) => {
    if (res.code === 0) {
      const data = res.data;
      draftList.value = data?.list.map((draft) => {
        draft.image_path = staticURL + draft.image_name;
        draft.description = draft.description || "无描述"; // 确保描述字段存在
        return draft;
      });
    } else {
      message.error(res.message);
    }
  });
};

getDraftList();

// const route = useRoute();
//
// if (route.query.keyword) {
//   // draftList.value = route.query.data?.list.map((draft) => {
//   //   draft.image_path = staticURL + draft.image_name;
//   //   draft.description = draft.description || "无描述"; // 确保描述字段存在
//   //   return draft;
//   // });
// } else {
//
// }

// 分页配置
const currentPage = ref(1);
const pageSize = ref(8);
const totalDraft = computed(() => draftList.value.length);

// 显示的商品数据
const displayedDraft = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return draftList.value.slice(start, end);
});

// 分页切换
const handlePageChange = (page: number) => {
  currentPage.value = page;
};

// 图片加载失败时使用的默认图
const fallbackImage =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

// 购买模态框
const isPurchaseModalVisible = ref(false);
const selectedDraft = ref(null);
const userBalance = ref(0);
const orderId = ref(null);

const openPurchaseModal = (draft: object) => {
  selectedDraft.value = draft;
  api.userDetail().then((res) => {
    if (res.code === 0) {
      userBalance.value = res.data.balance;
      isPurchaseModalVisible.value = true;
    } else {
      message.error(res.message);
    }
  });
};

const closePurchaseModal = () => {
  isPurchaseModalVisible.value = false;
  selectedDraft.value = null;
  userBalance.value = 0;
  orderId.value = null;
};

const handlePurchase = () => {
  if (selectedDraft.value) {
    const draftPrice = selectedDraft.value.price;
    if (userBalance.value < draftPrice) {
      message.error("余额不足，请充值后重试！");
    } else {
      // 创建订单
      const params = { draft_id: selectedDraft.value.id };
      api.createOrder(params).then((res) => {
        if (res.code === 0) {
          orderId.value = res.data.id;
          message.success("订单创建成功，请跳转到个人中心-我的订单进行支付！");
          isPurchaseModalVisible.value = false;
        } else {
          message.error(res.message);
        }
      });
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 64px); /* 减去头部高度 */
  padding: 24px 0;
}

.draft-list {
  width: 80%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 40px;
}

.draft-content {
  flex: 1;
}

.draft-content-row {
  margin-bottom: 0;
}

.draft-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}

.product-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  color: #ff4d4f;
  font-size: 18px;
  font-weight: bold;
}

.designer {
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination-wrapper {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}

:deep(.ant-card) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.ant-card-cover) {
  background: #f5f5f5;
}

:deep(.ant-image-img) {
  object-fit: cover;
}

.purchase-modal-content {
}

.draft-detail-wrapper {
  margin-top: 24px;
}
</style>
