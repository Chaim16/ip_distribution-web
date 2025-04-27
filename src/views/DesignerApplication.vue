<template>
  <div id="container">
    <a-card title="设计师申请记录" bordered class="application-card">
      <a-table
        :dataSource="applications"
        :columns="columns"
        :pagination="pagination"
        class="application-table"
        rowKey="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'operate'">
            <a-button
              type="primary"
              @click="openApprovalModal(record)"
              style="margin-right: 8px"
            >
              审批
            </a-button>
            <!--            <a-button danger @click="deleteApplication(record.id)">-->
            <!--              删除-->
            <!--            </a-button>-->
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag
              :color="
                record.status === 'pass'
                  ? 'green'
                  : record.status === 'refuse'
                  ? 'red'
                  : 'blue'
              "
            >
              {{ DESIGNER_APPLICATION_STATUS_MAP[record.status] }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'approvalOpinions'">
            {{ record.approvalOpinions ? record.approvalOpinions : "" }}
          </template>
          <template v-else>
            <a-td>{{ record[column.dataIndex] }}</a-td>
          </template>
        </template>
      </a-table>

      <a-modal
        v-model:visible="isModalVisible"
        title="审批申请"
        @ok="handleApproval"
        @cancel="closeModal"
      >
        <a-form>
          <a-form-item label="审批结果">
            <a-radio-group v-model:value="approvalResult">
              <a-radio value="pass">同意</a-radio>
              <a-radio value="refuse">拒绝</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="审批意见">
            <a-input type="textarea" v-model:value="approvalOpinions" />
          </a-form-item>
        </a-form>
      </a-modal>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { message } from "ant-design-vue";
import api from "@/api/api";
import { ApiResponse } from "@/utils/axios";
import { DESIGNER_APPLICATION_STATUS_MAP } from "@/utils/constant";

const applications = ref([]);

const getApplicationRecord = () => {
  api.applyDesignerList({}).then((res: ApiResponse) => {
    if (res.code === 0) {
      applications.value = res.data?.list.map((item: object) => {
        item.approvalOpinions = item.approval_opinions;
        item.createTime = item.create_time;
        item.approvalTime = item.approval_time;
        return item;
      });
      console.log(applications.value);
    } else {
      message.error(res.message);
    }
  });
};

getApplicationRecord();

const pagination = ref({
  pageSize: 5,
  current: 1,
  total: applications.value.length,
});

watch(applications, () => {
  pagination.value.total = applications.value.length;
});

const isModalVisible = ref(false);
const approvalResult = ref("pass");
const approvalOpinions = ref("同意");
const selectedApplication = ref<object | null>(null);

const columns = [
  { title: "序号", dataIndex: "id", key: "id" },
  { title: "申请人", dataIndex: "username", key: "username" },
  { title: "申请时间", dataIndex: "createTime", key: "createTime" },
  { title: "申请原因", dataIndex: "reason", key: "reason" },
  { title: "状态", dataIndex: "status", key: "status" },
  {
    title: "审批意见",
    dataIndex: "approvalOpinions",
    key: "approvalOpinions",
  },
  { title: "操作", key: "operate" },
];

const openApprovalModal = (application: object) => {
  isModalVisible.value = true;
  selectedApplication.value = application;
};

const closeModal = () => {
  isModalVisible.value = false;
  approvalResult.value = "pass";
  approvalOpinions.value = "同意";
};

const handleApproval = () => {
  if (selectedApplication.value) {
    const params = {
      status: approvalResult.value,
      approval_opinions: approvalOpinions.value,
      record_id: selectedApplication.value.id,
    };
    console.log(params);
    api.approveDesignerApplication(params).then((res: ApiResponse) => {
      if (res.code === 0) {
        message.success("提交成功");
        closeModal();
        getApplicationRecord();
      } else {
        message.error(res.message);
      }
    });
  } else {
    message.error("请输入审批结果");
  }
};

// const deleteApplication = (id: number) => {
//   applications.value = applications.value.filter((app) => app.id !== id);
//   message.success("删除成功");
// };
</script>

<style scoped>
#container {
  align-items: center;
  margin-left: 15%;
}

.application-card {
  width: 80%;
  align-items: center;
}

.application-table {
}
</style>
