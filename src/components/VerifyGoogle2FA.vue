<template>
  <el-form
      ref="formRef"
      label-width="100px"
      :model="formData"
      :rules="rules"
  >
    <el-form-item :label="$t('label.qrcode')" prop="code">
      <el-input v-model="formData.code" v-focus @keydown.enter.prevent="doSubmit(formRef)" />
    </el-form-item>
    <el-form-item>
      <div class="layout-children-align-right">
        <el-button type="primary" @click="doSubmit(formRef)">{{ $t('label.submit')}}</el-button>
        <el-button v-for="link in props.links" :key="link.key" type="success" link style="font-style:italic;" @click="doLink(link.key)">{{ link.text }}</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>

import {defineProps, inject, reactive, ref} from "vue";
import {ElNotification, FormInstance, FormRules} from "element-plus";
import {useI18n} from "vue-i18n";
const { t } = useI18n()

const formRef = ref<FormInstance>()


const formData = reactive({
  code: '',
})

const rules = reactive<FormRules>({
  code: [
    {required: true, message: t('tip.noQrCode'), trigger: 'blur'},
  ],
})

interface Link {
  key: string,
  text: string,
}

interface Props {
  links: Array<Link>,
}

const props = defineProps<Props>();

const fnLinkClicked : any = inject('LinkClicked');
const doLink = (key: any) => {
  fnLinkClicked(key)
}

const fnVerifyGoogle2FA : any = inject('VerifyGoogle2FA');

const doSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      fnVerifyGoogle2FA(formData.code)
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