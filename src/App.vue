<template>
  <div id="app">
    <template v-if="route.path.startsWith('/user/login')">
      <LoginLayout />
    </template>
    <template v-else-if="route.path.startsWith('/user/register')">
      <LoginLayout />
    </template>
    <template v-else-if="route.path.startsWith('/static/')">
      <router-view />
    </template>
    <template v-else>
      <BasicLayout />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { onMounted } from "vue";
import BasicLayout from "@/layouts/BasicLayout.vue";
import LoginLayout from "@/layouts/LoginLayout.vue";
import { useStore } from "vuex";

const route = useRoute();
const store = useStore();

onMounted(() => {
  store.dispatch("user/initialize");
});
</script>

<style>
#app {
}
</style>
