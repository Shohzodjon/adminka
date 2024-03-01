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
                v-model="form.title[langTab]"
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
          <a-row style="margin-top: 20px">
            <a-col :span="6" />
            <a-col :span="12">
              <a-row>
                <a-button style="margin-right: 10px" @click="$router.go(-1)">
                  <a-icon type="close" />{{ $t("Cancel") }}
                </a-button>
                <a-button type="primary" @click="submitData">
                  <a-icon type="check" />{{ $t("Add") }}
                </a-button>
              </a-row>
            </a-col>
          </a-row>
        </a-tab-pane>

        <!-- photo tab -->
        <a-tab-pane key="photo">
          <span slot="tab">
            <a-icon type="picture" />{{ $t("TablePhoto") }}
          </span>
          <!-- upload photo -->
          <a-row align="middle">
            <a-col
              :span="6"
              style="padding-top: 4px; text-align: right; padding-right: 8px"
            >
              {{ $t("TablePhotos") }}
            </a-col>
            <a-col :span="12">
              <image-upload
                :with-cropper="false"
                :buttons="true"
                :list="fileList"
                accept="image/jpeg, image/png"
                @change="handleImages"
              />
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
    "image-upload": () => import("@/components/utils/image-upload")
  },
  data: () => {
    return {
      form: {
        title: {
          ru: "",
          uz: "",
          oz: "",
          en: ""
        },
        url: "",
        type: 1,
        photo: []
      },
      fileList: [],
      langTab: "ru",
      image: null
    }
  },
  validations: {
    form: {
      url: {
        required
      }
    }
  },
  methods: {
    async submitData() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.$message.error(this.$t("PleaseForm"))

        return
      }
      try {
        let form = this.form
        Object.keys(form).forEach((k) => {
          k != "url" &&
            k != "type" &&
            k != "photo" &&
            Object.keys(form[k]).forEach((k2) => {
              form[k + "_" + k2] = form[k][k2]
            })
          k != "url" && k != "type" && k != "photo" && delete form[k]
        })
        let f = new FormData()
        Object.keys(form).forEach((k) => {
          k != "photo" && f.append(k, form[k])
        })
        form.photo.forEach((k) => {
          f.append("photo", k.fileTarget, k.fileTarget.name)
        })
        const res = await this.$api.post(
          "/common/interactive-services/create/",
          f
        )
        this.ISVALID(res, () => {
          this.$router.push({ name: "interactiveServices" })
        })
      } catch (e) {
        console.log(e)
      }
    },
    handleImages(arg) {
      this.form.photo.push(arg[0])
      console.log(this.form.photo, arg[0])
    }
  }
}
</script>

<style></style>
