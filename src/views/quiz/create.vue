<template>
  <blank-container
    wrapper-class="custom__ant-col"
    :title="$route.meta.title"
    :loading="loading || pending"
    remove-btn
  >
    <a-row align="middle" class="flex-baseline" style="margin-bottom: 15px">
      <a-col :span="6" style="text-align: right; padding-right: 8px">
        {{ $t("Lang") }}
      </a-col>
      <a-col :span="12">
        <!-- lang translit tabs -->
        <a-row align="middle" class="flex-baseline flex-wrap">
          <lang-tabs v-model="langTab" class="mb-1x" />
        </a-row>
      </a-col>
    </a-row>

    <!-- title -->
    <a-row class="sm-mb">
      <a-col
        :span="6"
        style="text-align: right; padding-right: 8px; padding-top: 4px"
      >
        {{ $t("Theme") }}:
      </a-col>
      <a-col :span="12">
        <a-textarea
          v-model="form['question_' + getKey]"
          :auto-size="{ minRows: 3, maxRows: 5 }"
          :placeholder="$t('Theme')"
        />
        <div
          v-if="$v.form['question_' + getKey].$error"
          :class="{ invalid: $v.form['question_' + getKey].$error }"
        >
          {{ $t("FieldEmpty") }}
        </div>
        <!-- <div v-if="!$v.form['question_' + getKey].required" class="error-text">
          Введите заголовок на латинский узбекский.
        </div>
        <div v-if="!$v.form['question_' + getKey].required" class="error-text">
          Введите заголовок на русский.
        </div> -->
      </a-col>
    </a-row>

    <!-- switch -->

    <a-row>
      <a-col :span="6" />
      <a-col :span="12" class="sm-mb">
        {{ $t("IsActive") }}: <a-switch v-model="form.is_active" />
      </a-col>
    </a-row>

    <!-- polls -->
    <a-row>
      <a-col :span="6" />
      <a-col :span="12">
        <a-button type="primary" @click="appendItem">
          {{ $t("AddVariant") }}
        </a-button>
      </a-col>
    </a-row>

    <a-row
      align="middle"
      style="margin-top: 25px; overflow-x: hidden; height: calc(100% -150px)"
    >
      <a-col
        :span="6"
        style="
          text-align: right;
          padding-top: 4px;
          padding-right: 8px;
          position: sticky;
          top: 0;
        "
      >
        {{ $t("Variant") }}: {{ form.variants.length }} / 10
      </a-col>
      <a-col :span="12" class="sm-mb">
        <a-col
          v-for="item in form.variants"
          :key="item.id"
          style="margin-bottom: 15px"
        >
          <a-row type="flex" align="middle">
            <a-col :span="22">
              <a-textarea
                v-model="item['text_' + getKey]"
                placeholder="Введите вариант"
              />
            </a-col>
            <a-col :span="2" style="padding: 0 15px">
              <a-popconfirm
                title="Вы действительно хотите удалить?"
                placement="top"
                ok-text="Да"
                cancel-text="Нет"
                @confirm="removeItem(item.id)"
              >
                <a-icon type="delete" class="action-btns" />
              </a-popconfirm>
            </a-col>
          </a-row>
        </a-col>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="6" />
      <a-col :span="12">
        <button
          class="ant-btn ant-btn-primary"
          type="submit"
          @click="submitQuiz(form)"
        >
          {{ $t("Add") }}
        </button>
      </a-col>
    </a-row>
  </blank-container>
</template>

<script>
import { mapState, mapActions } from "vuex"
import { required } from "vuelidate/lib/validators"

export default {
  data: () => {
    return {
      form: {
        variants: [
          {
            id: Math.random().toString().slice(2),
            text_uz: "",
            text_ru: "",
            text_en: "",
            text_oz: "",
            text_qr: ""
          },
          {
            id: Math.random().toString().slice(2),
            text_uz: "",
            text_ru: "",
            text_en: "",
            text_oz: "",
            text_qr: ""
          }
        ],
        question_uz: "",
        question_ru: "",
        question_en: "",
        question_oz: "",
        question_qr: ""
      },
      langTab: $langPrefix
    }
  },
  validations: {
    form: {
      question_uz: {
        required
      },
      question_oz: {
        required
      },
      question_qr: {},
      question_en: {},
      question_ru: {
        required
      }
    }
  },
  computed: {
    ...mapState({
      loading: (state) => state.quiz.loading,
      pending: (state) => state.quiz.pending
    }),
    getKey() {
      return this.langTab
    }
  },

  mounted() {
    this.appendItem()
  },

  methods: {
    ...mapActions("quiz", ["submit", "getPoll"]),
    appendItem() {
      if (this.form.variants.length >= 10) {
        return
      }
      const RandomId = Math.random().toString().slice(2)

      this.form.variants = [
        ...this.form.variants,
        {
          id: RandomId,
          text_uz: "",
          text_ru: "",
          text_en: "",
          text_oz: "",
          text_qr: ""
        }
      ]
    },
    async submitQuiz(form) {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.$message.error(this.$t("PleaseForm"))

        return
      }
      // try {
      //   await this.submit(form)
      //   this.$message.success("Опрос сохранен успешно")
      //   console.log(this.getPoll())
      // } catch (err) {
      //   this.$message.error("Ошибка! Проверьте введенные данные")
      //   this.$sentry.captureMessage(err)
      // }

      try {
        if (this.form.variants.length >= 2) {
          const res = await this.$api.post("/cms/survey/create/", form)
          this.ISVALID(res, () => {
            this.$router.push({ name: "usefullLinks" })
          })
          this.$router.push("/quiz")
        } else {
          this.$message.error("минимальное количество вариантов 2")
          throw "минимальное количество вариантов 2 "
        }
      } catch (err) {
        console.log(err)
      }
    },
    removeItem(itemId) {
      if (this.form.variants.length <= 2) {
        this.$message.error("Количество вариантов не должно быть меньше двух")
        return
      }

      const f = this.form.variants.findIndex((item) => +item.id === +itemId)

      if (f != -1) {
        this.form.variants = [
          ...this.form.variants.slice(0, f),
          ...this.form.variants.slice(f + 1)
        ]
      }
    }
  }
}
</script>
<style scoped>
.content-fix {
  display: flex;
  flex-direction: column;
}
.content-title button.ant-btn {
  display: none;
}
</style>
