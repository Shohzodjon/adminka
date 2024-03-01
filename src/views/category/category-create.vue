<template>
  <a-row>
    <spinner v-if="loading" />
    <a-col v-else>
      <a-tabs class="main-tabs" type="card">
        <a-tab-pane key="content">
          <span slot="tab"> <a-icon type="project" />Содержимое </span>
          <a-form class="antd-form">
            <a-row>
              <a-col :span="4" style="text-align: right; padding-right: 8px">
                Язык:
              </a-col>

              <a-col :span="18" class="sm-mb">
                <lang-tabs v-model="langTab" />
              </a-col>
            </a-row>

            <!-- title -->
            <a-row align="middle" :class="{ 'form-group--error': titlesCheck }">
              <a-col
                :span="4"
                style="text-align: right; padding-top: 4px; padding-right: 8px"
              >
                Заголовок:
              </a-col>
              <a-col :span="20" class="sm-mb">
                <a-textarea
                  v-model.trim="$v.form.title[langTab].$model"
                  spellcheck="false"
                  :placeholder="$t('EnterTitle')"
                  @input="slugCompute($event, langTab, 'post', form.title)"
                />
                <div v-if="!$v.form.title.oz.required" class="error-text">
                  Введите заголовок на кирилский узбекский.
                </div>
                <div v-if="!$v.form.title.uz.required" class="error-text">
                  Введите заголовок на латинский узбекский.
                </div>
                <div v-if="!$v.form.title.ru.required" class="error-text">
                  Введите заголовок на русский.
                </div>
              </a-col>
            </a-row>

            <!-- slug -->
            <a-row
              align="middle"
              class="flex-baseline"
              :class="{ 'form-group--error': $v.form.slug.$error }"
            >
              <a-col :span="4" style="text-align: right; padding-right: 8px">
                ЧПУ:
              </a-col>
              <a-col :span="20" class="sm-mb">
                <a-input
                  v-model.trim="$v.form.slug.$model"
                  :spell-check="false"
                  placeholder="Введите человеку понятный урл"
                  @input="slugCheck({ type: 'post', slug: form.slug })"
                />
                <div v-if="!$v.form.slug.required" class="error-text">
                  Введите ЧПУ.
                </div>
              </a-col>
            </a-row>

            <!-- position -->
            <a-row align="middle" class="flex-baseline">
              <a-col :span="4" style="text-align: right; padding-right: 8px">
                Позиция:
              </a-col>
              <a-col :span="20" class="sm-mb">
                <a-input
                  v-model.number="form.position"
                  spellcheck="false"
                  placeholder="Введите позицию"
                />
                <div v-if="!form.position" class="error-text">
                  Введите позицию.
                </div>
              </a-col>
            </a-row>

            <a-row align="middle" class="flex-baseline">
              <a-col :span="4" style="text-align: right; padding-right: 8px">
                Статус:
              </a-col>
              <a-col :span="20" class="sm-mb">
                <a-switch v-model="form.status" />
              </a-col>
            </a-row>

            <a-row align="middle" class="flex-baseline">
              <a-col :span="4" style="text-align: right; padding-right: 8px">
                Выводить на главной:
              </a-col>
              <a-col :span="20" class="sm-mb">
                <a-switch v-model="form.is_main" />
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="4" />
              <a-col>
                <a-row>
                  <a-button
                    :disabled="pending"
                    style="margin-right: 10px"
                    @click="$router.go(-1)"
                  >
                    <a-icon type="close" />Отмена
                  </a-button>
                  <a-button
                    :loading="pending"
                    type="primary"
                    @click="submitForm"
                  >
                    <a-icon type="check" />
                    {{ form.id ? "Сохранить" : "Создать" }}
                  </a-button>
                </a-row>
              </a-col>
            </a-row>
          </a-form>
        </a-tab-pane>

        <span v-if="form.id" slot="tabBarExtraContent">
          <a-popconfirm
            placement="bottomRight"
            title="Вы действительно хотите удалить?"
            @confirm="removeItem"
          >
            <a-button v-if="form.id" :disabled="pending">
              <a-icon type="delete" />Удалить
            </a-button>
          </a-popconfirm>
        </span>
      </a-tabs>
    </a-col>
  </a-row>
</template>

<script>
import { required } from "vuelidate/lib/validators"
export default {
  data: () => ({
    loading: false,
    pending: false,
    form: {
      title: {
        oz: "",
        uz: "",
        ru: "",
        en: ""
      },
      slug: "",
      status: true,
      position: 1,
      is_main: false
    },
    errors: {
      slug: true
    },
    // eslint-disable-next-line no-undef
    langTab: $langPrefix
  }),

  computed: {
    titlesCheck() {
      return !!(
        this.$v.form.title.oz.$error ||
        this.$v.form.title.uz.$error ||
        this.$v.form.title.ru.$error
      )
    }
  },
  watch: {
    "$route.params": {
      handler: "fetchData",
      immediate: true
    }
  },
  mounted() {
    console.log("sdsds")
    this.$on("update:slug", this.onSlugChange)
  },

  validations: {
    form: {
      title: {
        uz: {
          required
        },
        oz: {
          required
        },
        ru: {
          required
        },
        en: {}
      },
      slug: {
        required
      }
    }
  },

  methods: {
    onSlugChange(e) {
      // Проверка на пустоту всех языков кроме выбранного
      if (
        Object.keys(this.form.title)
          .filter((item) => item != this.langTab)
          .some((item) => this.form.title[item])
      )
        return false

      const text = (e.target.value || "")
        .replace(/( )/gi, "-")
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\\-]/gi, "")

      this.slugCheck({ table: "post", slug: text })

      this.form.slug = text
    },
    async removeItem() {
      try {
        const r = await this.$store.dispatch(
          "category/removeItemAction",
          this.form.id
        )

        if (r) {
          this.$router.go(-1)
        }
      } catch (e) {
        console.error(e)
      }
    },
    async fetchData() {
      if (!this.$route.params.cat_id) {
        return
      }

      this.loading = true

      try {
        // eslint-disable-next-line no-unused-vars
        const { created, updated, ...form } = await this.$store.dispatch(
          "category/detail",
          this.$route.params.cat_id
        )

        if (form) {
          this.form = {
            ...form,
            title: {
              ...this.langKeys,
              ...(form.title && JSON.parse(form.title))
            }
          }
        }
      } catch (error) {
        console.error(error)
      }

      this.loading = false
    },
    validate() {
      return !(!this.form.title.ru || !this.form.slug)
    },
    async submitForm() {
      // console.log("submit!");
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.$message.error(`Форма не валидна`)
        return
      }
      // do your submit logic here
      this.pending = true

      try {
        let data = {
          ...this.form,
          title: JSON.stringify(this.form.title)
        }

        // eslint-disable-next-line no-unused-vars
        const { news, ...props } = data

        const res = await this.$store.dispatch(
          `category/${this.form.id ? "update" : "create"}ItemAction`,
          this.form.id ? { id: this.form.id, data: props } : props
        )

        if (!res) {
          this.$message.success(
            `Категория успешно ${this.form.id ? "сохранена" : "создана"}`
          )

          if (!this.form.id) {
            this.$router.push({ name: "category" })
          }
        }
      } catch (error) {
        console.error(error)
        this.$message.error(error)
      }

      this.pending = false
    }
  }
}
</script>

<style></style>
