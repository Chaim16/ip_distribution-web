<template>
  <div id="container">
    <a-card title="用户列表" bordered class="order-card">
      <a-table
        :dataSource="userList"
        :columns="columns"
        :pagination="false"
        class="order-table"
        rowKey="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'operate'">
            <a-popconfirm
              title="确定要删除吗？"
              ok-text="确认"
              cancel-text="取消"
              @confirm="deleteUser(record)"
              :disabled="record.role === 'administrator'"
            >
              <a-button danger :disabled="record.role === 'administrator'"
                >删除
              </a-button>
            </a-popconfirm>
          </template>
          <template v-else-if="column.key === 'role'">
            <a-tag :color="record.role === 'administrator' ? 'green' : 'blue'">
              {{ ROLE_MAP[record.role] }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'gender'">
            {{ record.gender === 1 ? "男" : "女" }}
          </template>
          <template v-else>
            <a-td>{{ record[column.dataIndex] }}</a-td>
          </template>
        </template>
      </a-table>
      <a-pagination
        :current="pagination.page"
        :pageSize="pagination.size"
        :total="pagination.count"
        @change="handlePageChange"
        style="margin-top: 20px; text-align: right"
      />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { message } from "ant-design-vue";
import api from "@/api/api";
import { ApiResponse } from "@/utils/axios";
import { ROLE_MAP } from "../../utils/constant";

const userList = ref([]);

const pagination = ref({
  size: 10,
  page: 1,
  count: null,
});

const getUserList = () => {
  const params = {
    page: pagination.value.page,
    size: pagination.value.size,
  };
  api.userList(params).then((res: ApiResponse) => {
    if (res.code === 0) {
      userList.value = res.data?.list.map((item: object) => {
        return item;
      });
      pagination.value.count = res.data?.count || 0;
    } else {
      message.error(res.message);
    }
  });
};

getUserList();

const handlePageChange = (newPage: number) => {
  pagination.value.page = newPage;
  getUserList();
};

const columns = [
  { title: "ID", dataIndex: "id", key: "id" },
  { title: "用户名", dataIndex: "username", key: "username" },
  { title: "昵称", dataIndex: "nickname", key: "nickname" },
  {
    title: "角色",
    dataIndex: "role",
    key: "role",
  },
  { title: "性别", dataIndex: "gender", key: "gender" },
  { title: "手机号", dataIndex: "phone", key: "phone" },
  { title: "操作", key: "operate" },
];

const deleteUser = (record) => {
  const params = { username: record.username };
  api.deleteUser(params).then((res: ApiResponse) => {
    if (res.code === 0) {
      message.success("删除成功");
      getUserList();
    } else {
      message.error(res.message);
    }
  });
};
</script>

<style scoped>
#container {
  align-items: center;
  margin-left: 15%;
}

.order-card {
  width: 80%;
  align-items: center;
}

.order-table {
}
</style>
