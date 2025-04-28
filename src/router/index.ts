import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import {
  HomeOutlined,
  SwapOutlined,
  UserOutlined,
  PlusOutlined,
  ShrinkOutlined,
} from "@ant-design/icons-vue";
import UserRegister from "@/views/user/UserRegister.vue";
import UserLogin from "@/views/user/UserLogin.vue";
import HomeView from "@/views/HomeView.vue";
import { ACCESS_ENUM } from "@/utils/constant";
import RouterList from "@/views/RouterList.vue";
import UserManagement from "@/views/user/UserManagement.vue";
import WorkstationList from "@/views/WorkstationList.vue";
import SwitchList from "@/views/SwitchList.vue";
import RouterPort from "@/views/RouterPort.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "首页",
    meta: {
      icon: HomeOutlined,
      access: ACCESS_ENUM.UNKNOWN,
    },
    component: HomeView,
  },
  {
    path: "/router",
    name: "路由器管理",
    meta: {
      icon: SwapOutlined,
      access: ACCESS_ENUM.ADMINISTRATOR,
    },
    component: RouterList,
  },
  {
    path: "/router_port",
    name: "端口列表",
    component: RouterPort,
    meta: {
      hideInMenu: true,
      access: ACCESS_ENUM.ADMINISTRATOR,
    },
  },
  {
    path: "/switch",
    name: "交换机管理",
    meta: {
      icon: UserOutlined,
      access: ACCESS_ENUM.ADMINISTRATOR,
    },
    component: SwitchList,
  },
  {
    path: "/workstation",
    name: "工位管理",
    meta: {
      icon: ShrinkOutlined,
      access: ACCESS_ENUM.ADMINISTRATOR,
    },
    component: WorkstationList,
  },
  {
    path: "/user/management",
    name: "用户管理",
    meta: {
      icon: ShrinkOutlined,
      access: ACCESS_ENUM.ADMINISTRATOR,
    },
    component: UserManagement,
  },
  {
    path: "/user/register",
    name: "用户注册",
    component: UserRegister,
    meta: {
      hideInMenu: true,
      access: ACCESS_ENUM.UNKNOWN,
    },
  },
  {
    path: "/user/login",
    name: "用户登录",
    component: UserLogin,
    meta: {
      hideInMenu: true,
      access: ACCESS_ENUM.UNKNOWN,
    },
  },
];

export { routes };

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
