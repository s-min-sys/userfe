<template>
  <div class="center-container">
    <el-card class="center-content">
      <template #header>
        <div class="card-header">
          <span>{{ $t('label.register')}}</span>
        </div>
      </template>
      <div style="margin: 20px" />
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
          <el-input v-model="formData.password" @keydown.enter="$enter2TabKey" />
        </el-form-item>
        <el-form-item :label="$t('label.reenterPassword')" prop="reenterPassword">
          <el-input v-model="formData.reenterPassword" @keydown.enter="doLogin(formRef)" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doLogin(formRef)"
          >{{ $t('label.submit')}}</el-button
          >
          <el-button @click="resetForm(formRef)">{{ $t('label.reset')}}</el-button>
          <el-button type="success" link style="font-style:italic;" @click="switch2LoginPage">{{ $t('label.hasAccount')}}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import {ElMessage, ElNotification, FormInstance, FormRules} from "element-plus";
import {useRouter} from "vue-router";

const formRef = ref<FormInstance>()

const formData = reactive({
  name: '',
  password: '',
  reenterPassword: '',
})

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password'))
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
    callback(new Error('Please input the password again'))
  } else if (value !== formData.password) {
    callback(new Error("Two inputs don't match!"))
  } else {
    callback()
  }
}

const rules = reactive<FormRules>({
  name: [
    {required: true, message: 'Please input the user name', trigger: 'blur'},
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

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const router = useRouter()

const switch2LoginPage = () => {
  router.push('/login')
}


</script>
