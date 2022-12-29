<template>
  <div class="center-container">
    <el-card class="center-content">
      <template #header>
        <div class="card-header">
          <span>{{ $t('label.register')}}</span>
        </div>
      </template>
      <div style="margin: 20px" />
      <VerifyUserPass v-if="currentAuthenticator === 'verify_user_pass'"  :links="links" />
      <VerifyGoogle2FA v-if="currentAuthenticator === 'verify_google2fa'"  :links="links" />
      <SetupUserPass v-if="currentAuthenticator === 'setup_user_pass'" :links="links" />
      <SetupGoogle2FA v-if="currentAuthenticator === 'setup_google2fa'" :links="links" :qr-code="qrURL" />
    </el-card>
  </div>
</template>


<script lang="ts" setup>
import {getCurrentInstance, provide, ref} from "vue";
import {useStore} from "vuex";
import {ElMessage} from "element-plus";
import VerifyUserPass from "@/components/VerifyUserPass.vue";
import SetupUserPass from "@/components/SetupUserPass.vue";
import SetupGoogle2FA from "@/components/SetupGoogle2FA.vue";
import VerifyGoogle2FA from "@/components/VerifyGoogle2FA.vue";
import {useRoute, useRouter} from "vue-router";

const store = useStore();

const verifyUserPass = (item: any) => {
  fnUserPassVerify(item.userName, item.password)
}

provide('VerifyUserPass', verifyUserPass)

const setupUserPass = (item: any) => {
  fnUserPassRegister(item.userName, item.password)
}

provide('SetupUserPass', setupUserPass)


const verifyGoogle2FA = (item: string) => {
  fnGoogle2FAVerify(item)

}

provide('VerifyGoogle2FA', verifyGoogle2FA)

const setupGoogle2FA = (item: string) => {
  fnGoogle2FADoSetup(item)
}

provide('SetupGoogle2FA', setupGoogle2FA)

const links = ref([] as any[])
let orAuth : Array<string> = []

const linkClicked = (item: string) => {
  if (item === '_has_account') {
    fnLoginStart()

    return
  }

  if (item === '_no_account') {
    fnRegisterStart()

    return
  }

  fnStep(item, orAuth)
}

provide('LinkClicked', linkClicked)

//
//
//

const bizID = ref('');
const currentAuthenticator = ref('');
const qrURL = ref('');

const authenticatorMap = new Map();
authenticatorMap.set('verify_user_pass', '验证用户名密码')
authenticatorMap.set('setup_user_pass', '注册用户名密码')
authenticatorMap.set('setup_google2fa', '注册谷歌验证码')
authenticatorMap.set('_has_account', '我已经有账户')
authenticatorMap.set('_no_account', '我还没有账户')

const fnStep = (curAuthenticator: string, orAuthenticators: Array<string>) => {
  currentAuthenticator.value = curAuthenticator;

  links.value = [];
  orAuthenticators.forEach((element) => {
    if (element === curAuthenticator) {
      return
    }
    links.value.push({'key': element, 'text': authenticatorMap.get(element)})
  })

  if (currentAuthenticator.value == 'setup_google2fa') {
    fnGoogle2FAGetSetupInfo()
  }

  console.log('currentAuthenticator:', currentAuthenticator.value)
}

const fnAuthenticatorEventToKey = (authenticator:number, event: number) => {
  let key = '';

  if (event === 1) {
    key = 'setup'
  } else if (event == 2) {
    key = 'verify'
  } else {
    ElMessage({
      message:'未知的事件:' + event,
      type: 'error',
    })

    return
  }

  key += '_'

  switch (authenticator) {
    case 3:
      key += "user_pass"
      break
    case 7:
      key += 'google2fa'
      break
    default:
      ElMessage({
        message:'未知的Authenticator:' + event,
        type: 'error',
      })

      return
  }

  return key
}

const instance = getCurrentInstance();
const ctx = instance?.appContext.config.globalProperties;

const fnUpdateNeededOrEventsList = (neededOrEventsList: any[], accountKey: string) => {
  let firstAuth = '';

  neededOrEventsList.forEach((item: any) => {
    orAuth = []

    const key = fnAuthenticatorEventToKey(item.getAuthenticator(), item.getEvent());
    if (key === undefined) {
      return
    }

    if (firstAuth === '') {
      firstAuth = key;
    }
    orAuth.push(key)
  })

  orAuth.push(accountKey)


  fnStep(firstAuth, orAuth)
}

const fnRegisterStart = () => {
  ctx?.$grpc.register().then((resp: any) => {
    if (resp.getStatus().getCode() !== 2) {
      ElMessage({
        message: resp.getStatus().getCode() + ":" + resp.getStatus().getMessage(),
        type: 'error',
      })

      return
    }

    bizID.value = resp.getBizId();

    fnUpdateNeededOrEventsList(resp.getNeededOrEventsList(), '_has_account')

  })
}

const fnRegisterCheck = () => {
  ctx?.$grpc.registerCheck(bizID.value).then((resp: any) => {
    console.log('fnRegisterCheck:', resp.toObject())

    if (resp.getStatus().getCode() === 2) {
      fnUpdateNeededOrEventsList(resp.getNeededOrEventsList(), '_has_account')
      return
    }

    if (resp.getStatus().getCode() === 1) {
      fnRegisterEnd()
    }
  })
}

