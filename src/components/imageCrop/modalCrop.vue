<template>
  <a-modal
    style="top: 20px"
    class="cropper-wrapper"
    title="Обрезать изображение"
    :visible="showForm"
    :confirm-loading="confirmLoading"
    :ok-button-props="{ props: { disabled: sendImg } }"
    width="900px"
    @ok="sendImage('base64')"
    @cancel="handleCancel"
  >
    <div class="content">
      <input
        v-show="false"
        ref="input"
        type="file"
        name="image"
        accept="image/*"
        @change="setImage"
      />

      <section class="cropper-area">
        <a-row type="flex" :gutter="16" class>
          <a-col class="state-category__col" :span="16">
            <a-spin v-if="loader" class="loader">
              <a-icon
                slot="indicator"
                type="loading"
                style="color: white; font-size: 164px"
                spin
              />
            </a-spin>
            <a-row
              type="flex"
              align="middle"
              justify="center"
              style="height: 100%"
            >
              <a-button
                v-show="uploadImg"
                style="align: center"
                type="primary"
                shape="round"
                icon="download"
                @click="showFileChooser"
              >
                Выбрать
              </a-button>
              <div class="img-cropper">
                <vue-cropper
                  v-show="!uploadImg"
                  :key="ratio"
                  ref="cropper"
                  :cropmove="debouncedQuery"
                  :zoom="debouncedQuery"
                  :aspect-ratio="ratio"
                  :src="imgSrc"
                  :container-style="{ minCropBoxWidth: '600', heigth: '600px' }"
                  preview=".preview"
                />
              </div>
            </a-row>
          </a-col>
          <a-col class="state-category__col" :span="8">
            <a-card header="Buttons">
              <div class="actions">
                <div>
                  <b v-if="sizeNote" style="color: red">Размер больше 2 Мб </b>
                </div>
                <div v-if="loader">Загрузка...</div>
                <div v-else-if="fileSIze.Num">
                  Размер после обрезки : {{ fileSIze.Num }} {{ fileSIze.Type }}
                </div>

                <a-row :gutter="16" style="margin-bottom: 15px">
                  <a-col v-show="!uploadImg" :span="6">
                    <a-button @click="showFileChooser">
                      <a-icon type="upload" />Изменить файл
                    </a-button>
                  </a-col>
                </a-row>

                <a-row style="margin-bottom: 15px">
                  <a-row style="margin-bottom: 15px">
                    <span>
                      <b>Соотношение</b>
                    </span>
                  </a-row>
                  <a-col :span="8">
                    <label>Ширинa</label>
                  </a-col>
                  <a-col :span="16">
                    <a-input-number
                      v-model="ratioWidthL"
                      placeholder="edit me"
                      :min="1"
                      @change="debouncedQuery"
                    />
                  </a-col>
                </a-row>

                <a-row style="margin-bottom: 15px">
                  <a-col :span="8">
                    <label>Высота:</label>
                  </a-col>
                  <a-col :span="16">
                    <a-input-number
                      v-model="ratioHeightL"
                      placeholder="edit me"
                      :min="1"
                      @change="debouncedQuery"
                    />
                  </a-col>
                </a-row>
                <a-row style="margin-bottom: 15px">
                  <a-col :span="8">
                    <label>Качество</label>
                  </a-col>
                  <a-col :span="16">
                    <a-input-number
                      v-model="qualityL"
                      :step="0.01"
                      :min="0.1"
                      :max="1"
                      @change="debouncedQuery"
                    />
                  </a-col>
                </a-row>

                <a-collapse :bordered="false">
                  <a-collapse-panel
                    key="1"
                    header="Настройки"
                    :disabled="uploadImg"
                  >
                    <a href="#" role="button" @click.prevent="zoom(0.2)"
                      >Увеличить</a
                    >
                    <a href="#" role="button" @click.prevent="zoom(-0.2)"
                      >Уменьшить</a
                    >
                    <a href="#" role="button" @click.prevent="move(-10, 0)"
                      >Сдвигать влево</a
                    >
                    <a href="#" role="button" @click.prevent="move(10, 0)"
                      >Сдвигать вправо</a
                    >
                    <a href="#" role="button" @click.prevent="move(0, -10)"
                      >Сдвигать вверх</a
                    >
                    <a href="#" role="button" @click.prevent="move(0, 10)"
                      >Сдвигать вниз</a
                    >
                    <a href="#" role="button" @click.prevent="rotate(90)"
                      >Повернуть + 90 градусов</a
                    >
                    <a href="#" role="button" @click.prevent="rotate(-90)"
                      >Повернуть -90 градусов</a
                    >
                    <a ref="flipX" href="#" role="button" @click.prevent="flipX"
                      >Повернуть X</a
                    >
                    <a ref="flipY" href="#" role="button" @click.prevent="flipY"
                      >Повернуть Y</a
                    >
                  </a-collapse-panel>
                </a-collapse>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </section>
    </div>
  </a-modal>
