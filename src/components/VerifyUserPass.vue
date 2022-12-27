<template>
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
        <el-button v-for="link in links" :key="link.key" type="success" link style="font-style:italic;" @click="doLink(link.key)">{{ link.text }}</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>

import {defineProps, inject, reactive, ref} from "vue";
import {ElNotification, FormInstance, FormRules} from "element-plus";
import {useI18n} from "vue-i18n";

const fnVerifyUserPass : any = inject('VerifyUserPass');

defineProps<{
  links: Array<unknown>,
}>()

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
      fnVerifyUserPass({
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