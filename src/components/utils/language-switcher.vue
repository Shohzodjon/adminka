<template>
  <a-row>
    <a-select
      :default-value="getLangByText(selectedLang)"
      style="width: 150px"
      @change="changeLang(arguments)"
    >
      <a-icon slot="prefix" type="smile" />
      <a-select-option
        v-for="lang in clangs"
        :key="lang.value"
        :value="lang.value"
      >
        {{ lang.text }}
      </a-select-option>
    </a-select>
  </a-row>
</template>
<script>
export default {
  data: () => ({
    languages: {
      uz: {
        text: `O'zbekcha`,
        value: "uz"
      },
      oz: {
        text: "Ўзбекча",
        value: "oz"
      },
      ru: {
        text: "Русский",
        value: "ru"
      },
      en: {
        text: "English",
        value: "en"
      }
    },
    selectedLang: null
  }),
  computed: {
    clangs() {
      return Object.values(this.languages).filter(
        (item) => item.value !== this.$i18n.locale
      )
    }
  },
  beforeMount() {
    // console.log("lang sw", this.$i18n.locale);
    this.selectedLang = this.$i18n.locale || $langPrefix
  },
  methods: {
    changeLang(lang) {
      try {
        this.$i18n.locale = lang[0]
        localStorage.setItem("i18n_language", lang[0] || $langPrefix)
        this.$router.go()
      } catch (error) {
        console.log(error)
        this.$sentry.captureMessage(error)
      }
    },
    getLangByText(langText) {
      return (
        (this.languages[langText] && this.languages[langText].text) ||
        this.languages.oz.text
      )
    }
  }
}
</script>

<style>
.lang-item {
  padding: 10px 15px;
  border: 1px solid #ddd;
  line-height: normal;
  cursor: pointer;
}
</style>
