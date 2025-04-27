import { StoreOptions } from "vuex";
import api from "@/api/api";
import router from "@/router"; // 直接导入router实例

export default {
  namespaced: true,

  // state：存储的状态信息，比如用户信息
  state: () => ({
    loginUser: {
      username: "未登录",
      role: "unknown",
    },
    isAuthenticated: localStorage.getItem("isAuthenticated") === "true", // 用于标识用户是否已登录
  }),

  // actions：执行异步操作，并且触发mutation的更改，（调用mutation）
  actions: {
    // 该方法应在应用启动时被调用，确保状态同步
    async initialize() {
      if (localStorage.getItem("isAuthenticated") === "true") {
        // 如果已登录，尝试从后端获取用户信息
        await this.dispatch("user/getLoginUser");
      }
    },

    async getLoginUser({ commit }) {
      try {
        const res = await api.whoami();
        if (res.code === 0) {
          const loginUser = {
            username: res.data.username,
            role: res.data.role,
          };
          commit("updateUser", loginUser);
          commit("setAuthenticated", true);
          localStorage.setItem("isAuthenticated", "true");
        }
      } catch (e) {
        console.error("获取用户信息失败", e);
        router.push("/user/login");
      }
    },

    async logout({ commit }) {
      commit("updateUser", { username: "未登录", role: "unknown" });
      commit("setAuthenticated", false);
      localStorage.removeItem("isAuthenticated");
    },
  },

  // mutations：提供更新状态值的方法
  mutations: {
    updateUser(state, payload) {
      state.loginUser = payload;
    },
    setAuthenticated(state, isAuthenticated: boolean) {
      state.isAuthenticated = isAuthenticated;
    },
  },
} as StoreOptions<any>;
