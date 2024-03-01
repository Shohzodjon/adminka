<template>
  <div class="fraction-create">
    <div class="fraction-create-header">
      <h2>{{ $t("Add") }}</h2>
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
        </a-row>
      </a-col>
    </a-row>
    <div class="fraction-create-body">
      <a-row align="middle" class="flex-baseline input-form__group">
        <a-col :span="6" style="text-align: right; padding-right: 8px">
          {{ $t("TagsColTitle") }}:
        </a-col>
        <a-col :span="12">
          <a-input v-model="form['title_' + getKey]" :placeholder="$t('EnterTheTitle')" />
        </a-col>
      </a-row>
      <a-row align="top" class="input-form__group" type="flex">
        <a-col :span="6" style="text-align: right; padding-top: 5px; padding-right: 8px">
          {{ $t("StartDate") }}:
        </a-col>
        <a-col :span="12">
          <input v-model="form.start_date_discussion" :class="{
            invalid:
              $v.form.start_date_discussion.$dirty &&
              !$v.form.start_date_discussion.required
          }" type="datetime-local" />
          <p v-if="$v.form.start_date_discussion.$dirty &&
            !$v.form.start_date_discussion.required
            " class="text-danger">
            {{ $t("requiredField") }}
          </p>
        </a-col>
      </a-row>
      <!-- editor -->
      <a-row align="middle" style="margin-top: 25px" type="flex">
        <a-col :span="6" style="padding: 4px 8px 15px; text-align: right">
          {{ $t("Content") }}:
        </a-col>
        <a-col :key="$route.query.tab" :span="23" style="margin: 0 auto">
          <!-- :key="langtab" -->
          <editor :value="form['content_' + getKey]" :initial-value="form['content_' + getKey]" :init="{
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
          }" @input="
  form['content_' + getKey] = editorChangeHandler(arguments[0])
  " />
          <div v-if="isContentNull" class="error-text">
            {{ $t("EnterContentOne") }}.
          </div>
        </a-col>
      </a-row>
    </div>
    <div class="fraction-create-footer">
      <a-button style="margin-left: 10px" type="primary" :disabled="isFilled" @click="submitFraction">
        <a-icon type="check" />
        {{ $t("Add") }}
      </a-button>
    </div>
  </div>
</template>
  
<script>
import { required } from "vuelidate/lib/validators"

export default {
  name: "FractionCreate",
  components: {
    editor: () => import("@tinymce/tinymce-vue")
  },
  data() {
    return {
      langTab: "ru",
      form: {
        title_ru: "",
        title_uz: "",
        title_oz: "",
        title_en: "",
        title_qr: "",
        content_ru: "",
        content_uz: "",
        content_oz: "",
        content_en: "",
        content_qr: "",
        initiator: null,
        project_type: null,
        category: null,
        start_date_discussion: "",
      },
      project_type_list: [],
      category_list: [],
      initiator_list: []
    }
  },
  validations: {
    form: {
      start_date_discussion: { required }
    }
  },
  computed: {
    getKey() {
      return this.langTab
    },
    isFilled() {
      return (
        this.form.title_uz == "" &&
        this.form.title_oz == "" &&
        this.form_url == ""
      )
    },
    isContentNull() {
      return !!(
        !this.form.content_uz &&
        !this.form.content_oz &&
        !this.form.content_ru &&
        !this.form.content_en
      )
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    openStoreModal() {
      this.modalVisible = true
    },
    async submitFraction() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.submitStatus = "ERROR"
        return
      } else {
        let form = this.form
        let f = new FormData()
        Object.keys(form).forEach((k) => {
          k != "image" && f.append(k, form[k])
          k == "image" && f.append(k, form[k], form[k].name)
        })
        //   console.log(form)
        const res = await this.$api.post("/structure/orderproject/create/", f)
        this.ISVALID(res, () => {
          this.$router.push({
            name: "discussion-law"
          })
        })
      }
    },
    async fetchData() {
      const initiators = await this.$store.dispatch(
        "orderProjectInitiator/fetchList"
      )
      const categories = await this.$store.dispatch(
        "orderProjectCategory/fetchList"
      )
      const project_types = await this.$store.dispatch(
        "orderProjectType/fetchList"
      )
      // console.log(initiators, project_types, categories)
      this.category_list = categories
      this.initiator_list = initiators
      this.project_type_list = project_types
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

.form_field>.fraction_image {
  width: 70px;
  height: 70px;
  border: 1px solid grey;
  border-radius: 40px;
  overflow: hidden;
  display: inline;
  margin-right: 30px;
}

.form_field>.fraction_image>img {
  width: 100%;
  height: 100%;
}

.form_field>label {
  margin-bottom: 7px;
  display: block;
  width: 100%;
}

.form_field>div {
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

input[type="file"] {
  margin-bottom: 15px;
}

.fraction-image {
  overflow: hidden;
}

.fraction-image>img {
  height: 200px;
}

input[type="datetime-local"] {
  border-radius: 2px;
  padding: 4px;
  border: 1px solid #c7c7c7;
}
</style>
  