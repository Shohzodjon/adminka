<template>
  <a-row>
    <spinner v-if="loading" />
    <a-col v-show="!loading" class="height100 flex-1 faq-content">
      <a-tabs
        :active-key="$route.query.tab || 'content'"
        class="main-tabs"
        type="card"
        @change="$router.push({ query: { tab: arguments[0] } })"
      >
        <a-tab-pane key="content">
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
                <a-button
                  v-if="langTab == 'uz' || langTab == 'oz'"
                  @click.stop="translitAction"
                >
                  Перевести копию на
                  {{ langTab == "uz" ? "кирилицу" : "латиницу" }}
                </a-button>
              </a-row>
            </a-col>
          </a-row>

          <!-- position -->
          <a-row align="middle" class="flex-baseline">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              Позиция:
            </a-col>
            <a-col :span="12" class="sm-mb">
              <a-input
                v-model.number="form.position"
                placeholder="Введите позицию"
                spellcheck="false"
              />
              <div v-if="!form.position" class="error-text">
                Введите позицию.
              </div>
            </a-col>
          </a-row>

          <!-- question -->
          <a-row align="middle" class="flex-baseline mb-2">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              Вопрос:
            </a-col>
            <a-col :span="12" class="sm-mb">
              <editor
                :key="$route.fullPath"
                :value="form.question[langTab]"
                :initial-value="form.question[langTab]"
                :init="tinymce.default.props"
                :api-key="tinymce.default.token"
                @input="
                  form.question[langTab] = editorChangeHandler(arguments[0])
                "
              />
            </a-col>
          </a-row>

          <!-- answer -->
          <a-row align="middle" class="flex-baseline">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              Ответ:
            </a-col>
            <a-col :span="12" class="sm-mb">
              <editor
                :key="$route.fullPath"
                :value="form.answer[langTab]"
                :initial-value="form.answer[langTab]"
                :init="tinymce.default.props"
                :api-key="tinymce.default.token"
                @input="
                  form.answer[langTab] = editorChangeHandler(arguments[0])
                "
              />
            </a-col>
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
  </a-row>
</template>

<script>
import Editor from "@tinymce/tinymce-vue"
export default {
  components: {
    editor: Editor
  },
  data: () => ({
    langTab: $langPrefix,
    tabPane: "content",
    pending: false,
    loading: false,
    form: {
      question: {
        uz: "",
        oz: "",
        ru: "",
        en: ""
      },
      answer: {
        uz: "",
        oz: "",
        ru: "",
        en: ""
      },
      position: 1
    }
  }),
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      if (!this.$route.params.id) {
        // console.log("No id on route params");
        return
      }
      this.loading = true
      try {
        const r = await this.$store.dispatch(
          "faq/detail",
          this.$route.params.id
        )

        // console.log(r);
        if (r) {
          this.$set(this, "form", {
            ...r,
            question: {
              ...this.langKeys,
              ...(r.question && JSON.parse(r.question))
            },
            answer: {
              ...this.langKeys,
              ...(r.answer && JSON.parse(r.answer))
            }
          })
        }
      } catch (error) {
        console.log(error)
        this.loading = false
      }

      this.loading = false
    },
    tabPaneChangeHandler(arg) {
      this.tabPane = arg
    },

    translitAction() {
      try {
        const from = this.langTab,
          to = this.langTab == "uz" ? "oz" : "uz",
          methodName = this.langTab == "uz" ? "toKirill" : "toLatin"

        if (this.form.question[from]) {
          this.form.question[to] = this[methodName](this.form.question[from])
        }

        if (this.form.answer[from]) {
          this.form.answer[to] = this[methodName](this.form.answer[from])
        }
      } catch (error) {
        console.log("translitAction error", error)
      }
    },

    async submit() {
      this.pending = true
      try {
        const req = {
          method: this.form.id ? "update" : "create",
          id: this.form.id || null,
          data: {
            ...this.form,
            question: this.form.question && JSON.stringify(this.form.question),
            answer: this.form.answer && JSON.stringify(this.form.answer)
          }
        }

        const r = await this.$store.dispatch(`faq/${req.method}ItemAction`, {
          id: req.id,
          data: req.data
        })

        // console.log(r);

        if (r && r.id) {
          this.$message.success("Данные сохранены")
          this.$router.push({ name: "faq" })
        }
      } catch (e) {
        console.log(e)
        this.pending = false
      }

      this.pending = false
    }
  }
}
</script>
