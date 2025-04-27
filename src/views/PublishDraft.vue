<template>
  <div id="publish-draft" :style="backgroundStyle" class="background-container">
    <a-form
      class="publish-form"
      :model="formState"
      @submit="publish"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 19 }"
      hide-required-mark="true"
    >
      <a-typography-title :level="3" class="form-title"
        >发布作品
      </a-typography-title>

      <a-form-item
        label="标题"
        name="title"
        :rules="checkRules.title"
        hasFeedback
      >
        <a-input
          v-model:value="formState.title"
          placeholder="请输入作品标题"
          allowClear
        >
          <template #prefix>
            <EditOutlined />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item
        label="描述"
        name="description"
        :rules="checkRules.description"
      >
        <a-textarea
          v-model:value="formState.description"
          :rows="4"
          placeholder="请输入作品描述（最多500字）"
          allowClear
          show-count
          :maxlength="500"
        >
          <template #prefix>
            <FileTextOutlined />
          </template>
        </a-textarea>
      </a-form-item>

      <a-form-item
        label="价格"
        name="price"
        :rules="checkRules.price"
        hasFeedback
      >
        <a-input-number
          v-model:value="formState.price"
          :min="0"
          placeholder="请输入金额"
          class="full-width"
        >
          <template #prefix>
            <DollarOutlined />
          </template>
        </a-input-number>
      </a-form-item>

      <a-form-item
        label="分类"
        name="categoryId"
        :rules="checkRules.categoryId"
      >
        <a-select
          v-model:value="formState.categoryId"
          placeholder="请选择作品分类"
          allowClear
        >
          <template #prefix>
            <AppstoreOutlined />
          </template>
          <a-select-option value="1">插画</a-select-option>
          <a-select-option value="2">概念设计</a-select-option>
          <a-select-option value="3">角色设计</a-select-option>
          <a-select-option value="4">场景设计</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="图片" name="image">
        <a-upload
          v-model:file-list="fileList"
          list-type="picture-card"
          :before-upload="beforeUpload"
          @preview="handlePreview"
          accept="image/*"
          :max-count="1"
        >
          <div class="upload-area">
            <plus-outlined />
            <div class="upload-text">点击上传</div>
            <div class="upload-hint">支持JPG/PNG格式，小于5MB</div>
          </div>
        </a-upload>
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 5, span: 19 }">
        <a-button
          type="primary"
          html-type="submit"
          size="large"
          class="submit-btn"
          :loading="submitting"
        >
          立即发布
        </a-button>
      </a-form-item>
    </a-form>

    <a-modal
      :visible="previewVisible"
      :footer="null"
      @cancel="previewVisible = false"
    >
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import { computed } from "vue";
import { message, UploadFile } from "ant-design-vue";
// 新增图标引入
import {
  EditOutlined,
  FileTextOutlined,
  DollarOutlined,
  AppstoreOutlined,
} from "@ant-design/icons-vue";
import api from "@/api/api";
import { ApiResponse } from "@/utils/axios";
import router from "@/router";

const formState = ref({
  title: "",
  description: "",
  price: "",
  categoryId: "",
});

const fileList = ref<UploadFile[]>([]);
const previewVisible = ref(false);
const previewImage = ref("");
const backgroundImageUrl = ref("");

const checkRules = {
  title: [
    { required: true, message: "请输入画稿标题" },
    { min: 4, max: 30, message: "标题长度4-30个字符" },
  ],
  description: [
    { required: true, message: "请输入画稿描述" },
    { max: 500, message: "描述内容不超过500字" },
  ],
  price: [
    { required: true, message: "请输入价格" },
    { type: "number", min: 0, message: "价格不能小于0" },
  ],
  categoryId: [{ required: true, message: "请选择分类!" }],
};

// 提交状态
const submitting = ref(false);

const beforeUpload = (file: File) => {
  const isImage = file.type === "image/jpeg" || file.type === "image/png";
  const isWithinSizeLimit = file.size / 1024 / 1024 < 5; // 小于5MB

  if (!isImage) {
    message.error("请上传 JPG/PNG 格式的图片！");
    return false;
  }

  if (!isWithinSizeLimit) {
    message.error("上传图片大小不能超过 5MB！");
    return false;
  }

  return true;
};

// 计算属性处理背景样式
const backgroundStyle = computed(() => ({
  backgroundImage: backgroundImageUrl.value
    ? `url(${backgroundImageUrl.value})`
    : "none",
}));

const handlePreview = (file: UploadFile) => {
  previewImage.value = file.url || file.thumbUrl;
  previewVisible.value = true;
};

const publish = () => {
  const formData = new FormData();
  formData.append("image", fileList.value[0]?.originFileObj);
  formData.append("title", formState.value.title);
  formData.append("price", formState.value.price);
  formData.append("description", formState.value.description);
  formData.append("category_id", formState.value.categoryId);

  api.publishDraft(formData).then((res: ApiResponse) => {
    if (res.code === 0) {
      message.info("发布成功");
      router.push("/market");
    } else {
      message.error(res.message);
    }
  });
  console.log(formState.value, fileList.value);
};
</script>

<style scoped>
#publish-draft {
  padding: 40px 24px;
  min-height: 100vh;
}

.publish-form {
  margin: auto;
  max-width: 600px;
  padding: 32px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

/* 表单项间距优化 */
:deep(.ant-form-item) {
  margin-bottom: 24px;
}

/* 标签样式增强 */
:deep(.ant-form-item-label label) {
  font-weight: 500;
  color: #2c3e50;
}

.background-container {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: background-image 0.5s ease;
  position: relative;
}

/* 添加遮罩层提升可读性 */
.background-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  background: rgba(255, 255, 255, 0.92);
}

/* 提升表单可见性 */
.publish-form {
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(4px);
}

/* 调整阴影增强对比度 */
.publish-form {
  margin: 40px auto;
  padding: 40px;
  max-width: 720px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

/* 新增样式 */
.form-title {
  text-align: center;
  margin-bottom: 30px;
  color: rgba(0, 0, 0, 0.85);
}

.submit-btn {
  width: 100%;
  margin-top: 20px;
}

.full-width {
  width: 100%;
}

.upload-area {
  padding: 12px;
  text-align: center;
}

.upload-text {
  margin-top: 8px;
  color: rgba(0, 0, 0, 0.85);
}

.upload-hint {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

:deep(.ant-upload-list-item) {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
}

:deep(.ant-upload-list-item:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
