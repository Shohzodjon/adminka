<template>
  <div>
    <CoolLightBox :items="imgs" :index="idx" loop @close="idx = null" />
    <div v-if="loadingPhotoStore">
      <div align="middle">
        <a-spin size="large" />
      </div>
    </div>
    <template v-else>
      <span v-show="!croping" class="d-flex flex-column flex-1">
        <a-row class="sm-mb" style="margin-top: 20px; margin-bottom: 10px">
          <a-col :span="5">
            <a-popconfirm
              title="Вы действительно хотите удалить?"
              cancel-text="Нет"
              ok-text="Да"
              @confirm="removeImg(selectedCards)"
            >
              <a-button type="link" :disabled="cardsIsEmpty"
                >Удалить выбранные</a-button
              >
            </a-popconfirm>
          </a-col>
          <a-col :span="15">
            <a-button
              type="link"
              :disabled="cardsIsEmpty"
              @click="copySlug(selectedCards)"
              >Скопировать выбранные</a-button
            >
          </a-col>
          <a-col :span="4" align="right">
            <input
              ref="refStoreInput"
              type="file"
              accept="image/jpeg, image/png"
              hidden
              @change="handleImage"
            />
            <span class="mr-1">
              <a-button type="primary" @click="$refs.refStoreInput.click()">
                Добавить
                <a-icon type="plus" />
              </a-button>
            </span>
          </a-col>
        </a-row>
        <div style="flex: 1">
          <a-row v-if="list == 0">
            <h3 style="text-align: center; margin-top: 30px">
              Список изображений пуст
            </h3>
          </a-row>

          <div class="image-container scroll-container">
            <div
              v-for="(item, index) in list"
              :key="index"
              class="img-item"
              style="box-size: border-box; padding: 5px"
            >
              <span
                style="
                  display: inline-block;
                  position: relative;
                  bottom: -30px;
                  left: 10px;
                "
              >
                <a-checkbox
                  :checked="selectedCards.includes(+item.id)"
                  :value="+item.id"
                  @change="toggleItemId(item.id)"
                />
              </span>
              <img :src="item.file" alt width="100%" @click="setIndex(index)" />
              <div class="panelIcon">
                <a-icon
                  type="copy"
                  title="Скопировать ссылку"
                  @click="copySlug(item.file)"
                />
                <a-popconfirm
                  title="Вы действительно хотите удалить?"
                  cancel-text="Нет"
                  ok-text="Да"
                  @confirm="removeImg(item.id)"
                >
                  <a-icon type="delete" title="Удалить" />
                </a-popconfirm>
              </div>
            </div>
          </div>
        </div>
        <a-pagination
          style="margin-top: 20px"
          :current="+pagination.page || 1"
          :total="+imagesCount || 0"
          :page-size="+pagination.limit || 15"
          @change="setPage"
        />
      </span>
      <span v-show="croping">
        <a-row class="content-title" type="flex" style="padding-top: 10px">
          <a-col :span="24">
            <h2 style="text-align: center">Обрезка изображение</h2>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24" class="mx-auto" align="middle">
            <cropper ref="cropper" class="cropper" :src="cropperImage" />
          </a-col>
        </a-row>

        <a-row style="margin-top: 20px">
          <a-col :span="6" />
          <a-col :span="12" class="mx-auto" align="middle">
            <a-button class="mr-10" @click="cancelCrop">Отменить</a-button>
            <a-button type="primary" @click="crop">Обрезать</a-button>
          </a-col>
        </a-row>
      </span>
    </template>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex"
import CoolLightBox from "vue-cool-lightbox"
import "vue-cool-lightbox/dist/vue-cool-lightbox.min.css"