const fnRegisterEnd = () => {
  ctx?.$grpc.registerEnd(bizID.value).then((resp: any) => {
    if (resp.getStatus().getCode() !== 1) {
      ElMessage({
        message: resp.getStatus().getCode() + ":" + resp.getStatus().getMessage(),
        type: 'error',
      })

      return
    }

    fnCheckToken()
  })
}

//
//
//

const fnUserPassRegister = (userName: any, password: any) => {
  ctx?.$grpc.userPassRegister(bizID.value, userName, password).then((resp: any) => {
    console.log('fnUserPassRegister:', resp.toObject())
    if (resp.getStatus().getCode() !== 1) {
      ElMessage({
        message: resp.getStatus().getCode() + ":" + resp.getStatus().getMessage(),
        type: 'error',
      })

      return
    }

    fnRegisterCheck()
  })
}

const fnUserPassVerify = (userName: any, password: any) => {
  ctx?.$grpc.userPassVerify(bizID.value, userName, password).then((resp: any) => {
    console.log('fnUserPassVerify:', resp.toObject())
    if (resp.getStatus().getCode() !== 1) {
      ElMessage({
        message: resp.getStatus().getCode() + ":" + resp.getStatus().getMessage(),
        type: 'error',
      })

      return
    }

    fnLoginCheck()
  })
}

const fnGoogle2FAGetSetupInfo = () => {
  ctx?.$grpc.google2faGetSetupInfo(bizID.value).then((resp: any) => {
    console.log('fnGoogle2FAGetSetupInfo:', resp.toObject())
    if (resp.getStatus().getCode() !== 1) {
      ElMessage({
        message: resp.getStatus().getCode() + ":" + resp.getStatus().getMessage(),
        type: 'error',
      })

      return
    }

    qrURL.value = resp.getQrCode()
  })
}

const fnGoogle2FADoSetup = (qrCode: string) => {
  ctx?.$grpc.google2faDoSetup(bizID.value, qrCode).then((resp: any) => {
    console.log('fnGoogle2FADoSetup:', resp.toObject())
    if (resp.getStatus().getCode() !== 1) {
      ElMessage({
        message: resp.getStatus().getCode() + ":" + resp.getStatus().getMessage(),
        type: 'error',
      })

      return
    }

    fnRegisterCheck()
  })
}

const fnGoogle2FAVerify = (code: string) => {
  ctx?.$grpc.google2faVerify(bizID.value, code).then((resp: any) => {
    console.log('fnGoogle2FAVerify:', resp.toObject())
    if (resp.getStatus().getCode() !== 1) {
      ElMessage({
        message: resp.getStatus().getCode() + ":" + resp.getStatus().getMessage(),
        type: 'error',
      })

      return
    }

    fnLoginCheck()
  })
}

const route = useRoute();
const router = useRouter();

const fnCheckToken = () => {
  // eslint-disable-next-line no-prototype-builtins
  const ssoFlag = route.query.hasOwnProperty('sso') && route.query['sso'] === "1";
  // eslint-disable-next-line no-prototype-builtins
  const redirectedFlag = route.query.hasOwnProperty('redirected') && route.query['redirected'] !== ''

  let ssoJumpURL = '';
  if (ssoFlag && redirectedFlag) {
    ssoJumpURL = route.query['redirected'] as string;
  }

  store.dispatch('GetAndCheckToken', ssoJumpURL).then((resp: any) => {
    store.commit('userInfo', resp.getTokenInfo().toObject())
    if (redirectedFlag) {
      if (ssoFlag) {
        window.location.replace(
            ctx?.$grpc.updateQueryStringParameter(route.query['redirected'], "sso_token", resp.getSsoToken())
        );
      } else {
        router.push(route.query.redirected as string)
      }
    }
  }).catch(() => {
    ElMessage({
      message: '失败了:(',
      type: 'error',
    })
  })
}

const fnLoginStart = () => {
  ctx?.$grpc.login().then((resp: any) => {
    console.log("login:", resp.toObject())
    if (resp.getStatus().getCode() !== 2) {
      ElMessage({
        message: resp.getStatus().getCode() + ":" + resp.getStatus().getMessage(),
        type: 'error',
      })

      return
    }

    bizID.value = resp.getBizId();

    fnUpdateNeededOrEventsList(resp.getNeededOrEventsList(), '_no_account')
  })
}


const fnLoginCheck = () => {
  ctx?.$grpc.loginCheck(bizID.value).then((resp: any) => {
    if (resp.getStatus().getCode() === 2) {
      fnUpdateNeededOrEventsList(resp.getNeededOrEventsList(), '_no_account')
      return
    }

    if (resp.getStatus().getCode() === 1) {
      fnLoginEnd()
    }
  })
}

const fnLoginEnd = () => {
  ctx?.$grpc.loginEnd(bizID.value).then((resp: any) => {
    if (resp.getStatus().getCode() !== 1) {
      ElMessage({
        message: resp.getStatus().getCode() + ":" + resp.getStatus().getMessage(),
        type: 'error',
      })

      return
    }

    fnCheckToken()
  })
}

let op = 'register';

if (route.query.op) {
  if (route.query.op === 'login') {
    op = 'login';
  }
}

if (op == 'login') {
  fnLoginStart()
} else {
  fnRegisterStart()
}

</script>