</template>
<script>
import vueCropper from "vue-cropperjs"
import "cropperjs/dist/cropper.css"
import debounce from "lodash/debounce"

// const debounce = (callback, wait) => {
//   let timeout = null;
//   return (...args) => {
//     const next = () => callback(...args);
//     clearTimeout(timeout);
//     timeout = setTimeout(next, wait);
//   };
// };

const STATUS_INITIAL = 0,
  STATUS_SAVING = 1,
  STATUS_SUCCESS = 2,
  STATUS_FAILED = 3

export default {
  components: {
    vueCropper
  },
  props: {
    value: {
      type: Boolean,
      default: () => false,
      required: true
    },
    quality: {
      type: Number,
      default: () => 1
    },
    ratioHeight: {
      type: Number,
      default: () => 1,
      required: true
    },
    ratioWidth: {
      type: Number,
      default: () => 1,
      required: true
    }
  },
  data() {
    return {
      sizeNote: false,
      fileExtension: "",
      imgSrc: "",
      cropImg: "",
      ModalText: "Content of the modal",
      ratioWidthL: null,
      ratioHeightL: null,
      confirmLoading: false,
      data: null,
      cropped: true,
      sendImg: true,
      uploadImg: true,
      qualityL: null,
      uploadedFiles: [],
      uploadError: null,
      currentStatus: null,
      uploadFieldName: "photos",
      fileSIze: {},
      loader: false,
      changes: false
    }
  },
  computed: {
    ratio() {
      return this.ratioWidthL / this.ratioHeightL
    },
    showForm: {
      set(value) {
        this.$emit("input", value)
      },
      get() {
        return this.value
      }
    },
    isInitial() {
      return this.currentStatus === STATUS_INITIAL
    },
    isSaving() {
      return this.currentStatus === STATUS_SAVING
    },
    isSuccess() {
      return this.currentStatus === STATUS_SUCCESS
    },
    isFailed() {
      return this.currentStatus === STATUS_FAILED
    }
  },
  watch: {},
  mounted() {
    this.ratioHeightL = this.ratioHeight
    this.ratioWidthL = this.ratioWidth
    this.qualityL = this.quality

    this.reset()
  },
  methods: {
    debouncedQuery: debounce(function () {
      this.cropImage()
    }, 600),
    urltoFile(url, filename, mimeType) {
      return fetch(url)
        .then(function (res) {
          return res.arrayBuffer()
        })
        .then(function (buf) {
          return new File([buf], filename, { type: mimeType })
        })
    },
    reset() {
      this.currentStatus = STATUS_INITIAL
      this.uploadedFiles = []
      this.uploadError = null
    },
    async cropImage() {
      this.cropped = false
      this.cropImg = await this.$refs.cropper
        .getCroppedCanvas()
        .toDataURL("image/jpeg", this.qualityL)
      this.calculateSize()
    },
    formatBytes(a, b) {
      if (a === 0) return "0 Bytes"
      const c = 1024
      const d = b || 2

      const e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

      const f = Math.floor(Math.log(a) / Math.log(c))

      const size = {
        // eslint-disable-next-line
        Num: parseFloat((a / Math.pow(c, f)).toFixed(d)),
        Type: e[f]
      }
      // return ${parseFloat((a / Math.pow(c, f)).toFixed(d))} ${e[f]};
      return size
    },

    calculateSize() {
      this.urltoFile(this.cropImg, "jpeg", "image/jpeg").then((file) => {
        // console.log("fileSize:",file);
        this.fileSIze = this.formatBytes(file.size, 0)
        this.loader = false

        if (file.size <= 1024 * 1024 * 2) {
          this.fileSIze = this.formatBytes(file.size, 0)
          this.sendImg = false
          this.sizeNote = false
        } else {
          this.sendImg = true
          this.sizeNote = true
        }
      })
    },
    sendImage(value) {
      if (value === "base64") {
        this.$emit("onSetImage", this.cropImg)
        this.showForm = false
      } else {
        let data = new FormData()
        data.append("name", "my-picture")
        data.append("file", this.cropImg)

        // let config = {
        //   header: {
        //     "Content-Type": "image/jpeg"
        //   }
        // };

        this.showForm = false
      }
    },

    flipX() {
      const dom = this.$refs.flipX
      let scale = dom.getAttribute("data-scale")
      scale = scale ? -scale : -1
      this.$refs.cropper.scaleX(scale)
      dom.setAttribute("data-scale", scale)
    },
    flipY() {
      const dom = this.$refs.flipY
      let scale = dom.getAttribute("data-scale")
      scale = scale ? -scale : -1
      this.$refs.cropper.scaleY(scale)
      dom.setAttribute("data-scale", scale)
    },
    getCropBoxData() {
      this.data = JSON.stringify(this.$refs.cropper.getCropBoxData(), null, 4)
    },
    getData() {
      this.data = JSON.stringify(this.$refs.cropper.getData(), null, 4)
    },
    move(offsetX, offsetY) {
      this.$refs.cropper.move(offsetX, offsetY)
    },

    rotate(deg) {
      this.$refs.cropper.rotate(deg)
    },
    setCropBoxData() {
      if (!this.data) return
      this.$refs.cropper.setCropBoxData(JSON.parse(this.data))
    },
    setData() {
      if (!this.data) return
      this.$refs.cropper.setData(JSON.parse(this.data))
    },
    setImage(e) {
      this.fileExtension = e.target.files[0].name.split(".").pop()
      this.$emit("onImageSelected", this.fileExtension)
      const file = e.target.files[0]
      if (file.type.indexOf("image/") === -1) {
        alert("Пожалуйста, выберите файл изображения")
        return
      }

      if (typeof FileReader === "function") {
        const reader = new FileReader()
        reader.onload = (event) => {
          this.imgSrc = event.target.result
          this.$refs.cropper.replace(event.target.result)
          this.uploadImg = false
        }
        reader.readAsDataURL(file)
        this.loader = true
        this.debouncedQuery()
      } else {
        alert("Sorry, FileReader API not supported")
      }
    },
    showFileChooser() {
      this.uploadImg = true
      this.$refs.input.click()
    },
    zoom(percent) {
      this.$refs.cropper.relativeZoom(percent)
    },

    handleCancel() {
      this.showForm = false
    }
  }
}
</script>

