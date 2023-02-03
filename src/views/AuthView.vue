<template>
  <div class="center-container">
    <el-card class="box-card center-content">
      <template #header>
        <div class="card-header">
          <span>请求</span>
          <el-button class="button" type="primary" @click="allowAuth">允许</el-button>
        </div>
      </template>
      <p>
        是否允许用户{{ user }}登录？
      </p>
    </el-card>
  </div>
</template>

<script lang="ts" setup>

import {ElMessage} from "element-plus";
import {useStore} from "vuex";
import {ref} from "vue";

const store = useStore();

const user = ref('');

store.dispatch('GetAndCheckToken').then((resp: any) => {
  const ti = resp.getTokenInfo().toObject();
  user.value = ti.userName+'['+ti.id+']'
}).catch(() => {
  ElMessage({
    message: '失败了:(',
    type: 'error',
  })
})

const allowAuth = () => {
  window.location.replace(
      "/oauth/auth"
  );
}

</script>

<style>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 480px;
}
</style>
