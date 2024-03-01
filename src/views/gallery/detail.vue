<template>
  <a-row class="content-fix" type="flex">
    <spinner v-if="loading" />
    <a-col v-show="!loading" class="height100 flex-1">
      <a-tabs
        :key="$route.fullPath"
        v-model="tabPane"
        class="main-tabs"
        type="card"
        @change="tabPaneChangeHandler"
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
                <!-- <a-button
                  v-if="langTab == 'uz' || langTab == 'oz'"
                  @click.stop="translitAction"
                >
                  Перевести копию на
                  {{ langTab == "uz" ? "кирилицу" : "латиницу" }}
                </a-button> -->
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
                spellcheck="false"
                @input="slugCompute($event, langTab, 'post', form.title)"
              />
              <div v-if="isTitleNull" class="error-text">
                Введите заголовок на одном из языков.
              </div>
            </a-col>
          </a-row>
          <a-row v-if="$route.query.type == 'video'">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              {{ $t("TablePhoto") }}:
            </a-col>
            <a-col :span="12" class="sm-mb">
              <input
                type="file"
                accept="image/jpg, image/jpeg, image/png, image/svg"
                @change="handlePoster"
              />
              <!-- <a-upload name="file" :multiple="true" v-model="form.photo">
                <a-button> <a-icon type="upload" /> Click to Upload </a-button>
              </a-upload> -->
              <div class="gallery-image">
                <img :src="poster_url" />
              </div>
            </a-col>
          </a-row>

          <!-- slug -->
          <!-- <a-row
            :class="[
              'flex-baseline',
              { 'form-group--error': form.slug.$error }
            ]"
            align="middle"
          >
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
                    spellcheck="false"
                    @input="onSlugChange"
                  />
                </span>
              </a-row>
              <div v-if="!form.slug" class="error-text">Введите ЧПУ</div>
              <div
                v-if="errors.slug && current_slug != form.slug"
                class="z-error-text"
              >
                Данный ЧПУ недоступен
              </div>
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
                spellсheck="false"
              />
              <div v-if="!form.position" class="error-text">
                Введите позицию.
              </div>
            </a-col>
          </a-row> -->

          <!-- status toggle -->
          <!-- <a-row style="margin-top: 25px">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              Статус:
            </a-col>
            <a-switch v-model="form.status" />
          </a-row> -->
        </a-tab-pane>

        <!--photo tab-->
        <a-tab-pane v-if="tabName.includes('photo')" key="photo">
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
                multiple
                upload-multiple
                :selected-image="selectedImage"
                :with-cropper="false"
                @change="fileList = arguments[0]"
                @drag-update="updateFilesPosition"
                @set-main-image="activeImage"
                @activeImage="activeImage"
              />
            </a-col>
          </a-row>
        </a-tab-pane>

        <!--video tab-->
        <a-tab-pane v-if="tabName.includes('video')" key="video">
          <span slot="tab">
            <a-icon type="video-camera" />{{ $t("Video") }}
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
              v-if="video_input.file_type == 1"
              style="margin-bottom: 15px"
            >
              <a-col
                :span="6"
                style="text-align: right; padding-right: 8px; padding-top: 6px"
              >
                Ссылка на видео:
              </a-col>
              <a-col :span="10">
                <!--                <a-col class="mb-2" v-for="(item, index) in videoUrl">-->
                <!--                  <a-input :placeholder="placeholders.video_url[$i18n.locale]" v-model="item.file"/>-->
                <!--                </a-col>-->

                <a-col class="mb-2">
                  <a-input
                    v-model="video_link"
                    :placeholder="placeholders.video_url[$i18n.locale]"
                  />
                  <p v-if="showLinkWarn" class="urlWarn">
                    Please input correct url
                  </p>
                </a-col>
              </a-col>
              <a-col :span="2">
                <a-button
                  style="margin-left: 10px"
                  type="primary"
                  @click="addLink"
                >
                  <a-icon type="check" />
                  Добавить
                </a-button>
              </a-col>
            </a-row>
            <a-row
              v-if="video_input.file_type == 1"
              style="margin-bottom: 15px"
            >
              <a-col
                :span="6"
                style="text-align: right; padding-right: 8px; padding-top: 6px"
              >
                Ссылки:
              </a-col>

              <a-col :span="12">
                <!--                <a-col class="mb-2" v-for="(item, index) in videoUrl">-->
                <!--                  <a-input :placeholder="placeholders.video_url[$i18n.locale]" v-model="item.file"/>-->
                <!--                </a-col>-->

                <a-col class="mb-2">
                  <div v-for="l in form.urls" :key="l" class="urls">
                    <p>{{ (l && l.url) || l }}</p>
                    <a-button
                      style="margin-left: 10px"
                      type="primary"
                      @click="deleteLink(l)"
                    >
                      <a-icon type="delete" />
                    </a-button>
                  </div>
                  <div v-for="l in urls" :key="l.id" class="urls">
                    <p>{{ l && l.url }}</p>
                    <a-button
                      style="margin-left: 10px"
                      type="primary"
                      @click="deleteLinkById(l.id)"
                    >
                      <a-icon type="delete" />
                    </a-button>
                  </div>
                </a-col>
              </a-col>
              <!-- <a-col :span="2">
                <a-button
                  style="margin-left: 10px"
                  type="primary"
                  @click="addLink"
                >
                  <a-icon type="delete" />
                </a-button>
              </a-col> -->
            </a-row>

            <a-row
              v-else-if="video_input.file_type == 2"
              style="margin-bottom: 15px"
            >
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
                    multiple
                    type="file"
                    @change="handleVideoInput"
                  />
                  <a-icon type="upload" />Выберите файл
                </a-button>

                <InputFileItem
                  v-for="(vf, index) in video_file"
                  :key="index"
                  :file="vf"
                  class="mt-2"
                  @delete="removeVideo(vf)"
                />
                <InputFileItem
                  v-for="(vf, index) in filesList"
                  :key="index"
                  :file="{ ...vf, name: vf.file && vf.file.split('/').pop() }"
                  class="mt-2"
                  link
                  @delete="removeVideo(vf)"
                />
              </a-col>
            </a-row>

            <a-row
              v-if="video_input.file_type == 3"
              style="margin-bottom: 15px"
            >
              <a-col
                :span="6"
                style="text-align: right; padding-right: 8px; padding-top: 6px"
              >
                Постер (предпросмотр):
              </a-col>
              <a-col :span="12">
                <input
                  ref="videoPosterRef"
                  accept="image/jpeg, image/png"
                  hidden
                  type="file"
                  @change="handleVideoPosterInput"
                />
                <a-button @click="$refs.videoPosterRef.click()">
                  <a-icon type="upload" />Выберите файл
                </a-button>

                <InputFileItem
                  v-if="video_poster_file"
                  :file="video_poster_file"
                  class="mt-2"
                  @delete="video_poster_file = null"
                />
              </a-col>
            </a-row>
          </a-col>
        </a-tab-pane>

        <span v-if="form.id" slot="tabBarExtraContent">
          <a-popconfirm
            placement="bottomRight"
            title="Вы действительно хотите удалить?"
            @confirm="removeForm"
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
            @click="submit"
          >
            <a-icon type="check" />
            {{ form.id ? $t("Save") : $t("Add") }}
          </a-button>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>

