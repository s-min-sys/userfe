import {createApp} from 'vue'
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

app.use(grpc_api)

router.beforeEach((to, from, next) => {
    if (to.path === "/sso") {
        // eslint-disable-next-line no-prototype-builtins
        if (to.query.hasOwnProperty("url")) {
            // eslint-disable-next-line no-prototype-builtins
            if (to.query.hasOwnProperty("logout")) {
                store
                    .dispatch("Logout")
                    .then(() => {
                        window.location.replace(
                            app.config.globalProperties.$grpc.updateQueryStringParameter(
                                to.query["url"],
                                "logout_result",
                                "0"
                            )
                        );
                    })
                    .catch(() => {
                        window.location.replace(
                            app.config.globalProperties.$grpc.updateQueryStringParameter(
                                to.query["url"],
                                "logout_result",
                                "-1"
                            )
                        );
                    });
            } else {
                store
                    .dispatch("SSOLogin", to.query["url"])
                    .then(resp => {
                        if (resp !== null && (resp.getStatus().getCode() === 1 && resp.getSsoToken() !== "")) {
                            window.location.replace(
                                app.config.globalProperties.$grpc.updateQueryStringParameter(
                                    to.query["url"],
                                    "sso_token",
                                    resp.getSsoToken()
                                )
                            );
                        } else {
                            next({
                                path: '/biz',
                                query: { redirected: to.query["url"], op: 'login', sso: "1" },
                            })
                        }
                    })
                    .catch(err => {
                        window.location.replace(
                            app.config.globalProperties.$grpc.updateQueryStringParameter(
                                to.query["url"],
                                "token_err",
                                err
                            )
                        );
                    });
            }
        }

        return
    }

    if (to.meta.requireAuth) {
        store.dispatch('GetAndCheckToken').then(()=>{
            next()
        }).catch(() => {
            next({
                path: '/biz',
                query: { redirected: to.fullPath, op: 'login' },
            })
        })

        return
    }

    if (store.getters.hasLogin) {
        store.dispatch('GetAndCheckToken').then(() => {
            console.log('token valid')
        })
    }

    next()
})

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


import * as ElementPlusIconsVue from '@element-plus/icons-vue'

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

store.state.$grpc = app.config.globalProperties.$grpc;
