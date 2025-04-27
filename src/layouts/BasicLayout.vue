<template>
  <div id="basicLayout">
    <a-layout>
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        <p>© 2025 公司名称. 保留所有权利.</p>
      </a-layout-footer>
    </a-layout>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import GlobalHeader from "@/components/GlobalHeader.vue";

export default defineComponent({
  components: { GlobalHeader },
});
</script>
<style>
#basicLayout {
  height: 100%;
}

#basicLayout .header {
}

#basicLayout .content {
  padding: 20px;
  background: linear-gradient(to right, #bbb, #fff);
  padding-bottom: 80px; /* 大于等于页脚高度 */
}

#basicLayout .footer {
  text-align: center;
}
</style>
