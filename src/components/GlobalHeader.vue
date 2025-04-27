<template>
  <div id="header">
    <div class="header-left">
      <img class="logo" src="@/assets/logo.png" alt="logo" />
      <span class="system-name">企业网络IP地址管理平台</span>
    </div>
    <div class="header-middle">
      <div class="menu-wrapper">
        <a-menu
          mode="horizontal"
          :selected-keys="selectedKeys"
          :inline-collapsed="false"
        >
          <a-menu-item
            v-for="item in filteredRoutes"
            :key="item.path"
            @click="handleMenuClick(item)"
          >
            <component
              :is="item.meta?.icon"
              v-if="item.meta?.icon"
              class="menu-icon"
            />
            {{ item.name }}
          </a-menu-item>
        </a-menu>
      </div>
    </div>
    <div class="header-right">
      <a-popconfirm
        title="确定要退出登录吗？"
        ok-text="确认"
        cancel-text="取消"
        @confirm="logout"
        @cancel="cancel"
      >
        <div class="login-or-register">
          {{ store.state.user?.loginUser?.username ?? "未登录" }}
        </div>
      </a-popconfirm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { routes } from "@/router";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { computed, ref } from "vue";
import checkAccess from "@/utils/permission";
import { message } from "ant-design-vue";

const route = useRoute();
const selectedKeys = computed(() => [route.path]);

const router = useRouter();
const store = useStore();

// 过滤有效菜单项
const filteredRoutes = computed(() => {
  return routes.filter((item) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    return checkAccess(store.state.user?.loginUser, item.meta?.access);
  });
});

const handleMenuClick = (item: object) => {
  router.push({
    path: item.path,
  });
};

const searchKeyword = ref("");
// 搜索处理函数
const handleSearch = (value: string) => {
  if (value.trim() === "") {
    message.warning("请输入搜索关键字");
    return;
  }
  performSearch(value);
};

const performSearch = (keyword: string) => {
  // 跳转到画稿中心页面，并把关键字作为参数传递
  router.push({
    path: "/market",
    query: {
      keyword: keyword,
    },
  });
};

const logout = () => {
  store.dispatch("user/logout");
  router.push("/user/login");
};
</script>

<style scoped>
#header {
  display: flex;
  align-items: center;
  height: 64px;
  background-color: #40ccff;
  color: white;
  padding: 0 20px;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}

.header-left {
  display: flex;
  gap: 12px;
  margin-left: 20px;
}

.logo {
  height: 48px;
  margin: 10px;
}

.system-name {
  color: white;
  font-weight: 500;
  margin-right: 20px;
  font-size: clamp(16px, 1.2vw, 20px);
}

.header-middle {
  flex: 1; /* 占据剩余空间 */
  display: flex;
  justify-content: space-between; /* 左右分开 */
  align-items: center;
  padding: 0 50px; /* 两侧留白 */
  min-width: 400px; /* 设置最小宽度防止过度挤压 */
  overflow: hidden; /* 防止内容溢出 */
}

/* 菜单 */
#header ::v-deep .ant-menu {
  background-color: #40ccff !important;
  border-bottom: none !important;
  gap: 8px;
}

/* 覆盖菜单项 */
#header ::v-deep .ant-menu-item {
  background-color: transparent !important;
  color: white !important;
  font-size: 16px !important;
}

/* 覆盖悬浮/选中状态背景色 */
#header ::v-deep .ant-menu-item:hover,
#header ::v-deep .ant-menu-item-selected {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.menu-wrapper {
  width: 100%;
}

/* 更新后的搜索框样式 */
.search-wrapper {
  margin-left: auto;
  display: flex;
  align-items: center;
  width: 300px;
}

.search-input ::v-deep .ant-input {
  border-radius: 20px !important;
  background: rgba(255, 255, 255, 0.15) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  padding: 8px 36px 8px 16px;
  color: white !important;
  transition: all 0.3s ease;
  height: 36px;
}

.search-input ::v-deep .ant-input:hover {
  background: rgba(255, 255, 255, 0.25) !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
}

.search-input ::v-deep .ant-input:focus {
  background: rgba(255, 255, 255, 0.3) !important;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2) !important;
}

.search-input ::v-deep .ant-input::placeholder {
  color: rgba(255, 255, 255, 0.7) !important;
  font-weight: 300;
}

.search-input ::v-deep .ant-input-search-button {
  right: 4px;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background: transparent !important;
  border: none !important;
  color: white !important;
}

.search-input ::v-deep .ant-input-search-button:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}

.search-input ::v-deep .anticon-search {
  font-size: 16px;
}

/* 响应式调整 */
@media (max-width: 992px) {
  .search-wrapper {
    width: 200px;
  }

  .search-input ::v-deep .ant-input {
    padding-right: 30px;
    height: 32px;
  }

  .search-input ::v-deep .ant-input-search-button {
    right: 2px;
    width: 28px;
    height: 28px;
  }
}

.search-input ::v-deep .ant-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

/* 右侧登录区域 */
.header-right {
  margin-left: auto; /* 关键属性 */
  display: flex;
  gap: 20px;
  align-items: center;
}

.header-right .login-or-register {
  color: white;
  font-size: 16px;
  font-weight: 500;
  margin-right: 66px;
  margin-top: 5px;
}

.header-right .login-or-register:hover {
  opacity: 0.8;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .header-middle {
    padding: 0 20px;
  }

  .system-name {
    font-size: 18px;
  }
}

@media (max-width: 992px) {
  .search-wrapper {
    width: 200px;
  }
}
</style>
