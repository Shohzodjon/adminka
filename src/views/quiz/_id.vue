<template>
  <blank-container
    wrapper-class="custom__ant-col"
    :title="$route.meta.title"
    :loading="loading || pending"
    :remove-btn="true"
  >
    <a-row align="middle" class="flex-baseline" style="margin-bottom: 15px">
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
                placement="top"
                :cancel-text="$t('No')"
                :ok-text="$t('Yes')"
                :title="$t('DeleteYes')"
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
          {{ $t("Save") }}
        </button>
      </a-col>
    </a-row>
  </blank-container>
</template>

<script>
import { mapState, mapActions } from "vuex"

export default {
  data: () => {
    return {
      form: {
        variants: [],
        question_uz: "",
        question_ru: "",
        question_en: "",
        question_oz: "",
        question_qr: ""
      },
      langTab: $langPrefix
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
    // this.appendItem()
    // this.appendItem()
    this.fetchDetail()
    // this.getPoll().then((res) => {
    //   if (res) {
    //     // eslint-disable-next-line no-unused-vars
    //     const { id, ...props } = res
    //     this.form = props
    //     console.log(this.form)
    //   }
    // })
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
      console.log(this.form.variants)
    },
    async submitQuiz(form) {
      form.variants.forEach((_, index) => {
        delete form.variants[index].voices
        delete form.variants[index].survey
      })
      try {
        await this.$api.patch(
          "/cms/survey/" +
            (this.$route.params && this.$route.params.id) +
            "/update/",
          this.form
        )
        this.$router.push({ name: "quiz" })
      } catch (err) {
        console.log(err)
      }
    },
    removeItem(itemId) {
      if (this.form.variants.length <= 2) {
        this.$message.error("Количество вариантов не должно быть меньше двух")
        return
      }

      this.$api
        .delete("/cms/survey/variant/" + itemId + "/delete/")
        .then((res) => {
          if (res && res.status == 204) {
            const f = this.form.variants.findIndex(
              (item) => +item.id === +itemId
            )

            if (f != -1) {
              this.form.variants = [
                ...this.form.variants.slice(0, f),
                ...this.form.variants.slice(f + 1)
              ]
            }
          }
        })
    },
    async fetchDetail() {
      let { data } = await this.$api.get(
        "/cms/survey/" +
          (this.$route.params && this.$route.params.id) +
          "/update/"
      )

      this.form = data
      console.log(data, this.form)
      // this.form.variants.forEach(() => {
      //   this.appendItem()
      // })
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
