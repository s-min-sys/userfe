<template>
  <div class="center-container">
    <el-card class="center-content">
      <template #header>
        <div class="card-header">
          <span>{{ $t('label.login')}}</span>
        </div>
      </template>
      <el-form
          ref="formRef"
          label-width="100px"
          :model="formData"
          :rules="rules"
      >
        <el-form-item :label="$t('label.userName')" prop="name">
          <el-input v-model="formData.name" v-focus @keydown.enter="$enter2TabKey" />
        </el-form-item>
        <el-form-item :label="$t('label.password')" prop="password">
          <el-input v-model="formData.password" @keydown.enter="doLogin(formRef)" />
        </el-form-item>
        <el-form-item>
          <div class="layout-children-align-right">
            <el-button type="primary" @click="doLogin(formRef)">{{ $t('label.submit')}}</el-button>
            <el-button type="success" link style="font-style:italic;" @click="switch2RegisterPage">{{ $t('label.noAccount')}}</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import {ElMessage, ElNotification, FormInstance, FormRules} from "element-plus";
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";

const formRef = ref<FormInstance>()

const formData = reactive({
  name: '',
  password: '',
})

const { t } = useI18n()

const rules = reactive<FormRules>({
  name: [
    {required: true, message: t('tip.noUserName'), trigger: 'blur'},
  ],
  password: [
    {required: true, message: t('tip.noPassword'), trigger: 'blur'},
  ],
})

const doLogin = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      ElMessage({
        message: 'Warning, 我还没实现呢.',
        type: 'warning',
      })
    } else {
      ElNotification({
        title: 'Prompt',
        message: JSON.stringify(valid),
        type: 'error',
      })
      return false
    }
  })
}

const router = useRouter()

const switch2RegisterPage = () => {
  router.push('/register')
}

</script>
