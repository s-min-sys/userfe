<template>
  <el-menu
      :default-active="curRouter()"
      class="menu"
      mode="horizontal"
      :ellipsis="false"
      @select="handleSelect"
  >
    <el-menu-item index="/">LOGO</el-menu-item>
    <div class="flex-grow" />
    <el-sub-menu index="2">
      <template #title>账户</template>
      <el-menu-item v-if="store.getters.token === ''" index="/biz?op=login">登录</el-menu-item>
      <div v-else>
        <el-menu-item  index="/"> 用户 {{ store.getters.userInfo &&  store.getters.userInfo.userName }}</el-menu-item>
        <el-menu-item  index="/logout">登出</el-menu-item>
      </div>
      <el-menu-item index="/biz?op=register">注册</el-menu-item>
    </el-sub-menu>
    <div style="display: flex; align-items: center">
      <el-button link @click="switchLang">Lang</el-button>
    </div>
  </el-menu>
  <router-view :key="route.fullPath"  />
</template>

<script lang="ts" setup>
import {useRoute, useRouter} from "vue-router";
import {getCurrentInstance} from "vue";
import {useStore} from "vuex";

const instance = getCurrentInstance();
const ctx = instance?.appContext.config.globalProperties;

const store = useStore();

const route = useRoute();

const curRouter = () => {
  return route.path
}

const router = useRouter();

const handleSelect = (key: string) => {
  if (key == '/logout') {
    ctx?.$grpc.logout().then(()=>{
      location.reload()
    }).catch(()=>{
      location.reload()
    })


    return
  }

  router.push(key)
}

const switchLang = () => {
  if (ctx !== undefined) {
    if (ctx.$i18n.locale === 'zh') {
      ctx.$i18n.locale = 'en'
    } else {
      ctx.$i18n.locale = 'zh'
    }
    localStorage.setItem('locale', ctx.$i18n.locale)
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.center-container {
  position: fixed;
  width: 100%;
  height: 100%;
}

.center-content {
  position: absolute;
  top: 20%;
  left: 0;
  right: 0;
  width: 30%;
  margin: 0 auto;
  padding: 10px 20px 10px 20px;
}

.center-content:hover {
  box-shadow: 0 0 100px 10px black;
}

@media (max-width: 1200px) {
  .center-content {
    width: 60%;
  }
}

@media (max-width: 700px) {
  .center-content {
    width: 80%;
  }
}

.flex-grow {
  flex-grow: 1;
}

.menu {
  padding-left: 60px;
  padding-right: 60px;
}

.layout-children-align-right {
  display: flex;
  justify-content: flex-end;
  width: 100%
}

</style>
