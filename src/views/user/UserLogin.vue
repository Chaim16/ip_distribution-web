<template>
  <div id="login" class="login-container">
    <a-form
      class="login-form"
      :model="formState"
      @finish="login"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
      hide-required-mark="true"
    >
      <a-typography-title :level="3" class="form-title"
        >用户登录
      </a-typography-title>

      <a-form-item
        label="用户名"
        name="username"
        :rules="checkRules.username"
        hasFeedback
        style="margin-top: 70px"
      >
        <a-input
          v-model:value="formState.username"
          placeholder="请输入用户名"
          allowClear
        >
          <template #prefix>
            <UserOutlined />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item
        label="密码"
        name="password"
        :rules="checkRules.password"
        hasFeedback
      >
        <a-input-password
          v-model:value="formState.password"
          placeholder="请输入密码"
          allowClear
        >
          <template #prefix>
            <LockOutlined />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 6, span: 18 }">
        <a-button
          type="primary"
          html-type="submit"
          size="large"
          class="submit-btn"
          :loading="submitting"
        >
          立即登录
        </a-button>
        <div class="register-extra">
          <span>没有账号？</span>
          <router-link to="/user/register">立即注册</router-link>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import api from "@/api/api";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { ApiResponse } from "@/utils/axios";
import { useStore } from "vuex";

const formState = ref({
  username: "",
  password: "",
});

const checkRules = {
  username: [{ required: true, message: "请输入用户名" }],
  password: [{ required: true, message: "请输入密码" }],
};

const store = useStore(); // 获取 Vuex store 实例
const router = useRouter();

const submitting = ref(false);
const login = () => {
  const params = {
    username: formState.value.username,
    password: formState.value.password,
  };
  submitting.value = true;
  try {
    api.userLogin(params).then((res: ApiResponse) => {
      localStorage.setItem("access_token", res.access);
      localStorage.setItem("refresh_token", res.refresh);
      store.dispatch("user/getLoginUser");
      router.push("/router");
      message.success("登录成功");
    });
  } catch (e) {
    message.error("登录失败");
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: #f0f2f5;
  /* 修改背景为图片并添加遮罩 */
  background-image: url("@/assets/login_background.png");
  background-size: cover;
  background-position: center;
  position: relative;
}

.login-form {
  width: 520px;
  margin: auto;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative; /* 确保表单在遮罩层之上 */
  z-index: 1;
  margin-top: 200px;
}

.form-title {
  text-align: center;
  margin-bottom: 30px;
  color: rgba(0, 0, 0, 0.85);
}

.submit-btn {
  width: 80%;
  margin-top: 12px;
}

/* 共用注册页面的样式，无需重复编写 */
.register-extra {
  margin-top: 16px;
  text-align: center;
  color: rgba(0, 0, 0, 0.45);
}

.register-extra a {
  color: #1890ff;
  margin-left: 8px;
}

.register-extra a:hover {
  color: #40a9ff;
}
</style>
