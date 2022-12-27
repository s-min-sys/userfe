<template>
  <el-form
      ref="formRef"
      label-width="auto"
      :model="formData"
      :rules="rules"
  >
    <el-form-item>
      <QRCodeVue3 :value="props.qrCode" />
    </el-form-item>
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
import QRCodeVue3 from "qrcode-vue3";
import {withDefaults, defineProps, reactive, ref, inject} from "vue";
import {ElNotification, FormInstance, FormRules} from "element-plus";
import {useI18n} from "vue-i18n";
const { t } = useI18n()

const formRef = ref<FormInstance>()

const fnSetupGoogle2FA : any = inject('SetupGoogle2FA');

interface Link {
  key: string,
  text: string,
}

interface Props {
  qrCode?: string;
  links: Array<Link>,
}

const props = withDefaults(defineProps<Props>(), {
  qrCode: '',
});

const formData = reactive({
  code: '',
})

const rules = reactive<FormRules>({
  code: [
    {required: true, message: t('tip.noQrCode'), trigger: 'blur'},
  ],
})

const doSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      fnSetupGoogle2FA(formData.code)
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