import Vue from "vue"
import App from "./App.vue"
import router from "./router"

import { t$ } from "@/assets/js/lct.js"
import axiosExt from "@/assets/js/axios.ext"
import "@/assets/js/helper"
import { modules } from "@/assets/js/helper"

import Antd, { message } from "ant-design-vue"
import "ant-design-vue/dist/antd.less"
import "@/assets/css/board-theme.less"
import "@/assets/css/main.css"
import "@/assets/css/sidebar.scss"
import "@/assets/css/style.css"
import "@/assets/css/new.css"
import "@/assets/js/tinymce.min.js"
import "@/assets/js/theme.min.js"
import langTabs from "@/components/utils/lang-tabs"
import blankContainer from "@/components/utils/blank-container"
import spinner from "@/components/utils/spinner"
import { i18n } from "@/assets/js/vue-i18n-init"
import moment from "moment"
import store from "./store"
import Vuelidate from "vuelidate"
import { VueMaskDirective } from "v-mask"
import * as Sentry from "@sentry/browser"
import { Vue as VueIntegration } from "@sentry/integrations"

import { Cropper } from "vue-advanced-cropper"

import PerfectScrollbar from "vue2-perfect-scrollbar"
// import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css"

import helper from "./mixins/helper"
import Print from 'vue-print-nb'
// Global instruction 
Vue.use(Print);

Vue.use(PerfectScrollbar)

Vue.use(Vuelidate)
Vue.use(Antd)
Vue.directive("mask", VueMaskDirective)

Vue.component("lang-tabs", langTabs)
Vue.component("blank-container", blankContainer)
Vue.component("spinner", spinner)
Vue.component("cropper", Cropper)
Vue.mixin(helper)

moment.locale("ru")

store.$api = axiosExt

const isDev = process.env.NODE_ENV !== "production"

const token = sessionStorage.getItem("token")

if (token) {
  store.commit("setToken", token)
}

Vue.mixin({
  methods: {
    editorChangeHandler(e) {
      const w = e ? e.replace(`<p>&nbsp;</p>\n</details>`, "</details>") : e
      return w
    }
  }
})

if (!isDev) {
  Sentry.init({
    debug: isDev,
    disabled: isDev,
    dsn: "https://c85c1798d19e4d588dc16d0e1c1c1e3f@o392157.ingest.sentry.io/5369734",
    integrations: [new VueIntegration({ Vue, attachProps: true })]
  })
}

router.beforeEach((to, from, next) => {
  modules.linkDrag(to)

  if (store.getters.isLoggedIn) {
    console.log("to", to.meta.roles)
    console.log("from", from)
    console.log("next", next)
    if (to.path === "/login") {
      next("/")
    } else {
      to.path != "/" &&
      to &&
      to.meta &&
      to.meta.roles &&
      !to.meta.roles.includes(store.state.role)
        ? next("/")
        : next()
      // next()
    }
  } else {
    if (to.path === "/login") {
      next()
    } else {
      // console.log('!Authenticated')
      next("/login")
    }
    return
  }

  next()
})

Vue.config.productionTip = false
Vue.config.performance = isDev

Vue.prototype.moment = moment
Vue.prototype.$message = message
Vue.prototype.$api = axiosExt
Vue.prototype.$sentry = Sentry

window.t$ = t$

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App)
}).$mount("#app")
