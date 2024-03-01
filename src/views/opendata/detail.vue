<template>
  <a-row class="content-fix" type="flex">
    <spinner v-if="loading" />
    <a-col v-else class="height100 flex-1">
      <a-tabs :key="$route.fullPath" class="main-tabs" type="card">
        <a-tab-pane key="content">
          <span slot="tab">
            <a-icon type="project" />Содержимое
            {{ form.id ? form.id : "New" }}
          </span>

          <!-- lang tabs -->
          <a-row align="middle" class="flex-baseline input-form__group">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              Язык:
            </a-col>
            <a-col :span="12">
              <!-- lang translit tabs -->
              <a-row align="middle" class="flex-baseline flex-wrap">
                <lang-tabs v-model="langTab" class="mb-1x" />
              </a-row>
            </a-col>
          </a-row>

          <!-- full name -->
          <a-row align="middle" class="flex-baseline input-form__group">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              Заголовок
            </a-col>
            <a-col :span="12">
              <a-input
                v-model.trim="form.title[langTab]"
                :placeholder="$t('EnterTitle')"
              />
            </a-col>
          </a-row>
          <a-row align="middle" class="flex-baseline input-form__group">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              Контент
            </a-col>
            <a-col :span="12">
              <a-input
                v-model.trim="form.content[langTab]"
                placeholder="Введите контент"
              />
            </a-col>
          </a-row>
          <a-row align="middle" class="flex-baseline input-form__group">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              Основная ссылка
            </a-col>
            <a-col :span="12">
              <a-input
                v-model.trim="form.link"
                placeholder="Введите основную ссылку"
              />
            </a-col>
          </a-row>
          <a-row align="middle" class="flex-baseline input-form__group">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              Ссылка на csv файл
            </a-col>
            <a-col :span="12">
              <a-input
                v-model.trim="form.csv"
                placeholder="Введите ссылку на csv файл"
              />
            </a-col>
          </a-row>
          <a-row align="middle" class="flex-baseline input-form__group">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              Ссылка на xml файл
            </a-col>
            <a-col :span="12">
              <a-input
                v-model.trim="form.xml"
                placeholder="Введите ссылку на xml файл"
              />
            </a-col>
          </a-row>

          <a-row align="middle" class="flex-baseline input-form__group">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              Ссылка на json файл
            </a-col>
            <a-col :span="12">
              <a-input
                v-model.trim="form.json"
                placeholder="Введите ссылку на json файл"
              />
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>

      <a-row class="form-buttons__action" type="flex">
        <a-col :span="6" style="text-align: right; padding-right: 8px" />
        <a-col>
          <a-button :disabled="pending" @click="$router.go(-1)">
            <a-icon type="close" />Отмена
          </a-button>

          <a-button
            :loading="pending"
            style="margin-left: 10px"
            type="primary"
            @click="submit"
          >
            <a-icon type="check" />
            {{ form.id ? "Сохранить" : "Добавить" }}
          </a-button>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>

<script>
import { mapActions } from "vuex"
const fields = {
  title: {
    uz: "",
    oz: "",
    en: "",
    ru: ""
  },
  content: {
    uz: "",
    oz: "",
    en: "",
    ru: ""
  },
  json: "",
  xml: "",
  csv: "",
  link: ""
}

export default {
  data: () => ({
    form: { ...fields },
    loading: false,
    pending: false,
    langTab: $langPrefix
  }),
  watch: {
    $route: {
      handler: "fetchData",
      immediate: true
    }
  },
  beforeDestroy() {
    this.$set(this, "form", {
      ...fields
    })
  },

  methods: {
    ...mapActions("opendata", ["detail"]),
    async fetchData() {
      this.loading = true

      this.$set(this, "form", {
        ...fields
      })

      try {
        if (this.$route.params.id) {
          const res = await this.detail(this.$route.params.id)
          if (res) {
            this.$set(this, "form", {
              ...res,
              title: (res.title && JSON.parse(res.title)) || {
                ...this.langKeys
              },
              content: (res.content && JSON.parse(res.content)) || {
                ...this.langKeys
              }
            })
          }
        }
      } catch (e) {
        this.$sentry.captureMessage(e)
        this.loading = false
      }

      this.loading = false
    },
    async submit() {
      this.pending = true
      try {
        const res = await this.$store.dispatch(
          `opendata/${this.form.id ? "update" : "create"}ItemAction`,
          {
            id: this.form.id || null,
            data: {
              ...this.form,
              title: JSON.stringify(this.form.title),
              content: JSON.stringify(this.form.content)
            }
          }
        )

        if (res && res.data && res.data.id) {
          this.$message.success("Успешно сохранено")
          this.$router.go(-1)
        }
      } catch (e) {
        console.log(e)
        this.pending = false
        this.$sentry.captureMessage(e)
      }

      this.pending = false
    }
  }
}
</script>
