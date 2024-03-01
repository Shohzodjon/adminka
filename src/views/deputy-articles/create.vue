<template>
  <div>
    <spinner v-if="loading" />
    <a-row>
      <a-col class="height100 flex-1">
        <a-tabs
          :key="$route.fullPath"
          v-model="tabPane"
          class="main-tabs contacts-form-content"
          type="card"
          @change="tabPaneChangeHandler"
        >
          <a-tab-pane key="content">
            <span slot="tab">
              <a-icon type="project" />
              <!-- {{ $route.meta.title[$i18n.locale] }} -->
              {{ $t("TableContent") }}
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
              align="middle"
              class="flex-baseline"
              :class="{ 'form-group--error': emptyTitle }"
            >
              <a-col :span="6" style="text-align: right; padding-right: 8px">
                {{ $t("TagsColTitle") }}:
              </a-col>
              <a-col :span="12" class="sm-mb">
                <a-input
                  v-model="form.title[langTab]"
                  :placeholder="$t('AdressPlac')"
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
            <!-- published time -->
            <a-row>
              <a-col
                :span="6"
                style="text-align: right; padding-right: 8px; padding-top: 6px"
              >
                Дата публикации:
              </a-col>
              <a-col :span="12">
                <a-date-picker
                  v-model="form.pub_date"
                  :allow-clear="false"
                  :format="'YYYY-MM-DD'"
                />
              </a-col>
            </a-row>
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
            <a-row style="margin-top: 25px" type="flex">
              <a-col :span="6" style="text-align: right; padding-right: 8px">
                {{ $t("Content") }}:
              </a-col>
              <a-col v-show="langTab == 'oz'" :span="23">
                <!-- :key="langtab" -->
                <editor
                  :value="form.content.oz"
                  :initial-value="form.content.oz"
                  :init="{
                    ...tinymce.default.props,
                    menubar: 'file edit view insert format tools table tc help',
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
              <a-col v-show="langTab == 'uz'" :span="23">
                <!-- :key="langtab" -->
                <editor
                  :value="form.content.uz"
                  :initial-value="form.content.uz"
                  :init="{
                    ...tinymce.default.props,
                    menubar: 'file edit view insert format tools table tc help',
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
              <a-col v-show="langTab == 'qr'" :span="23">
                <!-- :key="langtab" -->
                <editor
                  :value="form.content.qr"
                  :initial-value="form.content.qr"
                  :init="{
                    ...tinymce.default.props,
                    menubar: 'file edit view insert format tools table tc help',
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
              <a-col v-show="langTab == 'ru'" :span="23">
                <!-- :key="langtab" -->
                <editor
                  :value="form.content.ru"
                  :initial-value="form.content.ru"
                  :init="{
                    ...tinymce.default.props,
                    menubar: 'file edit view insert format tools table tc help',
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
              <a-col v-show="langTab == 'en'" :span="23">
                <!-- :key="langtab" -->
                <editor
                  :value="form.content.en"
                  :initial-value="form.content.en"
                  :init="{
                    ...tinymce.default.props,
                    menubar: 'file edit view insert format tools table tc help',
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
                  :with-cropper="false"
                  :buttons="true"
                  :list="fileList"
                  accept="image/jpeg, image/png"
                  :not-active="true"
                  @change="handleImages"
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
      pending: false,
      tabPane: "content",
      submitStatus: "Ok",
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

  computed: {
    getKey() {
      return this.langTab
    }
  },
  created() {
    this.form.pub_date = new Date()
  },
  mounted() {
    this.fetchData()
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
    handleFile(e) {
      this.form.file = e.target.files[0]
    },
    handleImages(arg) {
      this.form.photo.push(arg[0])
      console.log(this.form.photo, arg[0])
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
      form.pub_date = this.moment.utc(form.pub_date).format("YYYY-MM-DD")
      Object.keys(form).forEach((k) => {
        k != "file" && k != "photo" && f.append(k, form[k])
        // k != "photo" && f.append(k, form[k])
        k == "file" && form[k] && f.append(k, form[k], form[k].name)
      })
      form.photo.forEach((k) => {
        f.append("photo", k.fileTarget, k.fileTarget.name)
      })
      try {
        const res = await this.$api.post("/structure/deputy/article/create/", f)
        this.ISVALID(res, () => {
          this.$router.go(-1)
        })
      } catch (e) {
        this.$message.error("Error")
      }
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
    tabPaneChangeHandler(arg) {
      this.tabPane = arg
    },

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    }
  }
}
</script>

<style>
input[type="datetime-local"] {
  border-radius: 2px;
  padding: 4px;
  border: 1px solid #c7c7c7;
}
</style>
