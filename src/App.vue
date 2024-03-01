<template>
  <div id="app">
    <a-config-provider :locale="locale">
      <a-layout style="min-height: 100vh">
        <router-view />
      </a-layout>
    </a-config-provider>
  </div>
</template>

<script>
import ruRF from "ant-design-vue/lib/locale-provider/ru_RU"

export default {
  data: () => ({
    locale: ruRF
  }),
  watch: {
    "$store.getters.isLoggedIn"() {
      if (!this.$store.getters.isLoggedIn) {
        this.$router.replace("/login")
      }
    }
  },
  created() {
    const localeStorageLang = localStorage.getItem("i18n_language")

    if (localeStorageLang) {
      // console.log('localeStorageLang', localeStorageLang)
      this.$i18n.locale = localeStorageLang
    }
  }
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
