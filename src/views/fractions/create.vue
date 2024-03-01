<template>
  <div class="fraction-create">
    <div class="fraction-create-header">
      <h2>{{ $t("AddFraction") }}</h2>
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
          {{ $t("FractionTitle") }}:
        </a-col>
        <a-col :span="12">
          <a-input
            v-model="form['title_' + getKey]"
            :placeholder="$t('FractionTitlePlac')"
          />
          <small
            v-if="$v.form.title_en.$dirty && !$v.form.title_en.required"
            class="text-danger"
            >{{ $t("requiredField") }}</small
          >
          <small
            v-else-if="$v.form.title_uz.$dirty && !$v.form.title_uz.required"
            class="text-danger"
            >{{ $t("requiredField") }}</small
          >
          <small
            v-else-if="$v.form.title_ru.$dirty && !$v.form.title_ru.required"
            class="text-danger"
            >{{ $t("requiredField") }}</small
          >
          <small
            v-else-if="$v.form.title_oz.$dirty && !$v.form.title_oz.required"
            class="text-danger"
            >{{ $t("requiredField") }}</small
          >
        </a-col>
      </a-row>
      <a-row align="top" class="input-form__group" type="flex">
        <a-col
          :span="6"
          style="text-align: right; padding-top: 5px; padding-right: 8px"
        >
          {{ $t("Url") }}:
        </a-col>
        <a-col :span="12">
          <a-input v-model="form.url" :placeholder="$t('InputText')" />
          <small
            v-if="$v.form.url.$dirty && !$v.form.url.required"
            class="text-danger"
          >
            {{ $t("requiredField") }}
          </small>
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
          <!-- <a-upload name="file" :multiple="true" v-model="form.photo">
                <a-button> <a-icon type="upload" /> Click to Upload </a-button>
              </a-upload> -->
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
          <a-input-number v-model="form.position" :min="0" />
          <p
            v-if="$v.form.position.$dirty && !$v.form.position.required"
            class="text-danger"
          >
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
    </div>
    <div class="fraction-create-footer">
      <a-button
        style="margin-left: 10px"
        type="primary"
        @click="submitFraction"
      >
        <a-icon type="check" />
        {{ $t("Add") }}
      </a-button>
    </div>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators"

// const classObj = {
//   title: {
//     ru: "",
//     uz: "",
//     qr: "",
//     oz: "",
//     en: ""
//   },
//   url: "",
//   image: null
// }
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
        url: "",
        image: null,
        content_ru: "",
        content_uz: "",
        content_oz: "",
        content_en: "",
        content_qr: "",
        position: null
      },
      image_url: ""
    }
  },
  validations: {
    form: {
      url: { required },
      title_uz: { required },
      title_ru: { required },
      title_en: { required },
      title_oz: { required },
      position: { required }
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
  methods: {
    openStoreModal() {
      this.modalVisible = true
    },
    async submitFraction() {
      let form = this.form
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.submitStatus = "ERROR"
        return
      } else {
        let f = new FormData()
        Object.keys(form).forEach((k) => {
          k != "image" && f.append(k, form[k])
          k == "image" && form[k] && f.append(k, form[k], form[k].name)
        })
        // delete form.title
        // form.title = form.title_uz
        console.log(form)
        const res = await this.$api.post("/structure/faction/create/", f)
        this.ISVALID(res, () => {
          this.$router.push({
            name: "fractions"
          })
        })
      }
      // Object.keys(form).forEach((k) => {
      //   k == "title" &&
      //     Object.keys(form[k]).forEach((k2) => {
      //       form[k + "_" + k2] = form[k][k2]
      //     })
      // })
      // delete form.title
    },
    handleFile(e) {
      console.log(e.target.files[0])
      this.image_url = URL.createObjectURL(e.target.files[0])
      this.form.image = e.target.files[0]
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

input[type="file"] {
  margin-bottom: 15px;
}
.fraction-image {
  overflow: hidden;
}
.fraction-image > img {
  height: 200px;
}
</style>
