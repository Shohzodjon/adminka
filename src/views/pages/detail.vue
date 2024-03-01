<template>
  <a-row class="content-fix" type="flex">
    <spinner v-if="loading" />
    <a-col v-show="!loading" class="height100 flex-1">
      <a-tabs
        :active-key="$route.query.tab || 'content'"
        class="main-tabs"
        type="card"
        @change="$router.push({ query: { tab: arguments[0] } })"
      >
        <a-tab-pane key="content">
          <span slot="tab">
            <a-icon type="project" />{{ $t("TableContent") }}
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
              {{ $t("TableHead") }}:
            </a-col>
            <a-col :span="12" class="sm-mb">
              <a-input
                v-model="form.title[langTab]"
                :placeholder="$t('EnterTitle')"
                @input="slugCompute($event, langTab, 'post', form.title)"
              />
              <div v-if="isTitleNull" class="error-text">
                {{ $t("EnterTitleOne") }}.
              </div>
            </a-col>
          </a-row>

          <!-- slug -->
          <!-- <a-row align="middle" class="flex-baseline">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              ЧПУ:
            </a-col>
            <a-col :span="12" class="sm-mb">
              <a-row align="middle" type="flex">
                <span class="mr-1 link" @click="copySlug">
                  <a-icon :style="{ fontSize: '22px' }" type="copy" />
                </span>

                <span class="flex-1">
                  <a-input
                    id="slug-input"
                    :value="form.slug"
                    placeholder="Введите человеку понятный урл"
                    @input="onSlugChange"
                  />
                </span>
              </a-row>
              <div v-if="!form.slug" class="error-text">Введите ЧПУ.</div>
              <div v-if="errors.slug" class="z-error-text">
                Данный ЧПУ недоступен
              </div>
            </a-col>
          </a-row> -->

          <!-- Теги -->
          <!-- <a-row align="middle" class="flex-baseline">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              Теги:
            </a-col>
            <a-col :span="12" class="sm-mb">
              <vue-tags-input
                v-model="tag"
                :add-only-from-autocomplete="true"
                :autocomplete-items="filteredItems"
                :tags="form.tags"
                class="post-chips__input"
                placeholder="Введите теги, можно указать несколько"
                @tags-changed="update"
              />
            </a-col>
          </a-row> -->

          <!-- position -->
          <!-- <a-row align="middle" class="flex-baseline">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              Позиция:
            </a-col>
            <a-col :span="12" class="sm-mb">
              <a-input
                v-model.number="form.position"
                placeholder="Введите позицию"
              />
              <div v-if="!form.position" class="error-text">
                Введите позицию.
              </div>
            </a-col>
          </a-row> -->

          <!-- Parent menu list -->
          <!-- <a-row style="margin-bottom: 15px">
            <a-col
              :span="6"
              style="text-align: right; padding-right: 8px; padding-top: 6px"
            >
              Parent menu:
            </a-col>
            <a-col :span="12">
              <a-select
                v-model="parent_id"
                :filter-option="filterOption"
                option-filter-prop="children"
                placeholder="Выберите категорию"
                show-search
                style="width: 100%"
              >
                <a-select-option
                  v-for="category in menuList"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.title }}
                </a-select-option>
              </a-select>
              <div v-if="!form.category_id" class="error-text">
                Выберите категорию.
              </div>
            </a-col>
          </a-row> -->

          <!-- child menu list -->
          <!-- <a-row v-if="childMenuList.length" style="margin-bottom: 15px">
            <a-col
              :span="6"
              style="text-align: right; padding-right: 8px; padding-top: 6px"
            >
              Child menu:
            </a-col>
            <a-col :span="12">
              <a-select
                v-model="child_id"
                :filter-option="filterOption"
                option-filter-prop="children"
                placeholder="Выберите категорию"
                show-search
                style="width: 100%"
              >
                <a-select-option
                  v-for="category in childMenuList"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.title }}
                </a-select-option>
              </a-select>
              <div v-if="!form.category_id" class="error-text">
                Выберите категорию.
              </div>
            </a-col>
          </a-row> -->

          <!-- published time -->
          <a-row>
            <a-col
              :span="6"
              style="text-align: right; padding-right: 8px; padding-top: 6px"
            >
              {{ $t("TableDate") }}:
            </a-col>
            <a-col :span="12">
              <a-date-picker
                v-model="form.pub_date"
                :allow-clear="false"
                :format="'DD-MM-YYYY'"
              />
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
          <a-row
            :class="{ 'form-group--error': emptyContent }"
            align="middle"
            style="margin-top: 25px"
            type="flex"
          >
            <a-col :span="6" style="padding: 4px 8px 15px; text-align: right">
              {{ $t("Content") }}:
            </a-col>
            <a-col v-show="langTab == 'oz'" :span="23" style="margin: 0 auto">
              <!-- :key="langtab" -->
              <editor
                :value="form.content.oz"
                :initial-value="form.content.oz"
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
                @input="form.content.oz = editorChangeHandler(arguments[0])"
              />
              <div v-if="isContentNull" class="error-text">
                {{ $t("EnterContentOne") }}.
              </div>
            </a-col>
            <a-col v-show="langTab == 'uz'" :span="23" style="margin: 0 auto">
              <!-- :key="langtab" -->
              <editor
                :value="form.content.uz"
                :initial-value="form.content.uz"
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
                @input="form.content.uz = editorChangeHandler(arguments[0])"
              />
              <div v-if="isContentNull" class="error-text">
                {{ $t("EnterContentOne") }}.
              </div>
            </a-col>
            <a-col v-show="langTab == 'qr'" :span="23" style="margin: 0 auto">
              <!-- :key="langtab" -->
              <editor
                :value="form.content.qr"
                :initial-value="form.content.qr"
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
                @input="form.content.qr = editorChangeHandler(arguments[0])"
              />
              <div v-if="isContentNull" class="error-text">
                {{ $t("EnterContentOne") }}.
              </div>
            </a-col>
            <a-col v-show="langTab == 'ru'" :span="23" style="margin: 0 auto">
              <!-- :key="langtab" -->
              <editor
                :value="form.content.ru"
                :initial-value="form.content.ru"
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
                @input="form.content.ru = editorChangeHandler(arguments[0])"
              />
              <div v-if="isContentNull" class="error-text">
                {{ $t("EnterContentOne") }}.
              </div>
            </a-col>
            <a-col v-show="langTab == 'en'" :span="23" style="margin: 0 auto">
              <!-- :key="langtab" -->
              <editor
                :value="form.content.en"
                :initial-value="form.content.en"
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
                @input="form.content.en = editorChangeHandler(arguments[0])"
              />
              <div v-if="isContentNull" class="error-text">
                {{ $t("EnterContentOne") }}.
              </div>
            </a-col>
          </a-row>

          <!-- status toggle -->
          <a-row style="margin-top: 25px">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              {{ $t("IsActive") }}
            </a-col>
            <a-switch v-model="form.is_active" />
          </a-row>

          <!-- visibity on head page -->
          <!-- <a-row style="margin-top: 25px">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              Поставить на главную:
            </a-col>
            <a-switch v-model="form.is_main" />
          </a-row> -->

          <!-- view in slider -->
          <!-- <a-row style="margin-top: 25px">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              Поставить на слайдер:
            </a-col>
            <a-switch v-model="form.to_slider" />
          </a-row> -->

          <!-- language availability -->
          <!-- <a-row style="margin-top: 25px">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              Доступность на языке {{ langTab }}
            </a-col> -->
          <!-- <a-switch v-model="form.language_support[langTab]" /> -->
          <!-- </a-row> -->
        </a-tab-pane>

        <!-- photo tab -->
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
                :selected-image="main_image"
                accept="image/jpeg, image/png"
                method-name="news"
                multiple
                has-method
                @change="handleImages"
                @drag-update="updateFilesPosition"
                @set-main-image="activeImage"
                @delete="deleteImage"
              />
            </a-col>
          </a-row>
        </a-tab-pane>

        <!-- video tab  -->
        <!-- <a-tab-pane key="video">
          <span slot="tab">
            <a-icon type="video-camera" />Видео для слайдера
          </span>

          <a-col>
            <a-row style="margin-bottom: 15px">
              <a-col
                :span="6"
                style="text-align: right; padding-right: 8px; padding-top: 6px"
              >
                Тип загрузки:
              </a-col>
              <a-col :span="12">
                <a-select
                  v-model="video_input.file_type"
                  placeholder="Выберите тип загрузки видео"
                  show-search
                  style="width: 100%"
                >
                  <a-select-option
                    v-for="item in videoUploaadTypes"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{ item.title[$i18n.locale] }}
                  </a-select-option>
                </a-select>
              </a-col>
            </a-row>

            <a-row
              v-if="video_input.file_type != 1"
              style="margin-bottom: 15px"
            >
              <a-col
                :span="6"
                style="text-align: right; padding-right: 8px; padding-top: 6px"
              >
                Ссылка на видео:
              </a-col>
              <a-col :span="12">
                <a-col class="mb-2">
                  <a-input
                    v-model="video_input.file"
                    :placeholder="placeholders.video_url[$i18n.locale]"
                  />
                </a-col>
              </a-col>
            </a-row>

            <a-row v-else style="margin-bottom: 15px">
              <a-col
                :span="6"
                style="text-align: right; padding-right: 8px; padding-top: 6px"
              >
                Файл с компьютера:
              </a-col>
              <a-col :span="12">
                <a-button @click="$refs.videoRef.click()">
                  <input
                    ref="videoRef"
                    accept="video/*"
                    hidden
                    type="file"
                    @change="handleVideoInput"
                  />
                  <a-icon type="upload" />Выберите файл
                </a-button>

                <InputFileItem
                  :file="video_file"
                  class="mt-2"
                  @delete="video_file = null"
                />
              </a-col>
            </a-row>
          </a-col>
        </a-tab-pane> -->

        <!-- document tab  -->
        <a-tab-pane key="document">
          <span slot="tab"> <a-icon type="file" />{{ $t("TableDoc") }} </span>

          <h4 v-if="pending">{{ $t("Loading") }}</h4>

          <span v-show="!pending">
            <!-- <a-row v-if="document_files_array != 0" style="margin-bottom: 15px">
              <a-col :span="6" />

              <a-col :span="12">
                <a-button
                  class="ant-btn ant-btn-primary"
                  @click="uploadDocumentsConfirm"
                >
                  <a-icon type="upload" />Загрузить документы на сервер
                </a-button>
              </a-col>
            </a-row> -->

            <a-row style="margin-bottom: 15px">
              <a-col
                :span="6"
                style="text-align: right; padding-right: 8px; padding-top: 6px"
                >{{ $t("FileDoc") }}:</a-col
              >
              <a-col :span="12">
                <a-button @click="$refs.documentRef.click()">
                  <input
                    ref="documentRef"
                    accept=".xlsx, .xls, .doc, .docx, .ppt, .pptx, .txt, .pdf"
                    hidden
                    type="file"
                    multiple
                    @change="handeDocumentInput"
                  />
                  <a-icon type="upload" />{{ $t("FileSelect") }}
                </a-button>

                <template v-if="document_files_array != 0">
                  <p style="padding-left: 15px">{{ $t("Downloads") }}</p>
                  <InputFileItem
                    v-for="item in document_files_array"
                    :key="item.uid"
                    :file="item.binary_file"
                    class="mt-2 no-a-hover"
                    @delete="deleteDocumentFileFromState(item)"
                  />

                  <a-row
                    style="border-bottom: 1px solid #ddd; padding-bottom: 15px"
                  />
                </template>

                <InputFileItem
                  v-for="(doc, index) in newsDocs"
                  :key="index"
                  :file="{ ...doc, name: doc.file.split('/').pop() }"
                  class="mt-2"
                  link
                  @delete="deleteInputFile(doc)"
                />
              </a-col>
            </a-row>
          </span>
        </a-tab-pane>

        <span v-if="form.id" slot="tabBarExtraContent">
          <a-popconfirm
            placement="bottomRight"
            title="Вы действительно хотите удалить данную новость?"
            @confirm="removeItem"
          >
            <a-button :disabled="pending" style="margin-right: 10px">
              <a-icon type="delete" />{{ $t("Cancel") }}
            </a-button>
          </a-popconfirm>
        </span>
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
            @click="submitNews"
          >
            <a-icon type="check" />
            {{ form.id ? $t("Save") : $t("Add") }}
          </a-button>
        </a-col>
      </a-row>
    </a-col>

    <spoiler-modal
      v-show="!!spoiler.modalVisibility"
      v-model="spoiler"
      @ok="appendToEditor"
      @cancel="closeSpoilerModal"
    />
  </a-row>