export default {
  components: {
    CoolLightBox
  },
  slugPrefix: "image-store",
  data() {
    return {
      storeInput: null,
      cropperImage: null,
      croping: false,
      selectedCards: [],

      imgs: [],
      idx: null,

      pagination: {
        limit: 15,
        page: 1
      },
      loadingPhotoStore: false,
      cardsIsEmpty: true
    }
  },
  computed: {
    ...mapState({
      imagesCount: (state) => state.imageStorage.items_count,
      list: (state) => state.imageStorage.results
    })
  },
  watch: {
    $route: {
      handler: "fetch",
      immediate: true
    },
    "pagination.page": {
      async handler() {
        this.loadingPhotoStore = true
        try {
          await this.fetchImages(this.pagination)
        } catch (err) {
          this.$message.error(err)
        }
        this.loadingPhotoStore = false
      }
    }
  },

  mounted() {
    this.fetch()
  },

  methods: {
    ...mapActions("imageStorage", [
      "fetchImages",
      "removeImage",
      "submitImage"
    ]),
    setIndex(index) {
      this.idx = index
    },
    toggleItemId(itemId) {
      const f = this.selectedCards.findIndex((item) => +item == +itemId)
      if (f != -1) {
        this.selectedCards.splice(f, 1)
        this.cardsIsEmpty = false
      } else {
        this.selectedCards.push(itemId)
        this.cardsIsEmpty = false
      }

      if (this.selectedCards.length == 0) {
        this.cardsIsEmpty = true
      }
    },
    setPage(pageNumber) {
      this.pagination.page = pageNumber
    },
    async submit() {
      const res = await this.submitImage({})
      if (res) {
        await this.fetch()
        this.$message.success("Изображение добавлено")
      }
    },
    async removeImg(id) {
      const { page, limit } = this.pagination
      if (Array.isArray(id)) {
        for (let i of id) {
          await this.removeImage(i)
          await this.fetchImages({
            limit: +limit || 15,
            page: +page || 1
          })
          this.$message.success("Изображение удаленно")
        }
      } else {
        await this.removeImage(id)
        await this.fetchImages({
          limit: +limit || 15,
          page: +page || 1
        })
        this.$message.success("Изображение удаленно")
      }

      this.selectedCards = []
      this.cardsIsEmpty = true
    },
    async fetch() {
      this.loading = true
      const { page, limit } = this.pagination
      try {
        await this.fetchImages({
          limit: +limit || 15,
          page: +page || 1
        })
        this.imgs = []
        for (let item of this.list) {
          this.imgs.push({
            src: item.file,
            id: 1
          })
        }
      } catch (err) {
        console.error(err)
        this.$message.danger(err)
        this.loading = false
        return false
      }
      this.loadingPhotoStore = false
    },
    copySlug(link) {
      if (Array.isArray(link)) {
        const arr = []
        link.forEach((el) => {
          this.list.filter((item) => {
            item.id == el ? arr.push(`<img src='${item.file}'>`) : []
          })
        })

        if (arr.length != 0) {
          const str = arr.join(" ")
          this.copyStringToClipboard(str)
          this.$message.success("Ссылки выбранных изображений скопированы")
          this.$emit("pasteHandler", str)
        }
      } else {
        this.copyStringToClipboard(`${link}`)
        this.$emit("pasteHandler", `<img src='${link}'>`)
        this.$message.success("Ссылка изображения скопирована")
      }
      this.selectedCards = []
      this.cardsIsEmpty = true
    },
    handleImage(event) {
      const input = event.target

      if (input.files && input.files[0]) {
        const reader = new FileReader()

        reader.onload = (e) => {
          this.cropperImage = e.target.result
        }

        reader.readAsDataURL(input.files[0])
        this.croping = true
      }

      this.$refs.refStoreInput.value = null
    },
    async crop() {
      try {
        const { canvas } = this.$refs.cropper.getResult()
        this.storeInput = canvas.toDataURL()

        if (this.storeInput) {
          const storeToFile = await this.urltoFile(this.storeInput, "file.png")
          await this.submitImage({
            file: storeToFile
          })

          this.$message.success("Изображение успешно добавленно")
          this.croping = false

          const { page, limit } = this.pagination
          this.fetch()
          this.fetchImages({
            limit: +limit || 15,
            page: +page || 1
          })
        }
      } catch (error) {
        console.error(error)
        this.$message.error(error)
        return false
      }
    },

    cancelCrop() {
      this.croping = false
    }
  }
}
</script>

<style>
.image-container {
  width: auto;
  /* max-width: 1600px; */
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
}

.img-item {
  transition: 0.3s all;
  position: relative;
  /* width: 250px; */
  height: 175px;
  margin: 5px;
  width: calc(100% / 5 - 10px);
}

.img-item img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: 0.35s all;
  box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.1);
}

.img-item:hover {
  cursor: pointer;
  transform: scale(1.05);
}

.panelIcon {
  text-align: center;
  transition: 0.3s all;
  top: -50px;
  position: relative;
  height: 40px;
  box-sizing: border-box;
}

.img-item:hover .panelIcon {
  justify-content: center;
  display: flex;
  margin: 0 auto;
  box-sizing: border-box;
}

.img-item .panelIcon i {
  margin: 0 5px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  padding: 8px;
  opacity: 0;
  transition: 0.3s all;
}

.img-item:hover .panelIcon i {
  opacity: 1;
}

.img-item .panelIcon i:hover {
  transform: scale(1.1);
}

.img-item:hover .panelIcon i svg {
  color: #e54040;
  width: 1.4em;
  height: 1.4em;
}

.vue-advanced-cropper__background,
.vue-advanced-cropper__stretcher,
.vue-advanced-cropper__area,
.vue-advanced-cropper__image {
  max-height: 450px;
  width: auto;
}

@media (max-width: 1920px) and (min-width: 1600px) {
  .image-container {
    width: 100%;
  }
  .img-item {
    height: 175px;
    /* width: calc(100% / 8 - 10px); */
  }
}

@media (max-width: 1415px) and (min-width: 1270px) {
  /* .image-container {
    width: 90%;
  } */
  .img-item {
    height: 150px;
    /* max-width: 250px;
    width: 23.5%; */
  }
}

@media (max-width: 1269px) and (min-width: 1220px) {
  /* .image-container {
    width: 80%;
  } */
  .img-item {
    height: 150px;
    /* max-width: 200px;
    width: 32.5%; */
  }
}

@media (max-width: 1219px) {
  .image-container {
    width: 100%;
  }
  .img-item {
    height: 150px;
    /* max-width: 200px;
    width: 32.5%; */
  }
}
</style>
