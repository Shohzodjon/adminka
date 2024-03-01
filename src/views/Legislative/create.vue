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
        order: 0
      },
      langTab: "ru"
    }
  },
  computed: {
    getKey() {
      return this.langTab
    }
  },
  methods: {
    async onSubmit() {
      try {
        const res = await this.$api.post(
          "/structure/department/create/",
          this.form
        )
        this.ISVALID(res, () => {
          this.$router.push({ name: "Legislative" })
        })
      } catch (e) {
        console.log(e)
      }
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
