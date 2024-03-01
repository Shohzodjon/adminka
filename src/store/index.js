import Vue from "vue"
import Vuex from "vuex"
import modules from "./modules"
// import _ from 'lodash'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    ...modules
  },
  state: {
    token: null,
    role: ""
  },
  getters: {
    isLoggedIn: (state) => !!state.token
  },
  mutations: {
    setToken(state, payload) {
      state.token = payload || ""

      // parsing jwt token
      var base64Url = payload.split(".")[1]
      var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      var jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
          })
          .join("")
      )

      let parsedToken = JSON.parse(jsonPayload)
      state.role = parsedToken && parsedToken.user_role
      // console.log("parse token", parsedToken)

      if (payload) {
        sessionStorage.setItem("token", payload)
        return
      }

      sessionStorage.removeItem("token")
    },
    setRole(state, role) {
      state.role = role
    }
  },
  actions: {}
})
