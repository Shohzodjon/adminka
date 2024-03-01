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
              {{ $t("Urll") }}:
            </a-col>
            <a-col :span="12" class="sm-mb">
              <a-input
                v-model="form.url"
                :class="{ invalid: $v.form.url.$error }"
                :placeholder="$t('Urll')"
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
              <a-input-number v-model="form.position" :min="0" />
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              {{ $t("TablePhoto") }}:
            </a-col>
            <a-col :span="12" class="sm-mb">
              <input
                type="file"
                accept="image/jpg, image/jpeg, image/png, image/svg"
                @change="handleFileUpload"
              />
              <div
                v-if="$v.form.photo.$error"
                :class="{ invalid: $v.form.photo.$error }"
              >
                {{ $t("FieldEmpty") }}
              </div>
              <div class="committee-image">
                <img :src="image_url" />
              </div>
            </a-col>
          </a-row>
          <a-row style="margin-top: 20px">
            <a-col :span="6" />
            <a-col :span="12">
              <a-row>
                <a-button style="margin-right: 10px" @click="$router.go(-1)">
                  <a-icon type="close" />{{ $t("Cancel") }}
                </a-button>
                <a-button type="primary" @click="submitUsefullLinks">
                  <a-icon type="check" />{{ $t("Add") }}
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
        url: "",
        type: 2,
        photo: null,
        position: null
      },
      langTab: "ru",
      image: null,
      image_url: ""
    }
  },
  validations: {
    form: {
      photo: {
        required
      },
      url: {
        required
      }
    }
  },
  computed: {
    getKey() {
      return this.langTab
    }
  },
  methods: {
    async submitUsefullLinks() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.$message.error(this.$t("PleaseForm"))

        return
      }
      let f = new FormData()
      Object.keys(this.form).forEach((key) => {
        f != "photo" && f.append(key, this.form[key])
        f == "photo" && f.append(key, this.form[key], this.form[key].name)
      })
      try {
        const res = await this.$api.post("/common/useful-links/create/", f)
        this.ISVALID(res, () => {
          this.$router.push({ name: "usefullLinks" })
        })
        // this.$message.success("Полезная ссылка создана успешно")
      } catch (e) {
        console.log(e)
      }
    },

    handleImages(arg) {
      console.log(arg)
      this.form.photos = arg
    },

    handleFileUpload(e) {
      // this.form.photo = this.$refs.file.files[0]
      console.log(e.target.files[0])
      this.image_url = URL.createObjectURL(e.target.files[0])
      this.form.photo = e.target.files[0]
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
