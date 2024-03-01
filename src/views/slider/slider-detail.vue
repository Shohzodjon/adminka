<template>
  <a-row type="flex">
    <a-col class="flex-1">
      <a-tabs type="card">
        <a-tab-pane key="content">
          <span slot="tab"> <a-icon type="project" />Содержимое </span>
          <!-- lang tabs -->
          <a-row class="flex-baseline" align="middle">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              Язык:
            </a-col>
            <a-col :span="12">
              <lang-tabs v-model="langTab" />
            </a-col>
          </a-row>

          <!-- title -->
          <a-row class="flex-baseline" align="middle">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              Заголовок
            </a-col>
            <a-col :span="12" class="sm-mb">
              <a-input
                v-model="sliderDetail['title_' + langTab]"
                :spell-check="false"
                :placeholder="$t('EnterTitle')"
              />
            </a-col>
          </a-row>

          <!-- editor -->
          <a-row align="middle">
            <a-col
              :span="6"
              style="padding-top: 4px; text-align: right; padding-right: 8px"
            >
              Контент
            </a-col>
            <a-col :span="12">
              <tinymce
                id="ga"
                v-model="sliderDetail['content_' + langTab]"
                :other_options="tinyOptions"
              />
            </a-col>
          </a-row>

          <!-- status toggle -->
          <a-row style="margin-top: 25px">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              Статус
            </a-col>
            <a-switch v-model="sliderDetail.status" />
          </a-row>

          <!-- visibity on head page -->
          <a-row style="margin-top: 25px">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              Поставить на главную
            </a-col>
            <a-switch v-model="sliderDetail.is_main" />
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="photo">
          <span slot="tab"> <a-icon type="picture" />Фото </span>
          <!-- upload photo -->
          <a-row style="margin-top: 25px" align="middle">
            <a-col
              :span="6"
              style="padding-top: 4px; text-align: right; padding-right: 8px"
            >
              Изображение
            </a-col>
            <a-col :span="12">
              <a-upload
                accept="image/jpeg, image/png"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                list-type="picture-card"
                :file-list="fileList"
                @preview="handlePreview"
                @change="handleChange"
              >
                <div v-if="!fileList.length">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">Выбрать</div>
                </div>
              </a-upload>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="video">
          <span slot="tab"> <a-icon type="video-camera" />Видео </span>
        </a-tab-pane>

        <a-tab-pane key="document">
          <span slot="tab"> <a-icon type="file" />Документы </span>
        </a-tab-pane>
      </a-tabs>

      <a-row type="flex" style="margin-top: 25px">
        <a-col :span="6" style="text-align: right; padding-right: 8px" />
        <a-col>
          <a-col>
            <a-button @click="$router.push({ name: 'slider' })">
              Отмена
            </a-button>

            <a-button
              style="margin-left: 10px"
              type="primary"
              :loading="uploading"
              @click="submitSlider"
            >
              Сохранить
            </a-button>
          </a-col>
        </a-col>
      </a-row>

      <a-modal
        :visible="previewVisible"
        :footer="null"
        @cancel="previewVisible = false"
      >
        <img alt="example" style="width: 100%" :src="previewImage" />
      </a-modal>
    </a-col>
  </a-row>
</template>

<script>
const sliderDefaultFields = {
  title_uz: "",
  title_oz: "",
  title_ru: "",
  title_en: "",
  content_uz: "",
  content_oz: "",
  content_ru: "",
  content_en: "",
  slug: "",
  image: "",
  status: true
}
export default {
  data: () => ({
    langTab: $langPrefix,
    fileList: [],
    previewVisible: false,
    previewImage: "",
    sliderDetail: sliderDefaultFields,
    uploading: false,
    loading: false
  }),
  watch: {
    $route: {
      handler: "fetchData",
      immediate: true
    }
  },

  methods: {
    fetchData() {
      this.loading = true
      this.$api
        .get("/admin/news/detail/" + this.$route.params.id)
        .then((res) => {
          if (res && res.data) {
            console.log(res)
            this.sliderDetail = res.data
          }
          this.loading = false
        })
        .catch((err) => {
          console.log(err)
          this.loading = false
        })
    },
    beforeUpload(file) {
      // console.log("file", file);
      this.fileList = [...this.fileList, file]
      return false
    },
    submitSlider() {
      this.uploading = true
      // eslint-disable-next-line no-unused-vars
      let { image, ...props } = this.sliderDetail
      let formdata = new FormData()

      for (let k in props) {
        // console.log(k, props[k])
        // eslint-disable-next-line
        if (props.hasOwnProperty(k)) {
          formdata.append(k, props[k])
        }
      }

      Array.from(this.fileList).forEach((item) =>
        formdata.append(`image`, item.originFileObj)
      )

      const createOrUpdate = {
        url: this.sliderDetail.id
          ? "/admin/slider/update/" + this.sliderDetail.id
          : "/admin/slider/create?",
        method: this.sliderDetail.id ? "put" : "post"
      }

      console.log(createOrUpdate)

      this.$api[createOrUpdate.method](createOrUpdate.url, formdata)
        .then((res) => {
          if (res && res.data) {
            console.log(res.data)
            if (res.data.id) {
              this.closeModal()
              this.fetchList()
            }
          }
          this.uploading = false
        })
        .catch((err) => {
          console.log(err)
          this.uploading = false
        })
    },
    addSlider() {
      this.fileList = []
      this.sliderDetail = { ...sliderDefaultFields }
      this.modal.title = "Добавить слайдер"
      this.modal.state = true
    },
    editSlider(item) {
      // eslint-disable-next-line no-unused-vars
      const { created, updated, ...props } = item

      this.sliderDetail = props
      if (props.image) {
        this.previewImage = this.filesUrl + props.image
        this.fileList = [
          {
            uid: "-1",
            name: props.image,
            percent: 100,
            status: "done",
            thumbUrl: this.filesUrl + props.image
          }
        ]
      }

      this.modal.title = "Редактировать слайдер"
      this.modal.state = true
    },
    handlePreview(file) {
      console.log(file)
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    handleChange({ fileList }) {
      this.fileList = fileList
    },
    handleTabChange() {
      alert(1)
    }
  }
}
</script>
