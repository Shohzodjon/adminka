<template>
  <a-row class="content-fix" type="flex">
    <spinner v-if="loading" />
    <a-col v-else class="height100 flex-1">
      <a-tabs
        class="main-tabs"
        type="card"
        :active-key="$route.query.tab || 'content'"
        @change="$router.push({ query: { tab: arguments[0] } })"
      >
        <a-tab-pane key="content">
          <span slot="tab"> <a-icon type="project" />Содержимое </span>

          <!-- lang tabs -->
          <a-row align="middle" class="flex-baseline input-form__group">
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

          <!-- avatar -->
          <a-row align="middle" class="input-form__group">
            <a-col
              :span="6"
              style="text-align: right; padding-top: 4px; padding-right: 8px"
            >
              Фото:
            </a-col>
            <a-col :span="12">
              <a-row align="top" type="flex">
                <a-avatar
                  :size="86"
                  :src="ccAvatar"
                  icon="user"
                  shape="square"
                />

                <input
                  ref="avatarInputRef"
                  accept="image/jpeg, image/png"
                  hidden
                  type="file"
                  @change="handleAvatar"
                />
                <a-button class="ml-1x" @click="showModal(true)">
                  Выбрать
                </a-button>

                <a-button class="ml-1x" @click="removeAvatar">
                  Удалить
                </a-button>
              </a-row>
              <!--              <div class="error-text" v-if="!$v.avatar.required">-->
              <!--                Выберите изображение.-->
              <!--              </div>-->
            </a-col>
          </a-row>

          <!-- full name -->
          <a-row align="middle" class="flex-baseline input-form__group">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              Ф.И.О:
            </a-col>
            <a-col :span="12">
              <a-input
                v-model.trim="form.full_name[langTab]"
                placeholder="Введите Ф.И.О"
              />
            </a-col>
          </a-row>

          <!-- Звание начальника -->
          <a-row align="middle" class="flex-baseline input-form__group">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              Звание:
            </a-col>
            <a-col :span="12">
              <a-input
                v-model.trim="form.leader_position[langTab]"
                placeholder="Введите Звание начальника"
              />
            </a-col>
          </a-row>

          <!-- department_name -->
          <a-row align="middle" class="flex-baseline input-form__group">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              Название депратамента
            </a-col>
            <a-col :span="12">
              <a-input
                v-model.trim="form.department_name[langTab]"
                placeholder="Название депратамента"
              />
            </a-col>
          </a-row>

          <!-- phone -->
          <a-row align="top" class="input-form__group" type="flex">
            <a-col
              :span="6"
              style="text-align: right; padding-top: 5px; padding-right: 8px"
            >
              Номер телефона:
            </a-col>
            <a-col :span="12">
              <a-input-number
                v-model="form.phone"
                style="width: 100%"
                placeholder="+998 (XX) XXX-XX-XX"
              />
            </a-col>
          </a-row>

          <!-- lat -->
          <a-row align="top" class="input-form__group" type="flex">
            <a-col
              :span="6"
              style="text-align: right; padding-top: 5px; padding-right: 8px"
            >
              Широта (для указания на карте)
            </a-col>
            <a-col :span="12">
              <a-input-number
                v-model="form.lat"
                style="width: 100%"
                placeholder
                :step="0.00001"
              />
            </a-col>
          </a-row>

          <!-- lng -->
          <a-row align="top" class="input-form__group" type="flex">
            <a-col
              :span="6"
              style="text-align: right; padding-top: 5px; padding-right: 8px"
            >
              Долгота (для указания на карте)
            </a-col>
            <a-col :span="12">
              <a-input-number
                v-model="form.lng"
                style="width: 100%"
                placeholder
                :step="0.00001"
              />
            </a-col>
          </a-row>

          <!-- work days -->
          <a-row align="top" class="input-form__group" type="flex">
            <a-col
              :span="6"
              style="text-align: right; padding-top: 5px; padding-right: 8px"
            >
              Дни приема:
            </a-col>
            <a-col :span="12">
              <a-textarea
                v-model="form.work_days[langTab]"
                :autosize="{ minRows: 2, maxRows: 6 }"
                placeholder="Введите дни приема"
              />
            </a-col>
          </a-row>

          <!-- autobiography -->
          <a-row align="top" class="input-form__group" type="flex">
            <a-col
              :span="6"
              style="text-align: right; padding-top: 5px; padding-right: 8px"
            >
              Автобиография:
            </a-col>
            <a-col :span="12">
              <a-textarea
                v-model="form.autobiography[langTab]"
                :autosize="{ minRows: 2, maxRows: 6 }"
                placeholder="Введите автобиографию"
              />
            </a-col>
          </a-row>

          <!-- commitment -->
          <a-row align="middle" class="flex-baseline input-form__group">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              Обязательство:
            </a-col>
            <a-col :span="12">
              <a-input
                v-model="form.commitment[langTab]"
                placeholder="Введите обязательство"
              />
            </a-col>
          </a-row>

          <!-- editor -->
          <a-row align="middle" class="input-form__group">
            <a-col
              :span="6"
              style="padding-top: 4px; text-align: right; padding-right: 8px"
            >
              Прочее:
            </a-col>
            <a-col :span="12">
              <editor
                :key="$route.fullPath"
                :value="form.additional_data[langTab]"
                :initial-value="form.additional_data[langTab]"
                :init="tinymce.default.props"
                :api-key="tinymce.default.token"
                @input="
                  form.additional_data[langTab] = editorChangeHandler(
                    arguments[0]
                  )
                "
              />
            </a-col>
          </a-row>

          <!-- position -->
          <a-row align="middle" class="flex-baseline input-form__group">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              Позиция:
            </a-col>
            <a-col :span="12">
              <a-input-number
                v-model.number="form.position"
                style="width: 100%"
                placeholder="Введите позицию"
              />
            </a-col>
          </a-row>

          <!-- status toggle -->
          <a-row class="input-form__group">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              Статус:
            </a-col>
            <a-switch v-model="form.status" />
          </a-row>
        </a-tab-pane>
      </a-tabs>

      <a-row class="form-buttons__action" type="flex">
        <a-col :span="6" style="text-align: right; padding-right: 8px" />
        <a-col>
          <a-button :disabled="pending" @click="$router.go(-1)">
            <a-icon type="close" />Отмена
          </a-button>

          <a-button
            :loading="pending"
            style="margin-left: 10px"
            type="primary"
            @click="submit"
          >
            <a-icon type="check" />
            {{ form.id ? "Сохранить" : "Добавить" }}
          </a-button>
        </a-col>
      </a-row>
    </a-col>
    <osg-cropper
      v-if="showForm"
      v-model="showForm"
      :ratio-width="19"
      :ratio-height="23"
      :quality="0.7"
      @onImageSelected="setImageExtention"
      @onSetImage="getImage"
    />
  </a-row>
