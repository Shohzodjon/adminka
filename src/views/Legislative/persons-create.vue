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
              {{ $t("FormFirstName") }}:
            </a-col>
            <a-col :span="12" class="sm-mb">
              <a-input
                v-model="form['first_name_' + getKey]"
                :placeholder="$t('FormFirstName')"
              />
            </a-col>
          </a-row>
          <a-row align="middle" class="flex-baseline">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              {{ $t("FormLastName") }}:
            </a-col>
            <a-col :span="12" class="sm-mb">
              <a-input
                v-model="form['last_name_' + getKey]"
                :placeholder="$t('FormLastName')"
              />
            </a-col>
          </a-row>
          <a-row align="middle" class="flex-baseline">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              {{ $t("FormMiddleName") }}:
            </a-col>
            <a-col :span="12" class="sm-mb">
              <a-input
                v-model="form['middle_name_' + getKey]"
                :placeholder="$t('FormMiddleName')"
              />
            </a-col>
          </a-row>
          <a-row align="middle" class="flex-baseline">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              {{ $t("Email") }}:
            </a-col>
            <a-col :span="12" class="sm-mb">
              <a-input
                v-model="form.email"
                :class="{ invalid: $v.form.email.$error }"
                :placeholder="$t('Email')"
              />
            </a-col>
          </a-row>
          <a-row align="middle" class="flex-baseline">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              {{ $t("PositionPerson") }}:
            </a-col>
            <a-col :span="12" class="sm-mb">
              <a-input
                v-model="form['position_' + getKey]"
                :placeholder="$t('PositionPerson')"
              />
            </a-col>
          </a-row>
          <a-row align="middle" class="flex-baseline">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              {{ $t("FormPhone") }}:
            </a-col>
            <a-col :span="12" class="sm-mb">
              <a-input
                v-model="form.phone"
                :class="{ invalid: $v.form.phone.$error }"
                type="tel"
                placeholder="+998"
              />
            </a-col>
          </a-row>
          <a-row align="middle" class="flex-baseline">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              {{ $t("Department") }}:
            </a-col>
            <a-col :span="12" class="sm-mb">
              <a-select
                v-model="form.department"
                :class="{ invalid: $v.form.department.$error }"
                style="width: 100%"
                :placeholder="$t('Department')"
                option-label-prop="label"
              >
                <a-select-option
                  v-for="item of departments"
                  :key="item.id"
                  :value="item.id"
                  :label="item.title"
                >
                  {{ item.title }}
                </a-select-option>
              </a-select>
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
                @change="handleFile"
              />
              <div
                v-if="$v.form.img.$error"
                :class="{ invalid: $v.form.img.$error }"
              >
                {{ $t("FieldEmpty") }}
              </div>
              <div class="fraction-image">
                <img :src="image_url" />
              </div>
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
import { required, email } from "vuelidate/lib/validators"

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
        first_name_uz: "",
        first_name_ru: "",
        first_name_en: "",
        first_name_oz: "",
        first_name_qr: "",
        last_name_uz: "",
        last_name_ru: "",
        last_name_en: "",
        last_name_oz: "",
        last_name_qr: "",
        middle_name_uz: "",
        middle_name_oz: "",
        middle_name_ru: "",
        middle_name_qr: "",
        middle_name_en: "",
        position_uz: "",
        position_ru: "",
        position_oz: "",
        position_qr: "",
        position_en: "",
        email: "",
        phone: "",
        department: null,
        order: 0,
        img: null
      },
      langTab: "ru",
      departments: [],
      image_url: null
    }
  },
  validations: {
    form: {
      department: {
        required
      },
      email: {
        required,
        email
      },
      img: {
        required
      },
      phone: {
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
    this.departments = await this.$store.dispatch(
      "legislative/getDepartmentList"
    )
  },
  methods: {
    async onSubmit() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.$message.error(this.$t("PleaseForm"))

        return
      }
      let form = this.form
      // Object.keys(form).forEach((k) => {
      //   k == "title" &&
      //     Object.keys(form[k]).forEach((k2) => {
      //       form[k + "_" + k2] = form[k][k2]
      //     })
      // })
      // delete form.title
      let f = new FormData()
      Object.keys(form).forEach((k) => {
        k != "img" && f.append(k, form[k])
        k == "img" && form[k] && f.append(k, form[k], form[k].name)
      })
      // delete form.title
      // form.title = form.title_uz
      const res = await this.$api.post("/structure/staff/create/", f)
      this.ISVALID(res, () => {
        this.$router.push({
          name: "Legislative"
        })
      })
    },
    handleFile(e) {
      console.log(e.target.files[0])
      this.image_url = URL.createObjectURL(e.target.files[0])
      this.form.img = e.target.files[0]
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
.fraction-image {
  max-height: 200px;
  max-width: 200px;
  margin-top: 8px;
}
.fraction-image img {
  width: 100%;
  height: 100%;
}
</style>
