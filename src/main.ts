import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/notification/style/css'
import i18n from '@/i18n/index.js'
import grpc_api from "@/api/grpc_api.js";

const app = createApp(App);
app.use(store).use(router)
app.use(i18n)

app.directive('focus', {
    mounted(el) {
        el.querySelector('input').focus()
    },
})

app.mount('#app')

const enter2TabKey = () => {
    const currInput = document.activeElement;
    if (currInput?.tagName.toLowerCase() === "input") {
        const inputs = document.getElementsByTagName("input");
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i] === currInput) {
                const next = inputs[i + 1];
                if (next && next.focus) {
                    next.focus();
                }
                break;
            }
        }
    }
}

app.config.globalProperties.$enter2TabKey = enter2TabKey
app.use(grpc_api)
