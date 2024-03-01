<template>
  <a-row class="content-fix" type="flex">
    <a-col class="height100 flex-1">
      <a-tabs class="main-tabs" type="card">
        <a-tab-pane key="content" class="main-tabs" type="card">
          <span slot="tab"> <a-icon type="project" />Содержимое </span>
          <!-- lang tabs -->
          <a-row
            align="middle"
            class="flex-baseline"
            style="margin-bottom: 15px"
          >
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
          <a-row align="middle" class="flex-baseline">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              Название:
            </a-col>
            <a-col :span="12" class="sm-mb">
              <a-input
                v-model="form['title_' + getKey]"
                :placeholder="$t('EnterTheTitle')"
              />
            </a-col>
          </a-row>
          <a-row style="margin-top: 20px">
            <a-col :span="6" />
            <a-col :span="12">
              <a-row>
                <a-button style="margin-right: 10px" @click="$router.go(-1)">
                  <a-icon type="close" />Отмена
                </a-button>
                <a-button type="primary" @click="submitTag">
                  <a-icon type="check" />Добавить
                </a-button>
              </a-row>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </a-col>
  </a-row>
</template>

<script>
export default {
  data() {
    return {
      form: {
        title_uz: "",
        title_ru: "",
        title_en: "",
        title_oz: "",
        title_qr: ""
      },
      langTab: "ru",
      image: null,
      image_url: ""
    }
  },
  computed: {
    getKey() {
      return this.langTab
    }
  },
  methods: {
    async submitTag() {
      try {
        await this.$store.dispatch("orderProjectInitiator/create", this.form)
        this.$message.success("Полезная ссылка создана успешно")
        this.$router.push({ name: "order-project-initiator" })
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style></style>
