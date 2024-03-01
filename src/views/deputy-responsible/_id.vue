<template>
  <div class="fraction-create">
    <div class="fraction-create-header">
      <h2>{{ $t("Edit") }}</h2>
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
        <a-col :span="6" style="text-align: right; padding-right: 8px">
          {{ $t("Deputy") }}:
        </a-col>
        <a-col :span="12">
          <a-select v-model="form.deputy" option-label-prop="label" class="selects">
            <a-select-option v-for="item in allDeputies" :key="item.id" :value="item.id"
              :label="item.last_name + ' ' + item.first_name">
              {{ item.first_name + " " + item.last_name + " " + item.middle_name }}
            </a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <!-- <a-row align="top" class="input-form__group" type="flex">
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
      </a-row> -->

      <!-- <a-row align="top" class="input-form__group" type="flex">
        <a-col :span="6" style="text-align: right; padding-top: 5px; padding-right: 8px">
          {{ $t("EndDate") }}:
        </a-col>
        <a-col :span="12">
          <input v-model="form.end_date_discussion" :class="{
            invalid:
              $v.form.end_date_discussion.$dirty &&
              !$v.form.end_date_discussion.required
          }" type="datetime-local" />
          <p v-if="$v.form.end_date_discussion.$dirty &&
            !$v.form.end_date_discussion.required
            " class="text-danger">
            {{ $t("requiredField") }}
          </p>
        </a-col>
      </a-row> -->

      <!-- <a-row>
          <a-col :span="6" style="text-align: right; padding-right: 8px">
            Изображение:
          </a-col>
          <a-col :span="12" class="sm-mb">
            <input
              type="file"
              accept="image/jpg, image/jpeg, image/png, image/svg"
              @change="handleFile"
            />
            <a-upload name="file" :multiple="true" v-model="form.photo">
                  <a-button> <a-icon type="upload" /> Click to Upload </a-button>
                </a-upload>
            <div class="fraction-image">
              <img :src="image_url" />
            </div>
          </a-col>
        </a-row> -->
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
        {{ $t("Save") }}
      </a-button>
    </div>
  </div>
</template>
  
<script>
// import { required } from "vuelidate/lib/validators"

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
        deputy:'',
      },
      project_type_list: [],
      category_list: [],
      initiator_list: [],
      allDeputies: [],
    }
  },
  // validations: {
  //   form: {
  //     end_date_discussion: { required },
  //     start_date_discussion: { required }
  //   }
  // },
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
    if (this.$route.params && this.$route.params.id != "create") {
      this.fetchData()
      this.fetchDetail()
      this.getLeaderList()
    } else {
      this.$router.push({ name: "deputy-responsible-create" })
    }
  },
  methods: {
    openStoreModal() {
      this.modalVisible = true
    },
    async submitFraction() {
      // this.$v.$touch()
      // if (this.$v.$invalid) {
      //   this.submitStatus = "ERROR"
      //   return
      // } else {
        let form = this.form
        let f = new FormData()
        Object.keys(form).forEach((k) => {
          k != "image" && f.append(k, form[k])
          k == "image" && f.append(k, form[k], form[k].name)
        })
        //   console.log(form)
        const res = await this.$api.put(
          `/structure/orderproject/deputy-responsible/update/${this.$route.params.id}/`,
          f
        )
        this.ISVALID(res, () => {
          this.$router.push({
            name: "deputy-responsible"
          })
        })
      // }
    },
    // handleFile(e) {
    //   console.log(e.target.files[0])
    //    this.image_url = URL.createObjectURL(e.target.files[0])
    //   this.form.image = e.target.files[0]
    // },
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
    },
    async fetchDetail() {
      let id = this.$route.params && this.$route.params.id
      let res = await this.$store.dispatch("deputyResponsible/fetchDetail", id)
      // console.log(res)
      this.form = res
      this.form = {
        ...res,
        // start_date_discussion: res.start_date_discussion
        // .split("+")[0]
        // .split(".")[0],
        // end_date_discussion: res.end_date_discussion.split("+")[0].split(".")[0]
      }
    },
    async getLeaderList() {
      this.allDeputies = await this.$store.dispatch(
        "commissions/fetchCommissionDeputies"
      )
    },
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

.selects {
  width: 200px;
  margin-right: 15px;
}
</style>
  