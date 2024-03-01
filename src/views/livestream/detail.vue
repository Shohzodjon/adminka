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
              {{ $t("Status") }}:
            </a-col>
            <a-col :span="12" class="sm-mb">
              <a-input
                v-model="form['status_' + getKey]"
                :placeholder="$t('EnterStatus')"
              />
            </a-col>
          </a-row>
          <a-row align="top" class="input-form__group" type="flex">
            <a-col
              :span="6"
              style="text-align: right; padding-top: 5px; padding-right: 8px"
            >
              {{ $t("MenuPosition") }}
            </a-col>
            <a-col :span="12">
              <a-input-number v-model="form.order" :min="0" />
            </a-col>
          </a-row>
          <a-row align="middle" class="flex-baseline">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              {{ $t("Url") }}:
            </a-col>
            <a-col :span="12" class="sm-mb">
              <a-input v-model="form.url" :placeholder="$t('EnterUrl')" />
            </a-col>
          </a-row>
          <a-row align="middle" class="flex-baseline">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              {{ $t("TableDate") }}:
            </a-col>
            <a-col :span="12" class="sm-mb">
              <input
                v-model="form.stream_date"
                :class="{ invalid: $v.form.stream_date.$error }"
                type="datetime-local"
              />
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              {{ $t("TablePhotos") }}:
            </a-col>
            <a-col :span="12" class="sm-mb">
              <input
                type="file"
                accept="image/jpg, image/jpeg, image/png, image/svg"
                @change="handleFileUpload"
              />
              <!-- <a-upload name="file" :multiple="true" v-model="form.photo">
                    <a-button> <a-icon type="upload" /> Click to Upload </a-button>
                  </a-upload> -->
              <div class="committee-image">
                <img :src="image_url" />
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
import { required } from "vuelidate/lib/validators"

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
        status_uz: "",
        status_ru: "",
        status_en: "",
        status_oz: "",
        status_qr: "",
        url: "",
        is_active: false,
        image: null,
        stream_date: "",
        order: ""
      },
      image_url: "",
      langTab: "ru"
    }
  },
  validations: {
    form: {
      stream_date: {
        required
      }
    }
  },
  computed: {
    getKey() {
      return this.langTab
    }
  },
  async created() {
    this.form = await this.$store.dispatch(
      "livestream/fetchLivestreamDetail",
      this.$route.params.id
    )
    this.form.stream_date = this.form.stream_date.split("+")[0]
    this.image_url = this.form.image
    this.form.image = null
  },
  methods: {
    async onSubmit() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.$message.error(this.$t("PleaseForm"))

        return
      }
      let f = new FormData()
      console.log("f", f, this.form)
      Object.keys(this.form).forEach((k) => {
        this.form[k] && k != "image" && f.append(k, this.form[k])
        k == "is_active" && f.append(k, this.form[k])
        k == "image" &&
          this.form[k] &&
          f.append(k, this.form[k], this.form[k].name)
      })
      console.log(f)
      try {
        const res = await this.$api.patch(
          `/structure/livestream/${this.$route.params.id}/`,
          f
        )
        this.ISVALID(res, () => {
          this.$router.push({ name: "livestream" })
        })
        this.$message.success("Прямой эфир успешно изменен")
      } catch (e) {
        console.log(e)
      }
    },
    handleFileUpload(e) {
      // this.form.photo = this.$refs.file.files[0]
      console.log(e.target.files[0])
      console.log(e)
      this.image_url = URL.createObjectURL(e.target.files[0])
      this.form.image = e.target.files[0]
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
