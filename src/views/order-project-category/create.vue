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
          <a-row align="middle" class="flex-baseline">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              Icon:
            </a-col>
            <a-col :span="12" class="sm-mb">
              <input
                type="file"
                accept="image/svg, image/png"
                @change="handleFile"
              />
              <img :src="image_url" />
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
        title_qr: "",
        icon: null
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
        let f = new FormData()
        Object.keys(this.form).forEach((k) => {
          k != "icon" && this.form[k] && f.append(k, this.form[k])
          k == "icon" &&
            this.form[k] &&
            f.append(k, this.form[k], this.form[k].name)
        })
        await this.$store.dispatch("orderProjectCategory/create", f)
        this.$message.success("Полезная ссылка создана успешно")
        this.$router.push({ name: "order-project-category" })
      } catch (e) {
        console.log(e)
      }
    },
    handleFile(e) {
      this.image_url = URL.createObjectURL(e.target.files[0])
      this.form.icon = e.target.files[0]
    }
  }
}
</script>

<style scoped>
input[type="file"] {
  width: 100%;
}
img {
  height: 200px;
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>
