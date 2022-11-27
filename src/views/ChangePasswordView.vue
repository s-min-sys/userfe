<template>
  <div class="center-container">
    <el-card class="center-content">
      <template #header>
        <div class="card-header">
          <span>{{ $t('label.changePassword')}}</span>
        </div>
      </template>
      <div style="margin: 20px" />
      <el-form
          ref="formRef"
          label-width="auto"
          :model="formData"
          :rules="rules"
      >
        <el-form-item :label="$t('label.oldPassword')" prop="oldPassword">
          <el-input v-model="formData.oldPassword" v-focus @keydown.enter="$enter2TabKey" />
        </el-form-item>
        <el-form-item :label="$t('label.password')" prop="password">
          <el-input v-model="formData.password" @keydown.enter="$enter2TabKey" />
        </el-form-item>
        <el-form-item :label="$t('label.reenterPassword')" prop="reenterPassword">
          <el-input v-model="formData.reenterPassword" @keydown.enter="doLogin(formRef)" />
        </el-form-item>
        <el-form-item>
          <div class="layout-children-align-right">
            <el-button type="primary" @click="doLogin(formRef)">{{ $t('label.submit')}}</el-button>
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

const formRef = ref<FormInstance>()

const formData = reactive({
  oldPassword: '',
  password: '',
  reenterPassword: '',
})

const { t } = useI18n()

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error(t('tip.noPassword')))
  } else {
    if (formData.reenterPassword !== '') {
      if (!formRef.value) return
      formRef.value.validateField('checkPassword', () => null)
    }
    callback()
  }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error(t('tip.noReenterPassword')))
  } else if (value !== formData.password) {
    callback(new Error(t('tip.passwordNotSame')))
  } else {
    callback()
  }
}

const rules = reactive<FormRules>({
  oldPassword: [
    {required: true, message:  t('tip.noOldPassword'), trigger: 'blur'},
  ],
  password: [{ required: true, validator: validatePass, trigger: 'blur' }],
  reenterPassword: [{ required: true, validator: validatePass2, trigger: 'blur' }],
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

</script>
