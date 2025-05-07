<template>
  <div class="address-info">
    <h2>地址信息</h2>
    <div v-if="addressInfo.has_ip_address">
      <div class="info-card">
        <ul>
          <li>
            <span class="label">📍 IP 地址：</span
            >{{ addressInfo.workstation_info.ip_addr }}
          </li>
          <li>
            <span class="label">🚪 网关：</span
            >{{ addressInfo.workstation_info.gateway }}
          </li>
          <li>
            <span class="label">🧭 DNS：</span
            >{{ addressInfo.workstation_info.dns }}
          </li>
          <li>
            <span class="label">📐 子网掩码：</span
            >{{ addressInfo.workstation_info.mask }}
          </li>
          <li>
            <span class="label">🏢 工位位置：</span
            >{{ addressInfo.workstation_info.location }}
          </li>
        </ul>
      </div>
    </div>

    <div v-else class="info-warning">当前未分配 IP 地址。</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ApiResponse } from "@/utils/axios";
import api from "@/api/api";

const addressInfo = ref({
  has_ip_address: false,
  workstation_info: {
    code: "",
    dns: "",
    gateway: "",
    ip_addr: "",
    mask: "",
    location: "",
  },
});
const error = ref("");

const fetchAddressInfo = () => {
  try {
    api.getIPAddress({}).then((res: ApiResponse) => {
      if (res.code !== 0) {
        throw new Error(res.message);
      }
      addressInfo.value = res.data;
    });
  } catch (err: any) {
    error.value = err.message || "请求出错";
  }
};

fetchAddressInfo();
</script>

<style scoped>
.address-info {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  font-family: "Helvetica Neue", Arial, sans-serif;
  color: #333;
}

h2 {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #2c3e50;
  text-align: center;
}

.info-warning {
  text-align: center;
  padding: 16px;
  font-size: 15px;
}

.info-warning {
  color: #8a6d3b;
  background: #fff3cd;
  border-radius: 8px;
}

.info-card {
  background: #f9fafc;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #e0e6ed;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 10px 0;
  border-bottom: 1px solid #e8ecf1;
  font-size: 15px;
  display: flex;
  align-items: center;
}

li:last-child {
  border-bottom: none;
}

.label {
  width: 120px;
  font-weight: 500;
  color: #555;
  flex-shrink: 0;
}
</style>
