<template>
  <div>
    <spinner v-if="loading" />
    <a-row>
      <a-col class="height100 flex-1">
        <a-tabs
          :active-key="$route.query.tab || 'content'"
          class="main-tabs contacts-form-content"
          type="card"
          @change="
            $router.push({
              query: { tab: arguments[0], page: $route.query.page }
            })
          "
        >
          <a-tab-pane key="content">
            <span slot="tab">
              <a-icon type="project" />
              {{ $t("TableContent") }}
              <!-- {{ $route.meta.title[$i18n.locale] }} -->
            </span>
            <!-- lang tabs -->
            <a-row
              align="middle"
              class="flex-baseline"
              style="margin-bottom: 15px"
            >
              <a-col :span="6" style="text-align: right; padding-right: 8px">
                {{ $t("Lang") }}:
              </a-col>
              <a-col :span="12">
                <!-- lang translit tabs -->
                <a-row align="middle" class="flex-baseline flex-wrap">
                  <lang-tabs v-model="langTab" class="mb-1x" />
                  <a-button
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
                  </a-button>
                </a-row>
              </a-col>
            </a-row>

            <!-- title -->
            <a-row
              :class="{ 'form-group--error': emptyTitle }"
              align="middle"
              class="flex-baseline"
            >
              <a-col :span="6" style="text-align: right; padding-right: 8px">
                {{ $t("TagsColTitle") }}:
              </a-col>
              <a-col :span="12" class="sm-mb">
                <a-input
                  v-model="form.title[langTab]"
                  :placeholder="$t('TagsColTitle')"
                />
              </a-col>
            </a-row>

            <!-- source -->
            <a-row align="middle" class="flex-baseline">
              <a-col :span="6" style="text-align: right; padding-right: 8px">
                {{ $t("Source") }}:
              </a-col>
              <a-col :span="12" class="sm-mb">
                <a-input
                  v-model="form.source[langTab]"
                  :placeholder="$t('SourcePlac')"
                />
              </a-col>
            </a-row>

            <!-- deputy -->
            <a-row align="middle" class="flex-baseline">
              <a-col :span="6" style="text-align: right; padding-right: 8px">
                {{ $t("Deputy") }}:
              </a-col>
              <a-col :span="12" class="sm-mb">
                <a-select
                  v-model="form.deputy"
                  show-search
                  style="width: 100%"
                  option-filter-prop="children"
                  :filter-option="filterOption"
                >
                  <a-select-option
                    v-for="deputy in deputyList"
                    :key="deputy.id"
                    :value="deputy.id"
                  >
                    {{
                      deputy.first_name +
                      " " +
                      deputy.last_name +
                      " " +
                      deputy.middle_name
                    }}
                  </a-select-option>
                </a-select>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="6" style="text-align: right; padding-right: 8px">
                {{ $t("File") }}:
              </a-col>
              <a-col :span="12" class="sm-mb">
                <input type="file" @change="handleFile" />
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="6" style="text-align: right; padding-right: 8px">
                {{ $t("File") }}
              </a-col>
              <a-col :span="12" class="sm-mb">
                <a :href="form.file" download>
                  {{ (form.file && form.file.name) || form.file }}
                </a>
              </a-col>
            </a-row>

            <!-- published time -->
            <a-row>
              <a-col
                :span="6"
                style="text-align: right; padding-right: 8px; padding-top: 6px"
              >
                Дата публикации:
              </a-col>
              <a-col :span="12">
                <!-- <a-date-picker
                  v-model="form.pub_date"
                  :allow-clear="false"
                  :format="'YYYY-MM-DD'"
                /> -->
                <input v-model="form.pub_date" type="date" />
              </a-col>
            </a-row>
            <!-- store image modal -->
            <a-modal
              :visible="modalVisible"
              title="Хранилище изображений"
              :closable="false"
              style="max-height: 500px; max-width: 900px"
              width="900px"
            >
              <imageStorage
                @pasteHandler="editorInstance.insertContent(arguments[0])"
              />
              <template slot="footer">
                <a-button key="back" @click="modalVisible = false">
                  {{ $t("Close") }}
                </a-button>
              </template>
            </a-modal>
            <!-- editor -->
            <a-row :key="$route.query.tab" style="margin-top: 25px" type="flex">
              <a-col :span="6" style="text-align: right; padding-right: 8px">
                {{ $t("Content") }}:
              </a-col>
              <a-col :key="langTab" :span="23">
                <a-col v-if="langTab == 'oz'" :span="23">
                  <!-- :key="langtab" -->
                  <editor
                    :value="form.content.oz"
                    :initial-value="form.content.oz"
                    :init="{
                      ...tinymce.default.props,
                      menubar:
                        'file edit view insert format tools table tc help',
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
                    @input="form.content.oz = editorChangeHandler(arguments[0])"
                  />
                </a-col>
                <a-col v-if="langTab == 'uz'" :span="23">
                  <!-- :key="langtab" -->
                  <editor
                    :value="form.content.uz"
                    :initial-value="form.content.uz"
                    :init="{
                      ...tinymce.default.props,
                      menubar:
                        'file edit view insert format tools table tc help',
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
                    @input="form.content.uz = editorChangeHandler(arguments[0])"
                  />
                </a-col>
                <a-col v-if="langTab == 'qr'" :span="23">
                  <!-- :key="langtab" -->
                  <editor
                    :value="form.content.qr"
                    :initial-value="form.content.qr"
                    :init="{
                      ...tinymce.default.props,
                      menubar:
                        'file edit view insert format tools table tc help',
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
                    @input="form.content.qr = editorChangeHandler(arguments[0])"
                  />
                </a-col>
                <a-col v-if="langTab == 'ru'" :span="23">
                  <!-- :key="langtab" -->
                  <editor
                    :value="form.content.ru"
                    :initial-value="form.content.ru"
                    :init="{
                      ...tinymce.default.props,
                      menubar:
                        'file edit view insert format tools table tc help',
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
                    @input="form.content.ru = editorChangeHandler(arguments[0])"
                  />
                </a-col>
                <a-col v-if="langTab == 'en'" :span="23">
                  <!-- :key="langtab" -->
                  <editor
                    :value="form.content.en"
                    :initial-value="form.content.en"
                    :init="{
                      ...tinymce.default.props,
                      menubar:
                        'file edit view insert format tools table tc help',
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
                    @input="form.content.en = editorChangeHandler(arguments[0])"
                  />
                </a-col>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="photo">
            <span slot="tab">
              <a-icon type="picture" />{{ $t("TablePhoto") }}
            </span>

            <!-- upload photo -->
            <a-row align="middle">
              <a-col
                :span="6"
                style="padding-top: 4px; text-align: right; padding-right: 8px"
              >
                {{ $t("TablePhotos") }}
              </a-col>
              <a-col :span="12">
                <image-upload
                  :list="photoList"
                  accept="image/jpeg, image/png, image/jpg"
                  method-name="common"
                  :with-cropper="false"
                  :not-active="true"
                  @change="fileList = arguments[0]"
                  @drag-update="updateFilesPosition"
                />
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>

        <a-row class="form-buttons__action" type="flex">
          <a-col :span="6" style="text-align: right; padding-right: 8px" />
          <a-col>
            <a-button :disabled="pending" @click="$router.go(-1)">
              <a-icon type="close" />{{ $t("Cancel") }}
            </a-button>

            <a-button
              :loading="pending"
              style="margin-left: 10px"
              type="primary"
              @click="submit"
            >
              <a-icon type="check" />{{ $t("Save") }}
            </a-button>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script>