</template>

<script>
import Editor from "@tinymce/tinymce-vue"

import { mapActions } from "vuex"

const fields = {
  full_name: {
    uz: "",
    oz: "",
    en: "",
    ru: ""
  },
  department_name: {
    uz: "",
    oz: "",
    en: "",
    ru: ""
  },
  position: 1,
  phone: "",
  lat: 41.304656,
  lng: 69.264127,
  work_days: {
    uz: "",
    oz: "",
    en: "",
    ru: ""
  },
  autobiography: {
    uz: "",
    oz: "",
    en: "",
    ru: ""
  },
  commitment: {
    uz: "",
    oz: "",
    en: "",
    ru: ""
  },
  leader_position: {
    uz: "",
    oz: "",
    en: "",
    ru: ""
  },
  status: true,
  avatar: null,
  additional_data: {
    uz: "",
    oz: "",
    en: "",
    ru: ""
  }
}

export default {
  components: {
    "osg-cropper": () => import("@/components/imageCrop/modalCrop"),
    editor: Editor
  },
  data: () => ({
    fileExtension: "jpeg",
    showForm: false,
    form: { ...fields },
    loading: false,
    pending: false,
    langTab: $langPrefix,
    avatar: null,
    leader_position: null
  }),

  computed: {
    cAvatar: {
      get() {
        if (this.avatar) {
          return URL.createObjectURL(this.avatar)
        }

        if (this.form.avatar) {
          return this.filesUrl + this.form.avatar
        }

        return require("@/assets/img/no-photo-1.png")
      }
    },
    ccAvatar: {
      get() {
        if (this.avatar) {
          return URL.createObjectURL(this.avatar)
        }

        if (this.form.avatar) {
          return this.filesUrl + this.form.avatar
        }

        return ""
      }
    },

    isContentNull() {
      return !!(
        // Object.keys(this.form.content).find(key => this.form.content[key])
        (
          !this.form.content.uz &&
          !this.form.content.oz &&
          !this.form.content.ru &&
          !this.form.content.en
        )
      )
    }
  },
  watch: {
    $route: {
      handler: "fetchData",
      immediate: true
    }
  },
  beforeDestroy() {
    this.$set(this, "form", {
      ...fields
    })
  },
  methods: {
    ...mapActions("department", ["detail"]),
    setImageExtention(e) {
      this.fileExtension = e
    },
    showModal(value) {
      this.showForm = value
    },
    handleAvatar(e) {
      if (e.target.files && e.target.files[0]) {
        this.avatar = e.target.files[0]
      }

      this.$refs.avatarInputRef.value = null
    },
    urltoFile(url, filename, mimeType) {
      return fetch(url)
        .then(function (res) {
          return res.arrayBuffer()
        })
        .then(function (buf) {
          return new File([buf], filename, { type: mimeType })
        })
    },
    getImage(variable) {
      this.urltoFile(
        variable,
        this.fileExtension,
        `image/${this.fileExtension}`
      ).then((file) => {
        this.avatar = file
      })
    },
    removeAvatar() {
      this.avatar = null
      this.form.avatar = null
    },
    async fetchData() {
      this.loading = true

      this.$set(this, "form", {
        ...fields
      })

      try {
        if (this.$route.params.id) {
          const res = await this.detail(this.$route.params.id)
          if (res) {
            this.$set(this, "form", {
              ...res,
              autobiography: (res.autobiography &&
                JSON.parse(res.autobiography)) || {
                ...this.langKeys
              },
              full_name: (res.full_name && JSON.parse(res.full_name)) || {
                ...this.langKeys
              },
              work_days: (res.work_days && JSON.parse(res.work_days)) || {
                ...this.langKeys
              },
              commitment: (res.commitment && JSON.parse(res.commitment)) || {
                ...this.langKeys
              },
              department_name: (res.department_name &&
                JSON.parse(res.department_name)) || {
                ...this.langKeys
              },
              leader_position: (res.leader_position &&
                JSON.parse(res.leader_position)) || {
                ...this.langKeys
              },
              additional_data: (res.additional_data &&
                JSON.parse(res.additional_data)) || {
                ...this.langKeys
              }
            })
          }
        }
      } catch (e) {
        console.log(e)
        this.loading = false
      }

      this.loading = false
    },
    async submit() {
      // do your submit logic here
      this.pending = true

      const f = new FormData()
      Object.keys(this.form).forEach((key) => {
        if (this.form[key]) {
          if (!isNaN(this.form[key])) {
            f.append(key, this.form[key])
          } else {
            if (
              key === "phone" ||
              key === "avatar" ||
              key === "lat" ||
              key === "lng"
            ) {
              // if(this.form[key] !== null){
              f.append(key, this.form[key])
              // }
            } else {
              f.append(key, JSON.stringify(this.form[key]))
            }
          }
        }
      })
      if (this.avatar) {
        f.append("avatar", this.avatar)
      } else if (!this.form.avatar && this.form.id) {
        this.DeleteAvatar()
      } else {
        f.append("avatar", JSON.stringify(this.form["avatar"]))
      }

      try {
        const res = await this.$store.dispatch(
          `department/${this.form.id ? "update" : "create"}ItemAction`,
          {
            id: this.form.id || null,
            data: f
          }
        )

        if (res && res.data && res.data.id) {
          this.$message.success("Успешно сохранено")
          this.$router.go(-1)
        }
      } catch (e) {
        console.log(e)
        this.pending = false
      }

      this.pending = false
    },
    async DeleteAvatar() {
      try {
        const res = await this.$store.dispatch(
          `department/DeleteAvatar`,
          this.form.id
        )

        if (res) {
          this.$message.success("Успешно удалено")
          this.pending = false
        }
      } catch (e) {
        console.log(e)
        this.pending = false
      }
    }
  }
}
</script>
