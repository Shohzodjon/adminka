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
              <a-button
                :loading="pending"
                type="primary"
                @click="submitUsefullLinks"
              >
                Сохранить
              </a-button>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </a-col>
  </a-row>
</template>

<script>
export default {
  components: {
    // "image-upload": () => import("@/components/utils/image-upload")
  },
  data: () => {
    return {
      form: {
        title_uz: "",
        title_ru: "",
        title_en: "",
        title_oz: "",
        title_qr: ""
      },
      langTab: "ru",
      pending: false
    }
  },
  computed: {
    getKey() {
      return this.langTab
    }
  },
  async created() {
    if (this.$route.params.id == "create") {
      this.$router.push({ name: "order-project-initiator-create" })
    } else {
      const form = await this.$store.dispatch(
        "orderProjectInitiator/fetchDetail",
        this.$route.params.id
      )
      this.form = form
      // this.image_url = form.photo
    }
  },
  methods: {
    async submitUsefullLinks() {
      this.pending = true
      const id = this.$route.params.id
      try {
        // let f = new FormData()
        // Object.keys(this.form).forEach((key) => {
        //   f != "photo" && f.append(key, this.form[key])
        //   f == "photo" &&
        //     typeof this.form[key] == "object" &&
        //     f.append(key, this.form[key], this.form[key].name)
        // })
        this.$api.patch(
          `/structure/orderprojectinitiator/update/${id}/`,
          this.form
        )
        this.$message.success("Полезная ссылка изменена успешно!")
        this.$router.go(-1)
      } catch (error) {
        console.error(error)
        this.$sentry.captureMessage(error)
      }

      this.pending = false
    },
    handleImages(arg) {
      this.fileList = arg
    },
    async removeItem() {
      await this.remove(this.data.id)
      this.$message.success("Полезная ссылка успешно удалена")
      this.$router.push({ name: "usefullLinks" })
    }
    // handleFileUpload(e) {
    // this.form.photo = this.$refs.file.files[0]
    //   console.log(e.target.files[0])
    //   this.image_url = URL.createObjectURL(e.target.files[0])
    //   this.form.photo = e.target.files[0]
    // }
  }
}
</script>

<style></style>
