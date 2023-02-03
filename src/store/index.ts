import { createStore } from 'vuex'


function getLocalStringValue(key: string) {
  const v = localStorage.getItem(key)
  if (v === undefined || v === null) {
    return ''
  }

  return v
}

function getLocalJsonValue(key: string) {
  const v = getLocalStringValue(key)
  if (v === '') {
    return null
  }

  return JSON.parse(v)
}


export default createStore({
  state: {
    hasLogin: getLocalStringValue('hasLogin') === '1',
    userInfo: getLocalJsonValue('userInfo'),
    $grpc: null,
  },
  getters: {
    hasLogin(state) {
      return state.hasLogin
    },
    userInfo(state) {
      return state.userInfo
    },
  },
  mutations: {
    setLogin(state, val) {
      state.hasLogin = val === '1'
      localStorage.setItem('hasLogin', val)
    },
    userInfo(state, val) {
      state.userInfo = val
      localStorage.setItem('userInfo', JSON.stringify(val))
    },
  },
  actions: {
    GetAndCheckToken({commit, state}) {
        return new Promise((resolve, reject) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          state.$grpc?.checkToken().then((resp: any) => {
            if (resp.getStatus().getCode() === 1) {
              commit('setLogin', '1')
              commit('userInfo', resp.getTokenInfo().toObject())
              resolve(resp)
            } else {
              commit('setLogin', '0')
              commit('userInfo', {})
              reject()
            }
          }).catch(() => {
            reject()
          })
        })
    },
    Logout({commit, state}) {
      state.hasLogin = false
      commit('userInfo', {})
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        state.$grpc?.logout().then((resp: any) => {
          if (resp.getStatus().getCode() === 1) {
            resolve(resp)
          } else {
            reject()
          }
        }).catch(() => {
          reject()
        })
      })
    }
  },
  modules: {
  }
})