// import { required } from "vuelidate/lib/validators"

export default {
  name: "DeputyArticleCreate",
  components: {
    editor: () => import("@tinymce/tinymce-vue"),
    "image-upload": () => import("@/components/utils/image-upload"),
    imageStorage: () => import("@/components/imageStorage/imageStorage")
  },
  data() {
    return {
      modalVisible: false,
      emptyTitle: false,
      emptyDeputy: false,
      langTab: $langPrefix,
      deputyList: [],
      fileList: [],
      loading: false,
      main_image: null,
      pending: false,
      submitStatus: "Ok",
      newImage: null,
      form: {
        deputy: null,
        file: null,
        photo: [],
        title: {
          uz: "",
          ru: "",
          oz: "",
          en: "",
          qr: ""
        },
        content: {
          uz: "",
          ru: "",
          oz: "",
          en: "",
          qr: ""
        },
        source: {
          uz: "",
          ru: "",
          oz: "",
          en: "",
          qr: ""
        },
        pub_date: null
      }
    }
  },
  // validations: {
  //   form: {
  //     deputy: { required },
  //     title: {
  //       uz: { required },
  //       oz: { required }
  //     }
  //   }
  // },
  computed: {
    getKey() {
      return this.langTab
    },
    photoList() {
      let arr = []
      arr.push({ photo: this.form.photo, id: 1 })
      return arr
    }
  },
  created() {
    this.form.pub_date = this.moment.utc(
      new Date(),
      "YYYY-MM-DDThh:mm[:ss[.uuuuuu]][+HH:MM|-HH:MM|Z]"
    )
  },
  mounted() {
    this.fetchData()
    this.fetchDetail()
  },
  methods: {
    openStoreModal() {
      this.modalVisible = true
    },
    check2Null(arg) {
      return Object.values(arg).every((item) => !item)
    },
    async fetchData() {
      let res = await this.$api.get("/structure/deputy/list/")
      this.deputyList = res && res.data
    },

    selectedImage() {
      return 1
    },
    handleFile(e) {
      this.form.file = e.target.files[0]
    },
    handleImages(arg) {
      // this.form.photo = arg[0]
      console.log(arg[0].fileTarget)
    },

    async submit() {
      if (this.check2Null(this.form.title)) {
        this.emptyTitle = true
        this.$message.error("Введите заголовок на одном из языков")
        return
      }
      if (!this.form.deputy) {
        this.emptyDeputy = true
        this.$message.error("Введите депутат")
        return
      }
      // this.$v.$touch()
      // if (this.$v.$invalid) {
      // this.submitStatus = "ERROR"
      // return
      // } else {
      let f = new FormData()
      let form = { ...this.form }
      form.title_en = form.title.en
      form.title_qr = form.title.qr
      form.title_oz = form.title.oz
      form.title_uz = form.title.uz
      form.title_ru = form.title.ru
      delete form.title
      form.source_en = form.source.en
      form.source_qr = form.source.qr
      form.source_oz = form.source.oz
      form.source_uz = form.source.uz
      form.source_ru = form.source.ru
      delete form.source
      form.content_en = form.content.en
      form.content_qr = form.content.qr
      form.content_oz = form.content.oz
      form.content_uz = form.content.uz
      form.content_ru = form.content.ru
      delete form.content
      Object.keys(form).forEach((k) => {
        k != "file" && k != "photo" && f.append(k, form[k])
        k == "file" &&
          form[k] &&
          form[k].name &&
          f.append(k, form[k], form[k].name)
      })
      this.fileList.forEach((k) => {
        f.append("photo", k.fileTarget, k.fileTarget.name)
      })
      let res = await this.$api.patch(
        `/structure/deputy/article/${
          this.$route.params && this.$route.params.id
        }/update/`,
        f
      )
      this.ISVALID(res, () => {
        this.$router.push({ name: "usefullLinks" })
        this.$router.go(-1)
      })
      // }
    },
    translitAction() {
      try {
        const from = this.langTab,
          to = this.langTab == "uz" ? "oz" : "uz",
          methodName = this.langTab == "uz" ? "toKirill" : "toLatin"

        if (this.form.title[from]) {
          this.form.title[to] = this[methodName](this.form.title[from])
        }

        if (this.form.content[from]) {
          this.form.content[to] = this[methodName](this.form.content[from])
        }

        // turn on translit target language_support
        // this.$set(this.form.language_support, to, true);
        this.form.language_support[to] = true
      } catch (error) {
        this.$sentry.captureMessage(error)
      }
    },
    async fetchDetail() {
      let res = await this.$api.get(
        `/structure/deputy/article/${
          this.$route.params && this.$route.params.id
        }/update`
      )
      let form = res && res.data
      form = {
        ...form,
        title: {
          ru: form.title_ru,
          uz: form.title_uz,
          en: form.title_en,
          qr: form.title_qr,
          oz: form.title_oz
        },
        source: {
          ru: form.source_ru,
          uz: form.source_uz,
          en: form.source_en,
          qr: form.source_qr,
          oz: form.source_oz
        },
        content: {
          ru: form.content_ru,
          uz: form.content_uz,
          en: form.content_en,
          qr: form.content_qr,
          oz: form.content_oz
        }
      }
      delete form.title_en
      delete form.title_qr
      delete form.title_oz
      delete form.title_uz
      delete form.title_ru
      delete form.source_en
      delete form.source_qr
      delete form.source_oz
      delete form.source_uz
      delete form.source_ru
      delete form.content_en
      delete form.content_qr
      delete form.content_oz
      delete form.content_uz
      delete form.content_ru
      this.form = form
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    updateFilesPosition() {
      let promises = []
      let otherImages = new FormData()
      const mainImage = this.fileList.find(
        (item) => item.id && item.uzid === this.main_image
      )

      if (mainImage) {
        otherImages.append("is_main", true)
        otherImages.append("file_type", 0)
        otherImages.append("position", 0)
        otherImages.append("file", mainImage.file || mainImage.fileTarget)
        promises.push(
          this.$api.post("/news/file/update/" + mainImage.id, otherImages)
        )
      }

      // console.log(+!!mainImage);

      // debugger;

      Array.from(this.fileList)
        .filter((item) => item.id && item.uzid !== this.main_image)
        .map((item, index) => {
          otherImages = new FormData()

          otherImages.append("is_main", false)
          otherImages.append("position", index + +!!mainImage)
          otherImages.append("file_type", 0)
          otherImages.append("file", item.file || item.fileTarget)

          promises.push(
            this.$api.post("/news/file/update/" + item.id, otherImages)
          )
        })

      Promise.all(promises)
        .then(
          () => {
            // console.log(res);
          },
          (err) => {
            console.log(err)
          }
        )
        .then(() => {
          // console.log(res);
          this.$message.success("Позиции успешно сохранены")
        })
    },
    activeImage(e) {
      // this.photoList.forEach((item, index) => {
      //   this.photoList[index].is_active = item.id == e
      // })
      let ind = this.photoList.findIndex((el) => el.id == e)
      this.photoList[ind].is_active = true
      this.$api.patch("/common/photo-gallery-attachments/update/" + e + "/")
    }
  }
}
</script>

<style scoped>
input[type="date"] {
  border-radius: 2px;
  padding: 4px;
  border: 1px solid #c7c7c7;
}
</style>
