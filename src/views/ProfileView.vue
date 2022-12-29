<template>
  <el-descriptions
      class="margin-top"
      :column="1"
      border
  >
    <template #extra>
      <el-button type="primary">Logout</el-button>
    </template>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <ChromeFilled />
          </el-icon>
          UserID
        </div>
      </template>
      {{ store.getters.userInfo.id }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <UserFilled />
          </el-icon>
          Username
        </div>
      </template>
      {{ store.getters.userInfo.userName }}
    </el-descriptions-item>
  </el-descriptions>
</template>

<script lang="ts" setup>

import {useStore} from "vuex";
import {computed} from "vue";

const store = useStore();

const iconStyle = computed(() => {
  return {
    marginRight: '6px',
  }
})

</script>

<style scoped>
.el-descriptions {
  margin-top: 20px;
}
.cell-item {
  display: flex;
  align-items: center;
}
.margin-top {
  margin-top: 20px;
}
</style>