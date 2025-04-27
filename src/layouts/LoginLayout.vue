<template>
  <div class="login-layout">
    <header>
      <h1>欢迎来到企业网络IP地址管理系统</h1>
    </header>
    <main>
      <router-view />
    </main>
    <footer>
      <p>© 2025 公司名称. 保留所有权利.</p>
    </footer>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.login-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  background-color: #409eff;
  color: white;
  padding: 20px;
  text-align: center;
}

main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 10px;
}
</style>
