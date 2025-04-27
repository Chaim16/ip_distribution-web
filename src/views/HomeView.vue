<template>
  <div
    class="carousel-container"
    @mouseenter="pauseAutoPlay"
    @mouseleave="startAutoPlay"
  >
    <!-- 轮播内容 -->
    <div class="carousel-track" :style="trackStyle">
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="carousel-item"
        :class="{ active: index === activeIndex }"
      >
        <img :src="slide.image" :alt="slide.title" class="slide-image" />
        <div class="slide-content">
          <h3 class="slide-title">{{ slide.title }}</h3>
          <p class="slide-description">{{ slide.description }}</p>
        </div>
      </div>
    </div>

    <!-- 控制按钮 -->
    <button class="control-btn prev" @click="prevSlide">
      <arrow-left-outlined class="arrow-icon" />
    </button>
    <button class="control-btn next" @click="nextSlide">
      <arrow-right-outlined class="arrow-icon" />
    </button>

    <!-- 进度条 -->
    <div class="progress-bar">
      <div
        class="progress"
        :style="{ width: progress + '%' }"
        :class="{ paused: isPaused }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons-vue";
import api from "@/api/api";
import { ApiResponse, baseURL } from "@/utils/axios";

const slides = ref([
  {
    image: "https://picsum.photos/1600/900?random=1",
    title: "创意设计作品",
    description: "探索无限设计可能",
  },
  {
    image: "https://picsum.photos/1600/900?random=2",
    title: "数字艺术展览",
    description: "前沿数字艺术体验",
  },
  {
    image: "https://picsum.photos/1600/900?random=3",
    title: "设计师工作室",
    description: "专业创作空间",
  },
]);

const getCrawlerData = async () => {
  slides.value = [];
  api.crawler({ number: 5 }).then((res: ApiResponse) => {
    if (res.code === 0) {
      const images = res.data?.images;
      for (const item of images) {
        slides.value.push({
          image: baseURL + item.image_path,
          title: item.title,
          description: item.description,
        });
      }
    }
    slides.value.push();
  });
};

getCrawlerData();

const activeIndex = ref(0);
const isPaused = ref(false);
const progress = ref(0);
let intervalId: number;
let timeoutId: number;

const trackStyle = computed(() => ({
  transform: `translateX(-${activeIndex.value * 100}%)`,
  transition: "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
}));

const nextSlide = () => {
  activeIndex.value = (activeIndex.value + 1) % slides.value.length;
  resetProgress();
};

const prevSlide = () => {
  activeIndex.value =
    (activeIndex.value - 1 + slides.value.length) % slides.value.length;
  resetProgress();
};

const startAutoPlay = () => {
  isPaused.value = false;
  progress.value = 0;
  intervalId = window.setInterval(() => {
    progress.value += 100 / 100; // 10秒完成
    if (progress.value >= 100) {
      nextSlide();
    }
  }, 100);
};

const pauseAutoPlay = () => {
  isPaused.value = true;
  clearInterval(intervalId);
};

const resetProgress = () => {
  clearInterval(intervalId);
  progress.value = 0;
  if (!isPaused.value) {
    timeoutId = window.setTimeout(startAutoPlay, 10);
  }
};

onMounted(() => {
  startAutoPlay();
});

onUnmounted(() => {
  clearInterval(intervalId);
  clearTimeout(timeoutId);
});
</script>

<style scoped lang="scss">
.carousel-container {
  position: relative;
  width: 100%;
  height: 100vh; /* 改为视口单位 */
  overflow: hidden;
  margin-left: 0; /* 修正水平居中问题 */
  margin-right: 0;
  margin-top: 0;
  margin-bottom: 0;
  border-radius: 0; /* 移除圆角 */
  //box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);

  .carousel-track {
    display: flex;
    height: 100%;
    will-change: transform;
    margin: auto;
  }

  .carousel-item {
    flex: 0 0 100%;
    position: relative;
    transition: transform 0.8s, opacity 0.8s;

    &.active {
      z-index: 1;
    }

    .slide-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(0.8);
    }

    .slide-content {
      position: absolute;
      bottom: 20%;
      left: 10%;
      color: white;
      text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
      transform: translateY(30px);
      opacity: 0;
      transition: all 0.8s 0.3s;

      .slide-title {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .slide-description {
        font-size: 1.5rem;
      }
    }

    &.active .slide-content {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .control-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 50px;
    height: 50px;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(5px);
    cursor: pointer;
    transition: all 0.3s;
    z-index: 2;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-50%) scale(1.1);
    }

    .arrow-icon {
      font-size: 24px;
      color: white;
    }

    &.prev {
      left: 30px;
    }

    &.next {
      right: 30px;
    }
  }

  .progress-bar {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 3px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    overflow: hidden;
    z-index: 2;

    .progress {
      height: 100%;
      background: #fff;
      transition: width 0.1s linear;

      &.paused {
        animation: pulse 1s infinite;
      }
    }
  }
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
