<template>
  <a-row class="content-fix" type="flex">
    <a-col class="height100 flex-1">
      <a-tabs class="main-tabs" type="card">
        <a-tab-pane key="content" class="main-tabs" type="card">
          <span slot="tab">
            <a-icon type="project" />{{ $t("TableContent") }}
          </span>
          <!-- lang tabs -->
          <a-row
            align="middle"
            class="flex-baseline"
            style="margin-bottom: 15px"
          >
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              {{ $t("Lang") }}:
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
              {{ $t("TagsColTitle") }}:
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
              {{ $t("description") }}:
            </a-col>
            <a-col :span="12" class="sm-mb">
              <a-textarea
                v-model="form['description_' + getKey]"
                :placeholder="$t('EnterDescription')"
              />
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              {{ $t("TableAudio") }}:
            </a-col>
            <a-col :span="12" class="sm-mb">
              <input type="file" @change="handleFileUpload" />
              <!-- <a-upload name="file" :multiple="true" v-model="form.photo">
                    <a-button> <a-icon type="upload" /> Click to Upload </a-button>
                  </a-upload> -->
              <div class="committee-image">
                <audio :src="audio_url" controls>audio_url</audio>
              </div>
            </a-col>
          </a-row>
          <a-row align="middle" class="flex-baseline">
            <a-col :span="4" style="text-align: right; padding-right: 8px">
              {{ $t("Status") }}:
            </a-col>
            <a-col :span="20" class="sm-mb">
              <a-switch v-model="form.is_active" />
            </a-col>
          </a-row>
          <a-row style="margin-top: 20px">
            <a-col :span="6" />
            <a-col :span="12">
              <a-row>
                <a-button style="margin-right: 10px" @click="$router.go(-1)">
                  <a-icon type="close" />{{ $t("Cancel") }}
                </a-button>
                <a-button type="primary" @click="onSubmit">
                  <a-icon type="check" />{{ $t("Add") }}
                </a-button>
              </a-row>
            </a-col>
          </a-row>
        </a-tab-pane>

        <!-- photo tab -->
        <!-- <a-tab-pane key="photo">
          <span slot="tab"> <a-icon type="picture" />Фото </span>
          <a-row align="middle">
            <a-col
              :span="6"
              style="padding-top: 4px; text-align: right; padding-right: 8px"
            >
              Изображения
            </a-col>
            <a-col :span="12">
              <image-upload
                :with-cropper="false"
                :buttons="false"
                :list="form.photos"
                accept="image/jpeg, image/png"
                @change="handleImages"
              />
            </a-col>
          </a-row>
        </a-tab-pane> -->
      </a-tabs>
    </a-col>
  </a-row>
</template>

<script>
export default {
  components: {
    // "image-upload": () => import("@/components/utils/image-upload")
  },
  data() {
    return {
      // form: {
      //   title: {
      //     ru: "",
      //     uz: "",
      //     oz: "",
      //     en: "",
      //     qr: ""
      //   },

      //   url: "",
      //   type: 2
      // },
      form: {
        title_uz: "",
        title_ru: "",
        title_en: "",
        title_oz: "",
        title_qr: "",
        description_uz: "",
        description_ru: "",
        description_en: "",
        description_oz: "",
        description_qr: "",
        is_active: false,
        file: null
      },
      langTab: "ru",
      audio_url: ""
    }
  },
  computed: {
    getKey() {
      return this.langTab
    }
  },
  async created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.form = await this.$store.dispatch(
        "podcasts/fetchPodcastById",
        this.$route.params.id
      )
      this.audio_url = this.form.file
      this.form.file = null
    },
    async onSubmit() {
      let f = new FormData()
      console.log("f", f, this.form)
      Object.keys(this.form).forEach((k) => {
        this.form[k] && k != "file" && f.append(k, this.form[k])
        k == "is_active" && f.append(k, this.form[k])
        k == "file" &&
          this.form[k] &&
          f.append(k, this.form[k], this.form[k].name)
      })
      console.log(f)
      try {
        await this.$api.patch(
          `/common/podcast/update/${this.$route.params.id}/`,
          f
        )
        this.$message.success("Прямой эфир успешно изменен")
      } catch (e) {
        console.log(e)
      }
    },
    handleFileUpload(e) {
      // this.form.photo = this.$refs.file.files[0]
      console.log(e.target.files[0])
      this.audio_url = URL.createObjectURL(e.target.files[0])
      this.form.file = e.target.files[0]
    }
  }
}
</script>

<style>
.committee-image {
  overflow: hidden;
  margin-top: 15px;
}
.committee-image > img {
  height: 200px;
}
</style>
