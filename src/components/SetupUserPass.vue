<template>
  <el-form
      ref="formRef"
      label-width="auto"
      :model="formData"
      :rules="rules"
  >
    <el-form-item :label="$t('label.userName')" prop="name">
      <el-input v-model="formData.name" v-focus @keydown.enter.prevent="$enter2TabKey" />
    </el-form-item>
    <el-form-item :label="$t('label.password')" prop="password">
      <el-input v-model="formData.password" @keydown.enter.prevent="$enter2TabKey" />
    </el-form-item>
    <el-form-item :label="$t('label.reenterPassword')" prop="reenterPassword">
      <el-input v-model="formData.reenterPassword" @keydown.enter.prevent="doSubmit(formRef)" />
    </el-form-item>
    <el-form-item>
      <div class="layout-children-align-right">
        <el-button type="primary" @click="doSubmit(formRef)">{{ $t('label.submit')}}</el-button>
        <el-button v-for="link in links" :key="link.key" type="success" link style="font-style:italic;" @click="doLink(link.key)">{{ link.text }}</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>

import {inject, reactive, ref, defineProps} from "vue";
import {ElNotification, FormInstance, FormRules} from "element-plus";
import {useI18n} from "vue-i18n";

const fnSetupUserPass : any = inject('SetupUserPass');

defineProps<{
  links: Array<unknown>,
}>()


const formRef = ref<FormInstance>()

const formData = reactive({
  name: '',
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
      formRef.value.validateField('reenterPassword', () => null)
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
  name: [
    {required: true, message:  t('tip.noUserName'), trigger: 'blur'},
  ],
  password: [{ required: true, validator: validatePass, trigger: 'blur' }],
  reenterPassword: [{ required: true, validator: validatePass2, trigger: 'blur' }],
})

const doSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      fnSetupUserPass({
        'userName': formData.name,
        'password': formData.password,
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

const fnLinkClicked : any = inject('LinkClicked');
const doLink = (key: any) => {
  fnLinkClicked(key)
}

</script>