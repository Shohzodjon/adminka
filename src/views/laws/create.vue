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
                v-model="form['title_' + getKey]"
                :placeholder="$t('EnterTitle')"
              />
            </a-col>
          </a-row>

          <!-- published time -->
          <a-row>
            <a-col
              :span="6"
              style="text-align: right; padding-right: 8px; padding-top: 6px"
            >
              {{ $t("DateOfPublication") }}:
            </a-col>
            <a-col :span="12">
              <a-date-picker
                v-model="form.date"
                :class="{
                  invalid: $v.form.date.$error
                }"
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
            <a-col :key="$route.query.tab" :span="23" style="margin: 0 auto">
              <!-- :key="langtab" -->
              <editor
                :value="form['body_' + getKey]"
                :initial-value="form['body_' + getKey]"
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
                  form['body_' + getKey] = editorChangeHandler(arguments[0])
                "
              />
            </a-col>
          </a-row>
        </a-tab-pane>

        <span v-if="form.id" slot="tabBarExtraContent">
          <a-popconfirm
            placement="bottomRight"
            title="Вы действительно хотите удалить данную новость?"
            @confirm="removeItem"
          >
            <a-button :disabled="pending" style="margin-right: 10px">
              <a-icon type="delete" />{{ $t("Delete") }}
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
import spoiler from "@/mixins/spoiler.js"
import { required } from "vuelidate/lib/validators"

export default {
  name: "News",

  components: {
    imageStorage: () => import("@/components/imageStorage/imageStorage"),
    spoilerModal: () =>
      import("@/components/directory/modal-components/modal-spoiler"),
    editor: () => import("@tinymce/tinymce-vue")
  },

  mixins: [spoiler],

  data() {
    return {
      // eslint-disable-next-line no-undef
      langTab: $langPrefix,
      form: {
        title_uz: "",
        title_oz: "",
        title_ru: "",
        title_en: "",
        title_qr: "",
        body_en: "",
        body_ru: "",
        body_uz: "",
        body_oz: "",
        body_qr: "",
        date: null
      },
      emptyTitle: false,
      emptyContent: false,
      modalVisible: false,
      loading: false,
      pending: false
    }
  },
  validations: {
    form: {
      date: {
        required
      }
    }
  },
  computed: {
    getKey() {
      return this.langTab
    }
  },
  methods: {
    async submitNews() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.$message.error(this.$t("PleaseForm"))
        return
      }
      const date = new Date(
        this.form && this.form.date && this.form.date._d.toString()
      )
      const form = {
        ...this.form,
        date: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
      }
      try {
        this.pending = true
        const res = await this.$api.post(`/common/laws/create/`, form)
        this.ISVALID(res, () => {
          this.$router.push("/laws")
        })
        this.pending = false
      } catch (e) {
        console.log(e)
        this.pending = false
        this.$message.error("Ошибка!")
      }
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
