<template>
  <a-row class="content-fix" type="flex">
    <a-col class="height100 flex-1">
      <a-tabs
        :active-key="$route.query.tab || 'content'"
        class="main-tabs"
        type="card"
        @change="$router.push({ query: { tab: arguments[0] } })"
      >
        <a-tab-pane key="content" class="main-tabs" type="card">
          <span slot="tab">
            <a-icon type="project" />{{ $t("TableContent") }}
          </span>
          <!-- lang tabs -->
          <!-- <a-row
            align="middle"
            class="flex-baseline"
            style="margin-bottom: 15px"
          >
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              {{ $t("Lang") }}:
            </a-col>
            <a-col :span="12">
              <a-row align="middle" class="flex-baseline flex-wrap">
                <lang-tabs v-model="langTab" class="mb-1x" />
              </a-row>
            </a-col>
          </a-row> -->
          <a-row align="middle" class="flex-baseline">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              {{ $t("TagsColTitle") }}:
            </a-col>
            <a-col :span="12" class="sm-mb">
              <a-input
                v-model="form.title[langTab]"
                :placeholder="$t('EnterTheTitle')"
              />
            </a-col>
          </a-row>
          <!-- editor -->
          <div class="appeals-editor">
            <a-row align="middle" style="margin-top: 25px" type="flex">
              <a-col :span="6" style="padding: 4px 8px 15px; text-align: right">
                {{ $t("Content") }}:
              </a-col>
              <!-- :key="langtab" -->
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
          </div>

          <a-row style="margin-top: 20px">
            <a-col :span="6" />
            <a-col :span="12">
              <a-row>
                <a-button style="margin-right: 10px" @click="$router.go(-1)">
                  <a-icon type="close" />{{ $t("Cancel") }}
                </a-button>
                <a-button type="primary" @click="submitUsefullLinks">
                  <a-icon type="check" />{{ $t("Add") }}
                </a-button>
              </a-row>
            </a-col>
          </a-row>
        </a-tab-pane>
        <!-- document tab  -->
        <a-tab-pane key="document">
          <span slot="tab"> <a-icon type="file" />{{ $t("TableDoc") }} </span>

          <h4 v-if="pending">{{ $t("Loading") }}</h4>

          <span v-show="!pending">
            <a-row v-if="document_files_array != 0" style="margin-bottom: 15px">
              <a-col :span="6" />

              <a-col :span="12">
                <a-button
                  class="ant-btn ant-btn-primary"
                  @click="uploadDocumentsConfirm"
                >
                  <a-icon type="upload" />{{ $t("UploadDocToServer") }}
                </a-button>
              </a-col>
            </a-row>

            <a-row style="margin-bottom: 15px">
              <a-col
                :span="6"
                style="text-align: right; padding-right: 8px; padding-top: 6px"
                >{{ $t("FileDoc") }}</a-col
              >
              <a-col :span="12">
                <a-button @click="$refs.documentRef.click()">
                  <input
                    ref="documentRef"
                    accept=".xlsx, .xls, .doc, .docx, .ppt, .pptx, .txt, .pdf, .svg, .png, .jpg, .jpeg"
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

                <!-- <InputFileItem
                  v-for="(doc, index) in newsDocs"
                  :key="index"
                  :file="{ ...doc, name: doc.file.split('/').pop() }"
                  class="mt-2"
                  link
                  @delete="deleteInputFile(doc)"
                /> -->
              </a-col>
            </a-row>
          </span>
        </a-tab-pane>
      </a-tabs>
    </a-col>
  </a-row>
</template>
<script>
import InputFileItem from "@/components/utils/input-file-item"
const formFields = () => ({
  title: {
    ru: "",
    uz: "",
    oz: "",
    en: "",
    qr: ""
  },
  content: {
    ru: "",
    uz: "",
    oz: "",
    en: "",
    qr: ""
  }
})
export default {
  components: {
    editor: () => import("@tinymce/tinymce-vue"),
    InputFileItem
  },
  data: () => {
    return {
      form: { ...formFields() },
      tabPane: null,
      document_files_array: [],
      pending: false,

      langTab: "oz",
      image: null
    }
  },
  methods: {
    async submitUsefullLinks() {
      try {
        let form = this.form
        Object.keys(form).forEach((k) => {
          Object.keys(form[k]).forEach((k2) => {
            form[k + "_" + k2] = form[k][k2]
          })
          delete form[k]
        })
        // console.log(form)
        let f = new FormData()
        Object.keys(form).forEach((k) => {
          f.append(k, form[k])
        })
        f.append("appeal", this.$route.params && this.$route.params.id)
        this.document_files_array.forEach((item) => {
          f.append("attachments", item.binary_file, item.binary_file.name)
        })
        await this.$api.post("/appeals/response/create/", f)

        this.$message.success("Ответ успешно отправлен")
        this.$router.push({ name: "appeals" })
      } catch (e) {
        console.log(e)
      }
    },
    tabPaneChangeHandler(arg) {
      // tinymce reload fix, !!! important
      this.tabPane = arg
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

      this.$refs.documentRef.value = null
      // console.log(this.document_files_array, e);
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
    deleteDocumentFileFromState(e) {
      this.document_files_array = this.document_files_array.filter((file) => {
        return file.uid != e.uid
      })
      // console.log(this.document_files_array, e)
    }
  }
}
</script>
<style></style>