<script>
import InputFileItem from "@/components/utils/input-file-item"
// import { required } from "vuelidate/lib/validators"

const newsDefaultFields = () => ({
  title: {
    uz: "",
    oz: "",
    ru: "",
    en: "",
    qr: ""
  },
  urls: []
})

export default {
  components: {
    "image-upload": () => import("@/components/utils/image-upload"),
    InputFileItem
  },
  data: () => ({
    // eslint-disable-next-line no-undef
    langTab: $langPrefix,
    loading: false,
    pending: false,

    tabPane: "content",
    form: { ...newsDefaultFields() },
    fileList: [],
    main_image: null,
    video_file: [],
    video_poster_file: null,
    video_input: {
      file_type: 1,
      file: ""
    },
    emptyTitle: false,
    current_slug: "",
    errors: {
      slug: ""
    },
    addFileList: [],
    videoUploaadTypes: [
      {
        id: 1,
        title: {
          uz: "Link orqali ulash",
          oz: "Link orqali ulash",
          qr: "Link orqali ulash",
          en: "Link orqali ulash",
          ru: "Link orqali ulash"
        },
        file_type: 1
      },
      {
        id: 2,
        title: {
          uz: "Serverga yuklash",
          oz: "Serverga yuklash",
          qr: "Serverga yuklash",
          en: "Serverga yuklash",
          ru: "Serverga yuklash"
        },
        file_type: 2
      }
    ],
    video_link: "",
    urls: [],
    showLinkWarn: false,
    poster_url: ""
  }),
  computed: {
    isTitleNull() {
      return !!(
        !this.form.title.uz &&
        !this.form.title.oz &&
        !this.form.title.ru &&
        !this.form.title.qr &&
        !this.form.title.en
      )
    },
    titlesCheck() {
      return !!(
        this.form.title.oz.$error ||
        this.form.title.uz.$error ||
        this.form.title.ru.$error
      )
    },
    filesList() {
      return (this.form && this.form.files) || []
    },
    photoList() {
      return this.form && this.form.photos
    },
    videoList() {
      return (this.form && this.form.videos) || []
    },
    tabName() {
      // if (this.$route.name == "gallery-detail") {
      //   if (this.form && this.form.type !== "") {
      //     if (this.form.type == 0) {
      //       return ["photo"]
      //     }

      //     if (this.form.type == 1) {
      //       return ["video"]
      //     }
      //   }
      //   return []
      // }

      // if (this.$route.name == "gallery-create" && this.$route.params.type) {
      //   if (
      //     ["photo", "video"].includes(this.$route.params.type.toLowerCase())
      //   ) {
      //     return [this.$route.params.type.toLowerCase()]
      //   }
      // }

      // return ["photo", "video"]

      return [this.$route.query && this.$route.query.type]
    },
    selectedImage() {
      return 1
    }
  },
  watch: {
    $route: {
      handler: "fetchData",
      immediate: true
    }
  },

  mounted() {
    console.log(this.$route)
    // this.video_input.file_type
    this.$on("update:slug", this.onSlugChange)
  },

  // validations: {
  //   form: {
  //     position: {
  //       required
  //     }
  //   }
  // },

  methods: {
    handlePoster(e) {
      console.log(e.target.files[0])
      this.poster_url = URL.createObjectURL(e.target.files[0])
      this.form.poster = e.target.files[0]
    },
    check2Null(arg) {
      const r = Object.values(arg).every((item) => !item)

      // console.log("check2Null", r);

      return r
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
      } catch (error) {
        console.log("translitAction error", error)
      }
    },
    copySlug() {
      this.copyStringToClipboard(
        `/${(this.tabName && this.tabName[0]) || "gallery"}/${this.form.slug}`
      )
      this.$message.success("ЧПУ скопирован")
    },
    onSlugChange(e) {
      const text = (e.target.value || "")
        .replace(/( )/gi, "-")
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\\]/gi, "")

      this.slugCheck({ table: "post", slug: text })

      this.form.slug = text
    },
    async fetchData() {
      this.fileList = []
      this.video_file = null

      if (this.$route.params.id) {
        this.loading = true
        try {
          const data = await this.$store.dispatch("gallery/detail", {
            id: this.$route.params.id,
            type: this.$route.query && this.$route.query.type
          })
          console.log("DATA", data)
          this.poster_url = data.poster
          this.video_file = data.videos
          delete data.poster
          delete data.videos

          if (data) {
            console.log("fetchData", data)
            this.$set(this, "form", {
              ...data,
              title: {
                uz: data.title_uz,
                ru: data.title_ru,
                oz: data.title_oz,
                en: data.title_en,
                qr: data.title_qr
                // ...this.langKeys,
                // ...data.title
              }
            })
            this.urls = data.urls
            this.form.urls = []
            console.log("afterForm", this.form)

            // this.video_file = (this.form && this.form.videos) || []

            this.$set(this, "current_slug", this.form.slug)

            // if (this.videoList && this.videoList.length) {
            //   const sortedList = this.videoList.sort((a, b) => b.id - a.id)
            //   this.video_input = {
            //     file: sortedList[0].file,
            //     file_type: +sortedList[0].file_type
            //   }
            // }
          }
        } catch (err) {
          console.log(err)
          this.loading = false
        }

        this.loading = false
      }
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
    tabPaneChangeHandler(arg) {
      // tinymce reload fix, !!! important
      this.tabPane = arg
    },
    async submit() {
      // console.log("submit!");

      if (this.check2Null(this.form.title)) {
        this.emptyTitle = true
        return
      }

      // if (this.errors.slug && this.current_slug != this.form.slug) {
      //   this.$message.error("ЧПУ занят, введите другое")
      //   return
      // }

      if (this.form.file_type == 4 && !this.video_poster_file) {
        this.$message.error("Выберите постер для видео")
        return
      }
      let cloneForm = { ...this.form }
      cloneForm.title_uz = this.form.title.uz
      cloneForm.title_oz = this.form.title.oz
      cloneForm.title_ru = this.form.title.ru
      cloneForm.title_en = this.form.title.en
      cloneForm.title_qr = this.form.title.qr
      delete cloneForm.title

      this.pending = true
      try {
        const f = new FormData()
        // console.log(this.fileList)

        if (this.tabName.includes("photo")) {
          this.fileList.map((item) => {
            item &&
              item.fileTarget &&
              f.append("photos", item.fileTarget, item.uzid + ".jpg")
          })
        }
        // console.log("video input", this.form)

        if (
          this.$route.query &&
          this.$route.query.type == "video" &&
          this.video_file
        ) {
          // if (this.video_input.file_type == 1) {
          this.video_file.forEach((item) => {
            !item.id && f.append("videos", item, item.name)
          })
          // } else {
          //   f.append(
          //     "videos",
          //     this.video_input.file,
          //     this.video_input.file.name
          //   )
          // }
          // f.append("type", this.video_input.file_type)
        }

        if (this.video_poster_file) {
          f.append("thumbnail", this.video_poster_file)
        }

        if (this.form.id) {
          this.form.title_uz = this.form.title.uz
          this.form.title_qr = this.form.title.qr
          this.form.title_oz = this.form.title.oz
          this.form.title_en = this.form.title.en
          this.form.title_ru = this.form.title.ru
        }

        for (let k in this.form) {
          // eslint-disable-next-line no-prototype-builtins
          if (k != "title" && k != "photos" && k != "urls" && k != "videos") {
            f.append(k, this.form[k])
          } else if (k == "urls") {
            this.form[k] &&
              this.form[k].length &&
              this.form[k].forEach((url) => {
                f.append("urls", url)
              })
          }
        }

        if (!this.form.id) {
          f.append("title_uz", this.form.title.uz)
          f.append("title_qr", this.form.title.qr)
          f.append("title_oz", this.form.title.oz)
          f.append("title_en", this.form.title.en)
          f.append("title_ru", this.form.title.ru)
        }
        if (this.form.poster) {
          f.append("poster", this.form.poster, this.form.poster.name)
        }

        const req = {
          method: this.form.id ? "update" : "create",
          slug:
            this.$route.query && this.$route.query.type == "video"
              ? "Video"
              : "Photo"
        }

        // console.log(f, "formdata");

        const data = await this.$store.dispatch(
          `gallery/${req.method}ItemAction${req.slug}`,
          {
            id: this.form.id,
            data: f
          }
        )
        this.ISVALID(data, () => {
          this.$router.push({
            name: "gallery",
            query: { tab: this.$route.query.type || "photo" }
          })
        })
        // if (this.resOK(data)) {
        // this.$message.success("Успешно сохранено")
        // }

        // console.log("submit", data);
      } catch (err) {
        console.log(err)
        this.pending = false
      }

      this.pending = false
    },
    handleVideoInput(e) {
      if (e.target.files && e.target.files[0]) {
        let video_file = Array.from(e.target.files) || []
        this.video_file =
          this.video_file && this.video_file.length > 0
            ? [...this.video_file, ...video_file]
            : [...video_file]

        this.$refs.videoRef.value = null
      }
    },

    handleVideoPosterInput(e) {
      if (e.target.files && e.target.files[0]) {
        this.video_poster_file = e.target.files[0]

        this.$refs.videoPosterRef.value = null
      }
    },

    async removeVideo(arg) {
      // if (this.form && this.form.files) {
      //   const f = this.form.files.findIndex((item) => item.id == arg.id)

      //   if (f != -1) {
      //     const res = await this.$store.dispatch("gallery/removeItemActionVideo", [arg.id])

      //     if (res) {
      //       this.form.splice(f, 1)
      //     }
      //   }
      // }
      console.log(arg)
      if (this.video_file && this.video_file.length) {
        const f =
          arg && arg.id
            ? this.video_file.findIndex((item) => item.id == arg.id)
            : -1
        if (f != -1) {
          // let id = this.$route.params && this.$route.params.id
          // const res = await this.$store.dispatch(
          //   "gallery/removeItemActionVideo",
          //   { id, videos: [arg.id] }
          // )
          const res = await this.$store.dispatch(
            "gallery/removeItemActionVideo",
            { videoId: this.$route.params.id, galleryId: arg.id }
          )
          if (res) {
            this.video_file.splice(f, 1)
          }
        } else {
          const f2 = this.video_file.findIndex((item) => item.name == arg.name)
          this.video_file.splice(f2, 1)
        }
      }
    },

    async removeForm() {
      try {
        const r = await this.$store.dispatch(
          "gallery/removeItemAction",
          this.form.id
        )
        if (r) {
          this.$message.success("Успешно удалено")
          this.$router.go(-1)
        }
      } catch (err) {
        console.log(err)
      }
    },

    activeImage(e) {
      // this.photoList.forEach((item, index) => {
      //   this.photoList[index].is_active = item.id == e
      // })
      let ind = this.photoList.findIndex((el) => el.id == e)
      this.photoList[ind].is_active = true
      this.$api.patch("/common/photo-gallery-attachments/update/" + e + "/")
    },

    addLink() {
      !this.form.urls.find((link) => link == this.video_link) &&
        this.isLink(this.video_link) &&
        this.form.urls.push(this.video_link) &&
        (this.video_link = "")
    },

    deleteLink(l) {
      this.form.urls = this.form.urls.filter((el) => el !== l)
    },

    async deleteLinkById(id) {
      await this.$api.delete(`/common/video-gallery-urls/delete/${id}`)
      this.urls = this.urls.filter((url) => url.id != id)
    },

    isLink(link) {
      let isLink =
        link.split("://")[0] == "https" || link.split("://")[0] == "http"
      this.showLinkWarn = !isLink
      return isLink
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
.urls {
  width: 100%;
}
.urls > p {
  display: inline-block;
}
.urlWarn {
  margin-top: 12px;
  color: red;
}
.gallery-image {
  margin-top: 20px;
}
.gallery-image img {
  width: 100%;
  height: 100%;
}
</style>
