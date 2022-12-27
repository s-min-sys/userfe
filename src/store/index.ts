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
    token: getLocalStringValue('uToken'),
    userInfo: getLocalJsonValue('uInfo'),
  },
  getters: {
    token(state) {
      return state.token
    },
    userInfo(state) {
      return state.userInfo
    },
  },
  mutations: {
    token(state, val) {
      state.token = val
      localStorage.setItem('uToken', val)
    },
    userInfo(state, val) {
      state.userInfo = val
      localStorage.setItem('uInfo', JSON.stringify(val))
    },
  },
  actions: {
  },
  modules: {
  }
})
