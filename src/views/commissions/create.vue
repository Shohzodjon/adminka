<template>
  <div class="fraction-create">
    <div class="fraction-create-header">
      <h2>{{ title[$i18n.locale] }}</h2>
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
          {{ $t("Chairman") }}:
        </a-col>
        <a-col :span="12">
          <a-select
            v-model="form.chairman"
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
                item.first_name + " " + item.last_name + " " + item.middle_name
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
          <span style="display: none">1</span>
        </a-col>
        <a-col :span="12">
          <draggable
            v-model="form.deputies"
            group="people"
            @start="drag = true"
            @end="drag = false"
          >
            <div
              v-for="(element, index) in form.deputies"
              :key="element.id"
              class="dragItem"
            >
              {{ index + 1 }}.
              {{ getMember(element).last_name }}
              {{ getMember(element).first_name }}
              {{ getMember(element).middle_name }}
            </div>
          </draggable>
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
            v-model="form.deputies"
            style="width: 100%"
            option-label-prop="label"
            mode="multiple"
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
                item.first_name + " " + item.last_name + " " + item.middle_name
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
          {{ $t("MenuPosition") }}
        </a-col>
        <a-col :span="12">
          <a-input-number
            v-model="form.position"
            :class="{ invalid: $v.form.position.$error }"
            :min="0"
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
          <div v-if="isContentNull" class="error-text">
            {{ $t("EnterContentOne") }}.
          </div>
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
        @click="submitFraction"
      >
        <a-icon type="check" />
        {{ $t("Add") }}
      </a-button>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable"
import { required } from "vuelidate/lib/validators"

export default {
  name: "CommissionCreate",
  components: {
    draggable,
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
        url: "",
        content_ru: "",
        content_uz: "",
        content_oz: "",
        content_en: "",
        content_qr: "",
        deputies: [],
        position: null
      },
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
      position: {
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
    isContentNull() {
      return !!(
        !this.form.content_uz &&
        !this.form.content_oz &&
        !this.form.content_ru &&
        !this.form.content_en
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
    getMember(val) {
      return this.allDeputies.find((i) => i.id == val)
    },
    translitAction() {},
    async getLeaderList() {
      this.allDeputies = await this.$store.dispatch(
        "commissions/fetchCommissionDeputies"
      )
    },
    async submitFraction() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.$message.error(this.$t("PleaseForm"))

        return
      }
      try {
        const res = await this.$api.post(
          "/structure/commission/create/",
          this.form
        )
        this.ISVALID(res, () => {
          this.$router.go(-1)
        })
      } catch (e) {
        console.log(e)
      }
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
.dragItem {
  padding: 8px 0;
  border-bottom: 1px solid #ececec;
  cursor: pointer;
  transition: all 0.25s ease-in-out;
}
.dragItem:hover {
  background: #f5f5f5;
  padding-left: 8px;
}
.dragItem:last-child {
  border-bottom: 0;
}
</style>
