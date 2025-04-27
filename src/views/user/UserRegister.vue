<template>
  <div id="register" class="register-container">
    <a-form
      class="register-form"
      :model="formState"
      @finish="register"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
      hide-required-mark="true"
    >
      <a-typography-title :level="3" class="form-title"
        >用户注册
      </a-typography-title>

      <a-form-item
        label="用户名"
        name="username"
        :rules="checkRules.username"
        hasFeedback
      >
        <a-input
          v-model:value="formState.username"
          placeholder="请输入4-16位用户名"
          allowClear
        >
          <template #prefix>
            <UserOutlined />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item
        label="昵称"
        name="nickname"
        :rules="checkRules.nickname"
        hasFeedback
      >
        <a-input
          v-model:value="formState.nickname"
          placeholder="请输入您的昵称"
          allowClear
        >
          <template #prefix>
            <SmileOutlined />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item
        label="手机号"
        name="phone"
        :rules="checkRules.phone"
        hasFeedback
      >
        <a-input
          v-model:value="formState.phone"
          placeholder="11位手机号码"
          allowClear
        >
          <template #prefix>
            <MobileOutlined />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item label="性别" name="gender" :rules="checkRules.gender">
        <a-select
          v-model:value="formState.gender"
          placeholder="请选择性别"
          allowClear
        >
          <a-select-option value="male">男</a-select-option>
          <a-select-option value="female">女</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="密码"
        name="password"
        :rules="checkRules.password"
        hasFeedback
      >
        <a-input-password
          v-model:value="formState.password"
          placeholder="至少8位密码"
          allowClear
        >
          <template #prefix>
            <LockOutlined />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item
        label="确认密码"
        name="confirmPassword"
        :rules="[
          ...checkRules.confirmPassword,
          { validator: validatePassword },
        ]"
        hasFeedback
      >
        <a-input-password
          v-model:value="formState.confirmPassword"
          placeholder="请再次输入密码"
          allowClear
        >
          <template #prefix>
            <SafetyOutlined />
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
          立即注册
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  UserOutlined,
  LockOutlined,
  SmileOutlined,
  MobileOutlined,
  SafetyOutlined,
} from "@ant-design/icons-vue";
import api from "@/api/api";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { ApiResponse } from "@/utils/axios";

const formState = ref({
  username: "",
  nickname: "",
  phone: "",
  gender: undefined,
  password: "",
  confirmPassword: "",
});

// 增强验证规则
const checkRules = {
  username: [
    { required: true, message: "请输入用户名" },
    { min: 4, max: 16, message: "用户名长度4-16位" },
  ],
  nickname: [{ required: true, message: "请输入昵称!" }],
  phone: [{ required: true, message: "请输入手机号!" }],
  gender: [{ required: true, message: "请选择性别!" }],
  password: [{ required: true, message: "请输入密码!" }],
  confirmPassword: [{ required: true, message: "请确认密码!" }],
};

const validatePassword = async (_rule: never, value: string) => {
  if (value !== formState.value.password) {
    throw new Error("两次输入的密码不一致!");
  }
};

const router = useRouter();

// 提交状态
const submitting = ref(false);
const register = async () => {
  const params = {
    username: formState.value.username,
    password: formState.value.password,
    confirm_password: formState.value.confirmPassword,
    nickname: formState.value.nickname,
    phone: formState.value.phone,
    gender: formState.value.gender == "male" ? 0 : 1,
  };
  submitting.value = true;
  try {
    api
      .userRegister(params)
      .then((res: ApiResponse) => {
        if (res.code == 0) {
          message.success("注册成功!");
          router.push("/user/login");
        } else {
          message.error(res.message);
        }
      })
      .catch(() => {
        message.error("注册失败!");
      });
  } catch (e) {
    message.error("注册失败!");
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.register-container {
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

.register-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
}

.register-form {
  width: 520px;
  margin: auto;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative; /* 确保表单在遮罩层之上 */
  z-index: 1;
  margin-top: 100px;
}

.form-title {
  text-align: center;
  margin-bottom: 30px;
  color: rgba(0, 0, 0, 0.85);
}

.submit-btn {
  width: 100%;
  margin-top: 12px;
}

:deep(.ant-input-affix-wrapper) {
  padding: 8px 11px;
}

:deep(.ant-select-selector) {
  padding: 4px 11px;
}
</style>
