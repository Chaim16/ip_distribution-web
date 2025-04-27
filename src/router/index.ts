import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import MarketCenter from "../views/MarketCenter.vue";
import {
  HomeOutlined,
  SwapOutlined,
  UserOutlined,
  PlusOutlined,
  ShrinkOutlined,
  PicRightOutlined,
  AlignCenterOutlined,
} from "@ant-design/icons-vue";
import UserRegister from "@/views/user/UserRegister.vue";
import UserLogin from "@/views/user/UserLogin.vue";
import HomeView from "@/views/HomeView.vue";
import UserProfile from "@/views/user/UserProfile.vue";
import PublishDraft from "@/views/PublishDraft.vue";
import { ACCESS_ENUM } from "@/utils/constant";
import DesignerApplication from "@/views/DesignerApplication.vue";
import UserManagement from "@/views/user/UserManagement.vue";
import OrderManagement from "@/views/order/OrderManagement.vue";

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
    path: "/market",
    name: "画稿中心",
    meta: {
      icon: SwapOutlined,
      access: ACCESS_ENUM.UNKNOWN,
    },
    component: MarketCenter,
  },
  {
    path: "/profile",
    name: "个人中心",
    meta: {
      icon: UserOutlined,
      access: ACCESS_ENUM.GENERAL,
    },
    component: UserProfile,
  },
  {
    path: "/release",
    name: "发布画稿",
    meta: {
      icon: PlusOutlined,
      access: ACCESS_ENUM.DESIGNER,
    },
    component: PublishDraft,
  },
  {
    path: "/designer_application",
    name: "设计师申请管理",
    meta: {
      icon: ShrinkOutlined,
      access: ACCESS_ENUM.ADMINISTRATOR,
    },
    component: DesignerApplication,
  },
  {
    path: "/user/management",
    name: "用户管理",
    meta: {
      icon: PicRightOutlined,
      access: ACCESS_ENUM.ADMINISTRATOR,
    },
    component: UserManagement,
  },
  {
    path: "/order/management",
    name: "订单管理",
    meta: {
      icon: AlignCenterOutlined,
      access: ACCESS_ENUM.ADMINISTRATOR,
    },
    component: OrderManagement,
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
