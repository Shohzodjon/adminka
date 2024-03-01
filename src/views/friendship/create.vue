<template>
  <div class="fraction-create">
    <div class="fraction-create-header">
      <!-- <h2>{{ title[$i18n.locale] }}</h2> -->
    </div>
    <!-- lang tabs -->
    <a-row align="middle" class="flex-baseline" style="margin-bottom: 15px">
      <a-col :span="6" style="text-align: right; padding-right: 8px">
        {{ $t("Lang") }}:
      </a-col>
      <a-col :span="12">
        <!-- lang translit tabs -->
        <a-row align="middle" class="flex-baseline flex-wrap">
          <lang-tabs v-model="langTab" class="mb-1x" />
          <!-- <a-button
            v-if="langTab == 'uz' || langTab == 'oz'"
            @click.stop="translitAction"
          >
             <span v-if="$i18n.locale == 'ru'"
                    >{{ $t("TranslateCopyTo") }}
                    {{ langTab == "uz" ? $t("Cyrillic") : $t("Latin") }}</span
                  >
                  <span v-else>
                    {{ langTab == "uz" ? $t("Cyrillic") : $t("Latin")
                    }}{{ $t("TranslateCopyTo") }}</span
                  >
          </a-button> -->
        </a-row>
      </a-col>
    </a-row>
    <div class="fraction-create-body">
      <a-row align="middle" class="flex-baseline input-form__group">
        <a-col :span="6" style="text-align: right; padding-right: 8px">
          {{ $t("TagsColTitle") }}:
        </a-col>
        <a-col :span="12">
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
          {{ $t("Deputy") }}:
        </a-col>
        <a-col :span="12">
          <a-select
            v-model="form.leader"
            :class="{ invalid: $v.form.leader.$error }"
            style="width: 100%"
            option-label-prop="label"
            show-search
            :filter-option="filterOption"
          >
            <a-select-option
              v-for="item in allDeputies"
              :key="item.id"
              :value="item.id"
              :label="item.last_name + ' ' + item.first_name"
            >
              {{
                item.last_name + " " + item.first_name + " " + item.middle_name
              }}
            </a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <a-row align="top" class="input-form__group" type="flex">
        <a-col
          :span="6"
          style="text-align: right; padding-top: 5px; padding-right: 8px"
        >
          {{ $t("File") }}:
        </a-col>
        <a-col :span="12">
          <input
            type="file"
            accept="image/jpg, image/jpeg, image/png, image/svg"
            @change="handleFile"
          />
        </a-col>
      </a-row>

      <!-- editor -->
      <a-row align="middle" style="margin-top: 25px" type="flex">
        <a-col :span="6" style="padding: 4px 8px 15px; text-align: right">
          {{ $t("Content") }}:
        </a-col>
        <a-col :key="$route.query.tab" :span="23" style="margin: 0 auto">
          <!-- :key="langtab" -->
          <editor
            :value="form['content_' + getKey]"
            :initial-value="form['content_' + getKey]"
            :init="{
              ...tinymce.default.props,
              setup: (editor) => {
                editor.ui.registry.addButton('spoiler-btn', {
                  icon: 'comment-add',
                  tooltip: 'Спойлер',
                  onAction: () => {
                    spoiler.modalVisibility = editor
                    spoilerHandler()
                  }
                })
                editor.ui.registry.addButton('storage-btn', {
                  icon: 'non-breaking',
                  tooltip: 'Хранилище изображений',
                  onAction: () => {
                    openStoreModal()
                    editorInstance = editor
                  }
                })
              }
            }"
            @input="
              form['content_' + getKey] = editorChangeHandler(arguments[0])
            "
          />
        </a-col>
      </a-row>

      <!-- <a-row>
        <a-col :span="12">
          <div class="form_field">
            <label>Title</label>
            <a-input
              v-model="form['title_' + getKey]"
              :placeholder="$t('InputText')"
            />
          </div>
          <div class="form_field">
            <label>Leader</label>
            <a-select
              v-model="form.deputies"
              width="400px"
              option-label-prop="label"
              mode="multiple"
            >
              <a-select-option
                v-for="item in allDeputies"
                :key="item.id"
                :value="item.id"
                :label="item.last_name + ' ' + item.first_name"
              >
                {{
                  item.first_name +
                  " " +
                  item.last_name +
                  " " +
                  item.middle_name
                }}
              </a-select-option>
            </a-select>
          </div>
        </a-col>
      </a-row> -->
    </div>
    <div class="fraction-create-footer">
      <a-button
        style="margin-left: 10px"
        type="primary"
        :disabled="isFilled"
        @click="onSubmit"
      >
        <a-icon type="check" />
        {{ $t("Add") }}
      </a-button>
    </div>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators"

export default {
  name: "CommissionCreate",
  components: {
    editor: () => import("@tinymce/tinymce-vue")
  },
  data() {
    return {
      langTab: $langPrefix,
      form: {
        title_uz: "",
        title_en: "",
        title_qr: "",
        title_oz: "",
        title_ru: "",
        content_uz: "",
        content_en: "",
        content_qr: "",
        content_oz: "",
        content_ru: "",
        leader: null,
        files: null
      },
      file_url: "",
      allDeputies: [],
      title: {
        uz: "Komissiyalar qo'shing",
        oz: "Комиссиялар қўшинг",
        ru: "Добавить комиссии",
        en: "Add commissions"
      }
    }
  },
  validations: {
    form: {
      leader: {
        required
      }
    }
  },
  computed: {
    isFilled() {
      return (
        this.form.title_uz == "" &&
        this.form.title_oz == "" &&
        this.form.url == ""
      )
    },
    getKey() {
      return this.langTab
    }
  },
  created() {
    this.getLeaderList()
  },
  methods: {
    translitAction() {},
    async getLeaderList() {
      this.allDeputies = await this.$store.dispatch(
        "friendship/fetchDeputyList"
      )
    },
    async onSubmit() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.$message.error(this.$t("PleaseForm"))

        return
      }
      try {
        let form = this.form
        let f = new FormData()
        Object.keys(form).forEach((k) => {
          k != "files" && f.append(k, form[k])
          k == "files" && form[k] && f.append(k, form[k], form[k].name)
        })
        const res = await this.$api.post(
          "/structure/deputyfriendship/create/",
          f
        )
        this.ISVALID(res, () => {
          this.$router.go(-1)
        })
      } catch (e) {
        console.log(e)
      }
    },
    handleFile(e) {
      console.log(e)
      this.file_url = URL.createObjectURL(e.target.files[0])
      this.form.files = e.target.files[0]
    }
  }
}
</script>

<style>
.fraction-create {
  padding: 20px 0;
}
.form_field {
  margin: 10px 0;
  height: 70px;
  padding: 0 30px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.form_field > .fraction_image {
  width: 70px;
  height: 70px;
  border: 1px solid grey;
  border-radius: 40px;
  overflow: hidden;
  display: inline;
  margin-right: 30px;
}
.form_field > .fraction_image > img {
  width: 100%;
  height: 100%;
}
.form_field > label {
  margin-bottom: 7px;
  display: block;
  width: 100%;
}
.form_field > div {
  width: 100%;
}
.form_field_btn {
  margin: 10px 0;
  height: 70px;
  padding: 0 30px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.fraction-create-body {
  margin-bottom: 20px;
}
.fraction-create-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
