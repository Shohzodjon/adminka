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
                :placeholder="$t('TagsColTitle')"
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
              <a-button :loading="pending" type="primary" @click="submitData">
                {{ $t("Save") }}
              </a-button>
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
                :buttons="false"
                :list="form.photo"
                accept="image/jpeg, image/png"
                @change="handleImages"
              />
            </a-col>
          </a-row>
        </a-tab-pane>
        <!-- <span v-if="data.id" slot="tabBarExtraContent">
          <a-popconfirm
            placement="bottomRight"
            title="Вы действительно хотите удалить данный новость?"
            @confirm="removeItem"
          >
            <a-button style="margin-right: 10px">
              <a-icon type="delete" />Удалить
            </a-button>
          </a-popconfirm>
        </span> -->
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
        title_uz: "",
        title_ru: "",
        title_en: "",
        title_oz: "",
        title_qr: "",
        url: "",
        type: 1
      },
      fileList: [],
      langTab: "ru",
      image: null,
      pending: false,
      newImage: null
    }
  },
  computed: {
    getKey() {
      return this.langTab
    }
  },
  validations: {
    form: {
      url: {
        required
      }
    }
  },
  async created() {
    const form = await this.$store.dispatch(
      "interactiveServices/fetchInteractiveServicesById",
      this.$route.params.id
    )
    this.form = form
  },

  methods: {
    async submitData() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.$message.error(this.$t("PleaseForm"))

        return
      }
      // if (!Object.keys(this.data.name).every((item) => this.data.name[item])) {
      //   this.$message.error("Введите название на всех языках")
      //   return
      // }

      // if (!Object.keys(this.data.link).every((item) => this.data.link[item])) {
      //   this.$message.error("Заполните ссылки на всех языках")
      //   return
      // }

      // if (!this.fileList.length) {
      //   this.$message.error('Выберете изображение во вкладке "Фото" ')
      //   return
      // }

      this.pending = true
      const id = this.$route.params.id
      try {
        let form = this.form
        Object.keys(form).forEach((k) => {
          k == "title" &&
            Object.keys(form[k]).forEach((k2) => {
              form[k + "_" + k2] = form[k][k2]
            })
          k == "title" && delete form[k]
        })
        let f = new FormData()
        Object.keys(form).forEach((k) => {
          k != "photos" && f.append(k, form[k])
        })

        this.newImage &&
          this.newImage.fileTarget &&
          f.append(
            "photos",
            this.newImage && this.newImage.fileTarget,
            this.newImage && this.newImage.fileTarget.name
          )
        const res = await this.$api.patch(
          `/common/interactive-services/update/${id}/`,
          f
        )
        this.ISVALID(res, () => {
          this.$router.push({ name: "interactiveServices" })
        })
      } catch (error) {
        console.error(error)
        this.$sentry.captureMessage(error)
      }

      this.pending = false
    },
    handleImages(arg) {
      this.newImage = arg[0]
      console.log(this.newImage)
    }
  }
}
</script>

<style></style>