</template>

<script>
import InputFileItem from "@/components/utils/input-file-item"
import cloneDeep from "lodash/cloneDeep"

// import VueTagsInput from "@johmun/vue-tags-input"
import spoiler from "@/mixins/spoiler.js"

const newsDefaultFields = () => ({
  title: {
    uz: "",
    oz: "",
    ru: "",
    en: "",
    qr: ""
  },
  content: {
    uz: "",
    oz: "",
    ru: "",
    en: "",
    qr: ""
  },
  category_id: null,
  slug: "",
  tags: [],
  position: 1,
  is_active: true,
  language_support: {
    uz: false,
    oz: false,
    ru: false,
    en: false,
    qr: false
  },
  is_main: false,
  pub_date: null
})

export default {
  name: "News",

  components: {
    "image-upload": () => import("@/components/utils/image-upload"),
    imageStorage: () => import("@/components/imageStorage/imageStorage"),
    spoilerModal: () =>
      import("@/components/directory/modal-components/modal-spoiler"),
    editor: () => import("@tinymce/tinymce-vue"),
    InputFileItem
    // VueTagsInput
  },

  mixins: [spoiler],

  data() {
    return {
      // eslint-disable-next-line no-undef
      langTab: $langPrefix,
      form: { ...newsDefaultFields() },
      pub_date: null,
      groupCategoryList: [],
      fileList: [],
      image_List: [],
      pending: false,
      loading: false,
      menuList: [],
      childMenuList: [],
      parent_id: null,
      child_id: null,

      previewVisible: false,
      previewImage: "",

      tabPane: null,
      main_image: null,
      video_input: {
        file_type: 3,
        file: ""
      },

      video_file: null,
      file_List: [],

      newsFiles: [],
      document_file: null,
      document_files_array: [],
      errors: {
        slug: ""
      },
      tag: "",
      autocompleteItems: [],
      tagTimer: null,
      emptyTitle: false,
      emptyContent: false,

      current_slug: "",

      modalVisible: false
    }
  },

  computed: {
    isTitleNull() {
      return !!(
        !this.form.title.uz &&
        !this.form.title.oz &&
        !this.form.title.ru &&
        !this.form.title.en &&
        !this.form.title.qr
      )
    },
    isContentNull() {
      return !!(
        !this.form.content.uz &&
        !this.form.content.oz &&
        !this.form.content.ru &&
        !this.form.content.en &&
        !this.form.content.qr
      )
    },

    newsPhotos() {
      return (
        this.newsFiles && this.newsFiles.filter((item) => item.file_type == 0)
      )
    },

    photoList() {
      return this.form && this.form.images
    },

    newsVideos() {
      return (
        this.newsFiles &&
        this.newsFiles.filter(
          (item) =>
            item.file_type === 1 || item.file_type === 3 || item.file_type === 4
        )
      )
    },

    videoUrl() {
      return (
        this.newsFiles &&
        this.newsFiles
          .filter((item) => item.file_type === 3 || item.file_type === 4)
          .sort((a, b) => new Date(b.updated) - new Date(a.updated))
      )
    },

    newsDocs() {
      return (
        this.newsFiles && this.newsFiles.filter((item) => item.file_type === 2)
      )
    },

    filteredItems() {
      return (
        this.autocompleteItems.filter(
          (i) =>
            i.text.toLowerCase().indexOf(this.tag.toLowerCase()) !== -1 || i
        ) || []
      )
    },

    publicPath() {
      return process.env.BASE_URL
    }
  },

  watch: {
    "$route.params.id": {
      handler(newVal, oldVal) {
        if (+oldVal != +newVal) this.fetchData()
      },
      immediate: true
    },
    // tag: "initItems",
    // "form.title": {
    //   handler(val) {
    //     try {
    //       this.form.language_support[this.langTab] = !!val[this.langTab]
    //     } catch (error) {
    //       console.log(error)
    //       this.$sentry.captureMessage(error)
    //     }
    //   },
    //   deep: true
    // },
    parent_id(newVal) {
      console.log(newVal)
      this.findChild(newVal)
    }
  },

  created() {
    this.form = {
      ...newsDefaultFields(),
      category_id: +this.$route.params.cat_id || null,
      pub_date: this.moment.utc(new Date(), "DD-MM-YYYY")
    }

    // this.$store.dispatch("tags/fetch")
  },

  mounted() {
    this.$on("update:slug", this.onSlugChange)
    this.fetchMenuList()
  },

  methods: {
    async deleteImage(val) {
      console.log(val)
      await this.$api.delete("/cms/post/image/" + val + "/delete/")
    },
    openStoreModal() {
      this.modalVisible = true
    },
    async removeItem() {
      try {
        const r = await this.$store.dispatch(
          "news/deleteItemAction",
          this.form.id
        )
        if (r) {
          this.$message.success("Новость успешно удалена")
          this.$router.go(-1)
        }
      } catch (err) {
        console.log(err)
        this.$sentry.captureMessage(err)
      }
    },
    onSlugChange(e) {
      const text = (e.target.value || "")
        .replace(/( )/gi, "-")
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\\-]/gi, "")

      this.slugCheck({ table: "post", slug: text })

      this.form.slug = text
    },
    setSlugRes(arg) {
      this.errors.slug = arg ? "" : "Данный ЧПУ недоступен"
    },
    copySlug() {
      this.copyStringToClipboard(`/${this.$options.name}/${this.form.slug}`)
      this.$message.success("ЧПУ скопирован")
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
        // this.form.language_support[to] = true
      } catch (error) {
        this.$sentry.captureMessage(error)
      }
    },
    update(newTags) {
      this.autocompleteItems = []
      this.form.tags = newTags
    },
    initItems() {
      // chips, tags fetcher function
      if (this.tag.length < 2) {
        return
      }

      clearTimeout(this.tagTimer)
      this.tagTimer = setTimeout(async () => {
        try {
          const data = await this.$store.dispatch("tags/fetch")

          if (data && data.length) {
            this.autocompleteItems =
              data.map((item) => ({
                ...item,
                text: item.name
              })) || []
          }
        } catch (e) {
          this.$sentry.captureMessage(e)
        }

        clearTimeout(this.tagTimer)
      }, 800)
    },
    handleVideoInput(e) {
      if (e.target.files && e.target.files[0]) {
        this.video_file = e.target.files[0]
      }

      this.$refs.videoRef.value = null
    },
    handeDocumentInput(e) {
      if (e.target.files && e.target.files != 0) {
        Array.from(e.target.files).forEach((item) => {
          this.document_files_array = [
            ...this.document_files_array,
            {
              binary_file: item,
              uid: Math.random().toString().slice(2)
            }
          ]
        })
      }

      // console.log(this.document_files_array)

      this.$refs.documentRef.value = null
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
        otherImages.append(
          "file",
          mainImage.file || (mainImage.fileTarget || {}).name || "untitled_file"
        )
        promises.push(
          this.$api.put("/news/file/update/" + mainImage.id, otherImages)
        )
      }

      // console.log(+!!mainImage);

      // debugger;

      Array.from(this.fileList)
        .filter((item) => item.id && item.uzid !== this.main_image)
        .map((item, index) => {
          otherImages = new FormData()

          otherImages.append("is_main", false)
          otherImages.append("position", index + ((mainImage && 1) || 0))
          otherImages.append("file_type", 0)
          otherImages.append("file", item.file || "untitled_file")

          promises.push(
            this.$api.put("/news/file/update/" + item.id, otherImages)
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

    check2Null(arg) {
      // console.log("check2Null", r);

      return Object.values(arg).every((item) => !item)
    },
    validateForm() {
      if (this.check2Null(this.form.title)) {
        this.emptyTitle = true
        this.$message.error(this.$t("EnterTitleOne"))
        return false
      }

      if (this.check2Null(this.form.content)) {
        this.emptyContent = true
        this.$message.error(this.$t("EnterContentOne"))
        return false
      }

      //   if (this.errors.slug && this.current_slug != this.form.slug) {
      //     this.$message.error("ЧПУ занят, введите другое")
      //     return false
      //   }

      if (this.form.slug && this.form.slug.length >= 200) {
        this.$message.error(
          "Количество символов в ЧПУ превышает предел 200 символов, укоротите ЧПУ"
        )
        return false
      }

      return true
    },
    async submitNews({ noRouterBack = false }) {
      if (!this.validateForm()) return

      if (this.pending) return

      this.pending = true
      // ;(this.child_id && (this.form.menu = this.child_id)) ||
      //   (this.parent_id && (this.form.menu = this.parent_id))
      this.form.menu = this.$route.params && this.$route.params.id
      // let f = new FormData()
      // this.fileList.forEach(item => {
      //   f.append('images', item)
      // })
      // Object.keys(this.form).forEach(item => {
      //   f.append(item, this.form[item])
      // })

      try {
        let newData = cloneDeep(this.form)
        delete newData.url
        delete newData.attachments
        delete newData.images

        newData = {
          ...newData,
          content_ru: newData.content.ru,
          content_uz: newData.content.uz,
          content_oz: newData.content.oz,
          content_en: newData.content.en,
          content_qr: newData.content.qr,
          title_ru: newData.title.ru,
          title_uz: newData.title.uz,
          title_oz: newData.title.oz,
          title_en: newData.title.en,
          title_qr: newData.title.qr,
          //   content: JSON.stringify(newData.content),
          pub_date: this.moment.utc(newData.pub_date).format()
          //   tags:
          //     (newData.tags && newData.tags.map((item) => item.id).join(",")) ||
          //     ""
        }

        delete newData.content
        delete newData.language_support
        delete newData.tags
        delete newData.title

        console.log(newData)

        let f = new FormData()
        Object.keys(newData).forEach((key) => {
          f.append(key, newData[key])
        })
        console.log(this.image_List)
        this.image_List.forEach((item) => {
          console.log(item.fileTarget.name)
          f.append(
            "images",
            item.fileTarget,
            item.uzid + "." + item.fileTarget.name
          )
        })

        this.document_files_array.forEach((item) => {
          item &&
            item.binary_file &&
            !item.binary_file.id &&
            f.append("attachments", item.binary_file, item.binary_file.name)
        })

        console.log(newData)

        const createOrUpdate = {
          url:
            this.form && this.form.id
              ? "/cms/post/" + this.form.id + "/update/"
              : "/cms/post/create/",
          method: this.form && this.form.id ? "patch" : "post",
          data: f
        }

        if (
          !(await this.$api[createOrUpdate.method](
            createOrUpdate.url,
            createOrUpdate.data,
            { timeout: 0 }
          ).then((res) => {
            if (res && res.status >= 200 && res.data && res.data.id) {
              if (res.data.id) {
                const { id } = res.data

                this.form = { ...this.form, id }
                return true
              }
            }
          }))
        ) {
          this.pending = false
          return
        }

        // upload after post done
        this.uploadPostFiles(noRouterBack)
      } catch (error) {
        console.error(error)
        this.$message.error(
          "Возникла проблема при " +
            (this.form && this.form.id ? "сохранении" : "добавлении") +
            " новости" +
            "\r\n\r\n" +
            error
        )

        this.$sentry.captureMessage(error)
      }
    },
    async uploadPostFiles(noRouterBack = true) {
      this.pending = true

      try {
        // upload images
        await this.uploadImages()

        // upload video
        await this.uploadVideos()

        // upload docs
        await this.uploadDocuments()

        this.pending = false
        this.$message.success("Новость успешно сохранено")

        if (!noRouterBack) {
          this.$router.push({
            name: "pages",
            params: { cat_id: this.form.category_id }
          })
          // this.$router.go(-1);
        }
      } catch (error) {
        this.pending = false
        this.$sentry.captureMessage(error)
      }
    },
    uploadDocumentsConfirm() {
      if (
        !this.form.id &&
        confirm("Новость еще не создана, создать её сейчас?")
      ) {
        // check form is inputs are filled and validate
        this.submitNews({ noRouterBack: true })
      } else {
        this.uploadDocuments()
      }

      this.$router.push({
        name: "news-detail",
        params: { id: this.form.id },
        query: { tab: "document" }
      })
    },

    uploadDocuments() {
      this.pending = true
      const promises = []
      if (this.document_files_array != 0) {
        this.document_files_array.forEach((item) => {
          const f = new FormData()
          f.append("file", item.binary_file)
          f.append("news_id", this.form.id)
          f.append("file_type", 2)
          f.append("status", true)
          f.append("is_main", true)
          f.append("position", 1)
          // promises.push(this.$api.post("/news/file/create", f))
        })

        return Promise.all(promises)
          .then(() => {
            this.pending = false
            this.document_files_array = []
            this.fetchData()
          })
          .catch((e) => {
            this.$message.error(
              "Возникла ошибка при отправке документов\r\n" + e
            )
            this.pending = false
            this.document_files_array = []
          })
      }
    },

    uploadImages() {
      // let promises = []

      // let notPrimaryImages = this.fileList.filter(
      //   (item) => this.main_image != item.uzid
      // )

      // let mainImage = this.fileList.find((item) => this.main_image == item.uzid)

      // Array.from(notPrimaryImages).map((item, index) => {
      //   let img = new FormData()

      //   const req = {
      //     attr: "create",
      //     id: this.form.id,
      //     method: "post"
      //   }

      //   if (item.id) {
      //     req.attr = "update/" + item.id
      //     req.id = item.id
      //     req.method = "put"
      //     img.append("file", item.file)
      //   } else {
      //     img.append("file", item.fileTarget)
      //   }
      //   img.append("is_main", this.main_image == item.uzid)
      //   img.append("news_id", this.form.id)
      //   img.append("file_type", 0)
      //   img.append("status", true)
      //   img.append("position", index + 1 + ((mainImage && 1) || 0))

      //   promises.push(this.$api[req.method](`/news/file/${req.attr}`, img))
      // })

      // if (mainImage) {
      //   let img = new FormData()

      //   const req = {
      //     attr: "create",
      //     id: this.form.id,
      //     method: "post"
      //   }

      //   if (mainImage.id) {
      //     req.attr = "update/" + mainImage.id
      //     req.id = mainImage.id
      //     req.method = "put"
      //     img.append("file", mainImage.file)
      //   } else {
      //     img.append("file", mainImage.fileTarget)
      //   }
      //   img.append("is_main", this.main_image == mainImage.uzid)
      //   img.append("news_id", this.form.id)
      //   img.append("file_type", 0)
      //   img.append("status", true)
      //   img.append("position", 1)

      //   promises.push(this.$api[req.method](`/news/file/${req.attr}`, img))
      // }

      // // console.log(notPrimaryImages, mainImage);

      // return Promise.all(promises)
      //   .then(() => {
      //     this.pending = false
      //   })
      //   .catch((e) => {
      //     this.$message.error("Возникла ошибка при отправке фото\r\n" + e)
      //     this.pending = false
      //   })
      let f = new FormData()
      this.fileList.forEach((item) => {
        f.append("images", item)
      })
      this.$api.post
    },

    uploadVideos() {
      if (this.video_input.file && this.form.id) {
        let promises = []

        const f = new FormData()
        let req = {
          url: "create",
          method: "post"
        }

        f.append(
          "file",
          this.video_input.file_type == 1
            ? this.video_file
            : this.video_input.file
        )
        f.append("file_type", this.video_input.file_type)
        f.append("news_id", this.form.id)
        f.append("status", true)
        f.append("is_main", true)
        f.append("position", 1)

        if (this.video_input.id) {
          req = {
            url: "update/" + this.video_input.id,
            method: "put"
          }
        }

        promises.push(this.$api[req.method]("/news/file/" + req.url, f))

        return Promise.all(promises)
          .then(() => {
            this.pending = false
          })
          .catch((e) => {
            this.$message.error("Возникла ошибка при отправке видео\r\n" + e)
            this.pending = false
          })
      }
    },

    fetchData() {
      this.loading = true
      // this.$store.dispatch("category/fetch")

      if (isNaN(this.$route.params.id)) {
        this.loading = false
        return
      }

      this.$route.query &&
        this.$route.query.post &&
        this.$api
          .get("/cms/post/" + this.$route.query.post + "/update/")
          .then(async (res) => {
            if (res && res.data) {
              // skip non important keys
              // eslint-disable-next-line no-unused-vars
              const { category, pub_date, updated, views, ...data } = res.data

              this.form = {
                ...this.form,
                ...data,
                // title: JSON.parse(data.title),
                title: {
                  ru: res.data.title_ru,
                  qr: res.data.title_qr,
                  en: res.data.title_en,
                  oz: res.data.title_oz,
                  uz: res.data.title_uz
                },
                content: {
                  ru: res.data.content_ru,
                  qr: res.data.content_qr,
                  en: res.data.content_en,
                  oz: res.data.content_oz,
                  uz: res.data.content_uz
                },
                // content: JSON.parse(data.content),
                pub_date: this.moment.utc(pub_date),
                tags:
                  (data.tag_list &&
                    data.tag_list.map(({ id, name }) => ({
                      id,
                      text: name
                    }))) ||
                  [],

                language_support: data.language_support
              }
              // console.log(this.form)

              this.current_slug = this.form.slug
              this.form.attachments.forEach((item) => {
                this.document_files_array = [
                  ...this.document_files_array,
                  {
                    binary_file: item,
                    uid: Math.random().toString().slice(2)
                  }
                ]
              })
            }

            // await this.fetchNewsFiles()
            this.loading = false
          })
          .catch((err) => {
            console.log(err)
            this.loading = false
          })
      this.loading = false
    },

    fetchNewsFiles() {
      if (!this.$route.params.id) {
        // console.log('No params id');
        return
      }

      return this.$api
        .get("/news/file/list/" + this.$route.params.id)
        .then((res) => {
          // console.log("fetchNewsFiles", res);
          this.newsFiles = (res.data || [])
            .slice()
            .sort((a, b) => b.updated - a.updated)

          // set first element of video files as video_url
          if (
            this.videoUrl &&
            this.videoUrl.length &&
            this.videoUrl[0] &&
            this.videoUrl[0].file
          ) {
            this.video_input = this.videoUrl[0]
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },

    handleImages(arg) {
      this.fileList = arg
      this.image_List = arg
    },

    tabPaneChangeHandler(arg) {
      // tinymce reload fix, !!! important
      this.tabPane = arg
    },

    async deleteInputFile(arg) {
      try {
        const res = await this.$store.dispatch("file/delete", arg.id)

        if (res) {
          const f = this.newsFiles.findIndex((item) => item.id == arg.id)

          if (f != -1) {
            this.newsFiles.splice(f, 1)
          }
        }
      } catch (err) {
        this.$sentry.captureMessage(err)
      }
    },

    deleteDocumentFileFromState(itemToDelete) {
      console.log(itemToDelete)
      if (
        itemToDelete &&
        itemToDelete.binary_file &&
        itemToDelete.binary_file.id
      ) {
        this.$api
          .delete("/cms/post/file/" + itemToDelete.binary_file.id + "/delete/")
          .then((res) => {
            if (res.status == 204) {
              this.$refs.documentRef.value = null
              const f = this.document_files_array.findIndex(
                (item) => item.uid === itemToDelete.uid
              )

              if (f != -1) {
                this.document_files_array = [
                  ...this.document_files_array.slice(0, f),
                  ...this.document_files_array.slice(f + 1)
                ]
              }
            }
          })
      } else {
        this.$refs.documentRef.value = null
        const f = this.document_files_array.findIndex(
          (item) => item.uid === itemToDelete.uid
        )

        if (f != -1) {
          this.document_files_array = [
            ...this.document_files_array.slice(0, f),
            ...this.document_files_array.slice(f + 1)
          ]
        }
      }
    },

    fetchMenuList() {
      this.$store.dispatch("menu/fetch").then((res) => {
        this.menuList = res
      })
    },

    findChild(id) {
      this.childMenuList = []
      this.child_id = null
      this.menuList.forEach((item) => {
        item && item.id == id && (this.childMenuList = item.children)
      })
    },

    activeImage(e) {
      this.photoList.forEach((item, index) => {
        this.photoList[index].is_active = item.id == e
      })
      this.$api.patch("/cms/post/image/" + e + "/update/")
    }
  }
}
</script>
<style>
.ant-modal {
  max-height: 600px;
}
.scroll-container {
  padding: 20px 0px;
}
</style>