<style lang="scss">
.cropper-wrapper {
  min-width: 80vw;
  min-height: 80vh;
  .content {
    max-height: 70vh;
    overflow: hidden;
    overflow-y: scroll;
    .additional_actions {
      height: max-content;
      overflow: hidden;
      overflow-y: scroll;
      max-height: 200px;
    }
  }
  .actions {
    margin-top: 1rem;
  }
  .actions a {
    display: inline-block;
    padding: 5px 15px;
    background: #0062cc;
    color: white;
    text-decoration: none;
    border-radius: 3px;
    margin-right: 1rem;
    margin-bottom: 1rem;
  }
  textarea {
    width: 100%;
    height: 100px;
  }
  .preview-area {
    width: 307px;
  }
  .preview-area p {
    font-size: 1.25rem;
    margin: 0;
    margin-bottom: 1rem;
  }
  .preview-area p:last-of-type {
    margin-top: 1rem;
  }
  .preview {
    width: 100%;
    height: calc(372px * (9 / 16));
    overflow: hidden;
  }
  .crop-placeholder {
    width: 100%;
    height: 200px;
    background: #ccc;
  }
  .cropped-image img {
    max-width: 100%;
  }
  @media (max-width: 720px) {
    .state-category__col {
      flex: 0 0 100%;
      max-width: 100%;
      height: auto;
      padding: 15px 45px;
    }

    .state-category__main {
      padding-bottom: 15px;
    }
  }
  .dropbox {
    outline: 2px dashed grey; /* the dash box */
    outline-offset: -10px;
    background: lightcyan;
    color: dimgray;
    padding: 10px 10px;
    min-height: 200px; /* minimum height */
    position: relative;
    cursor: pointer;
  }

  .input-file {
    opacity: 0; /* invisible but it's there! */
    width: 100%;
    height: 200px;
    position: absolute;
    cursor: pointer;
  }

  .dropbox:hover {
    background: lightblue; /* when mouse over to the drop zone, change color */
  }

  .dropbox p {
    font-size: 1.2em;
    text-align: center;
    padding: 50px 0;
  }
  .button-my {
    width: 100%;
    height: 100%;
  }
}

.loader {
  opacity: 1;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  position: absolute;
  z-index: 999999;
  margin-top: 185px;
}
</style>
