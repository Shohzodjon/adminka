<template>
  <div class="d-flex">
    <a-col v-if="multiple">
      <a-row style="margin-bottom: 15px" type="flex">
        <a-button
          :disabled="isListHasCheckedItem"
          style="margin-bottom: 10px; margin-right: 10px"
          @click="deselectChecked"
        >
          Снять выделенные
        </a-button>
        <a-popconfirm
          :class="{ disabled: isListHasCheckedItem }"
          title="Вы действительно хотите удалить выбранные файли?"
          @confirm="deleteSelected"
        >
          <a-button
            :disabled="isListHasCheckedItem"
            style="margin-bottom: 10px; margin-right: 10px"
          >
            Удалить выделенные
          </a-button>
        </a-popconfirm>
        <a-popconfirm
          :class="{ disabled: !files.length }"
          title="Вы действительно хотите удалить вcе файли?"
          @confirm="deleteAll"
        >
          <a-button :disabled="!files.length" style="margin-bottom: 10px">
            Удалить все
          </a-button>
        </a-popconfirm>
      </a-row>
    </a-col>
    <div class="ant-upload-list ant-upload-list-picture-card flex-1">
      <!-- pictures to upload -->
      <draggable
        v-model="files"
        class="d-flex flex-column"
        handle=".dd-move-btn"
        v-bind="dragOptions"
        @end="emitDragChange"
      >
        <div
          v-for="(item, index) in files"
          :key="index"
          class="ant-upload-list-item dd-item-cursor fade-in"
        >
          <div class="ant-upload-list-item-info">
            <span style="height: 100%">
              <a
                class="ant-upload-list-item-thumbnail"
                href="#"
                rel="noopener noreferrer"
                target="_blank"
              >
                <!-- <img
                  v-if="item.id"
                  :alt="filesUrl + item.file"
                  :src="filesUrl + item.file"
                /> -->

                <img
                  v-if="item.id"
                  :alt="item.photo"
                  :src="item.photo || item.file"
                />
                <img v-else :alt="item.name" :src="toBlob(item.fileTarget)" />
              </a>
              <span :title="item.name" class="ant-upload-list-item-name">{{
                item.name
              }}</span>
            </span>
          </div>
          <a-row
            v-if="buttons"
            class="ant-upload-list-item-actions upload-actions-block"
            type="flex"
          >
            <div class="antd-upload-action-item__custom dd-move-btn">
              <a-icon type="drag" />
            </div>

            <!-- <div
              :key="Math.random().toString().slice(2)"
              :class="[
                'antd-upload-action-item__custom',
                { primary: selectedImage == item.id }
              ]"
              @click="selectImage(item.id, item)"
            >
              <a-icon type="arrow-up" />
            </div> -->
            <!-- <div
              :key="Math.random().toString().slice(2)"
              :class="['antd-upload-action-item__custom']"
              @click="activeImage"
            >
              <a-icon type="arrow-up" />
            </div> -->
            <div
              v-if="!notActive"
              :class="[
                'antd-upload-action-item__custom',
                { primary: item.is_active }
              ]"
              @click="activeImage(item.id, item.is_active)"
            >
              <a-icon type="arrow-up" />
            </div>

            <a-popconfirm
              :disabled="!files.length"
              title="Вы действительно хотите удалить?"
              @confirm="removeItem(item, index)"
            >
              <div class="antd-upload-action-item__custom">
                <a-icon type="delete" />
              </div>
            </a-popconfirm>
          </a-row>

          <a-checkbox
            v-if="multiple"
            :checked="item.checked"
            class="list-item__checkbox"
            @click.prevent="item.checked = !item.checked"
          />
        </div>
      </draggable>
    </div>
    <osg-cropper
      v-if="withCropper && showForm"
      v-model="showForm"
      :ratio-width="16"
      :ratio-height="9"
      :quality="0.7"
      @onImageSelected="setImageExtention"
      @onSetImage="getImage"
    />

    <div class="ant-upload ant-upload-select ant-upload-select-picture-card">
      <span
        class="ant-upload ant-upload-btn"
        role="button"
        tabindex="0"
        @click="showModal(true)"
      >
        <input
          ref="fileRef"
          accept="image/jpeg, image/png"
          style="display: none"
          type="file"
          :multiple="uploadMultiple"
          v-bind="$attrs"
          @change="fileInputHandler"
        />

        <div>
          <i class="anticon anticon-plus">
            <svg
              aria-hidden="true"
              class
              data-icon="plus"
              fill="currentColor"
              focusable="false"
              height="1em"
              viewBox="64 64 896 896"
              width="1em"
            >
              <path
                d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z"
              />
              <path
                d="M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8z"
              />
            </svg>
          </i>
          <div class="ant-upload-text">Выбрать</div>
        </div>
      </span>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable"

export default {
  components: {
    "osg-cropper": () => import("@/components/imageCrop/modalCrop"),
    draggable
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    selectedImage: {
      type: [Number, String],
      default: () => ""
    },
    methodName: {
      type: String,
      default: () => "common"
    },

    buttons: {
      type: Boolean,
      default: () => true
    },

    withCropper: {
      type: Boolean,
      default: () => true
    },

    multiple: {
      type: Boolean,
      default: () => false
    },

    hasMethod: {
      type: Boolean,
      default() {
        return false
      }
    },

    uploadMultiple: {
      type: Boolean,
      default() {
        return false
      }
    },

    notActive: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      fileExtension: "jpeg",
      showForm: false,
      files: [],
      selectedImages: []
    }
  },
  computed: {
    isListHasCheckedItem() {
      return !this.files.some((item) => item.checked)
    },
    checkedList() {
      return this.files.filter((item) => item.checked)
    }
  },
  watch: {
    list: {
      handler: "rebaseImages",
      immediate: true
    }
  },

  methods: {
    rebaseImages() {
      const list1 =
        (this.list &&
          this.list.map((item) => ({
            ...item,
            uzid: Math.random().toString().slice(2)
          }))) ||
        []
      // const list2 = this.files.map((item) => ({
      //   ...item,
      //   uzid: Math.random().toString().slice(2)
      // }))
      this.files = [...list1]

      console.log(this.files, "files")

      this.files.forEach((item) => {
        console.log(item, "item")
        if (item.is_main) {
          this.selectImage(item.uzid)
        }
      })

      this.files = this.files.slice().sort((a, b) => {
        if (a.is_main || a.position < b.position) {
          return -1
        }

        if (a.position > b.position) {
          return 1
        }

        return 0
      })
    },
    setImageExtention(e) {
      this.fileExtension = e
    },
    showModal(value) {
      // this.showForm = value;
      if (this.withCropper) this.showForm = value
      else {
        this.$refs.fileRef.click()
      }
    },
    emitDragChange() {
      // console.log(arg);
      this.$emit("change", this.files)
      setTimeout(() => this.$emit("drag-update"), 1000)
    },
    deleteAll() {
      let promises = []
      let all = this.files.map((item) => {
        return item && item.id
      })
      let id = this.$route.params && this.$route.params.id
      // this.files.forEach((file) => {
      // if (file.id) {
      promises.push(
        this.$api.patch(
          `/${this.methodName}/photo-gallery/${id}/photo-gallery-attachments/remove/`,
          { photos: all }
        )
      )
      // }
      // })

      Promise.all(promises)
        .then(() => {
          // console.log(res);
        })
        .then(() => {
          this.files = []
          this.selectImage("")
        })
    },
    deleteSelected() {
      let promises = []
      let noError = true

      let selectedImages = this.checkedList.map((item) => {
        return item && item.id
      })

      const notCheckedFiles = this.files.slice().filter((item) => !item.checked)
      let id = this.$route.params && this.$route.params.id
      this.files.forEach((file) => {
        if (file.id && file.checked) {
          let promise = this.$api.patch(
            `/${this.methodName}/photo-gallery/${id}/photo-gallery-attachments/remove/`,
            { photos: selectedImages }
          )
          promises.push(promise)
        }
      })

      Promise.all(promises)
        .then(
          () => {
            // console.log("res", res);
          },
          (err) => {
            console.log("err", err)
            noError = false
            this.$message.error("Ошибка при удалении файла")
          }
        )
        .then(() => {
          this.selectImage("")
          if (noError) {
            this.files = notCheckedFiles
          }
        })
    },
    deselectChecked() {
      this.files.forEach((item) => {
        if (item.checked) {
          item.checked = false
        }
      })
    },
    getImage(variable) {
      this.urltoFile(
        variable,
        this.fileExtension,
        `image/${this.fileExtension}`
      ).then((file) => {
        if (this.multiple) {
          this.$set(this, "files", [
            ...this.files,
            {
              fileTarget: file,
              checked: false,
              uzid: Math.random().toString().slice(2)
            }
          ])
        } else {
          this.$set(this, "files", [
            {
              fileTarget: file,
              checked: false,
              uzid: Math.random().toString().slice(2)
            }
          ])
        }
        // this.$set(this, "files", [
        //         {
        //           fileTarget: file,
        //           checked: false,
        //           uzid: Math.random()
        //             .toString()
        //             .slice(2)
        //         }
        //       ]);

        this.$emit("change", this.files)
      })
    },
    fileInputHandler(event) {
      if (event && event.target.files) {
        for (const key in event.target.files) {
          if (event.target.files[key]) {
            const element = event.target.files[key]
            if (element.size / 1024 / 1024 > 1) {
              this.$message.error("Fayl hajmi 1mb dan oshmasligi kerak")
              return false
            }
            // if key not equal to length
            if (!isNaN(key)) {
              if (this.multiple) {
                this.$set(this, "files", [
                  ...this.files,
                  {
                    fileTarget: element,
                    checked: false,
                    uzid: Math.random().toString().slice(2)
                  }
                ])
              } else {
                this.$set(this, "files", [
                  {
                    fileTarget: element,
                    checked: false,
                    uzid: Math.random().toString().slice(2)
                  }
                ])
              }
            }
          }
        }

        this.$emit("change", this.files)
      }

      this.$refs.fileRef.value = null
    },
    toBlob(file) {
      if (file) {
        return URL.createObjectURL(file)
      }
    },
    removeItem(listItem, itemIndex) {
      let id = this.$route.params && this.$route.params.id
      let arr = []
      arr.push(listItem.id)
      if (listItem.id && !this.hasMethod) {
        this.$api
          .patch(
            `/${this.methodName}/photo-gallery/${id}/photo-gallery-attachments/remove/`,
            { photos: arr }
          )
          .then((res) => {
            if (res.status == 204) {
              this.files.splice(itemIndex, 1)
              this.$router.go()
            }
          })
          .catch((err) => {
            console.log(err)
          })
        return
      } else if (this.hasMethod && listItem.id) {
        this.$emit("delete", listItem.id)
      }
      this.files.splice(itemIndex, 1)
    },
    urltoFile(url, filename, mimeType) {
      // console.log(url, filename, mimeType)
      return fetch(url)
        .then(function (res) {
          return res.arrayBuffer()
        })
        .then(function (buf) {
          return new File([buf], filename, { type: mimeType })
        })
    },
    selectImage(img) {
      // this.selectedImage = this.selectedImage == img ? '' : img;
      // console.log("img", img, item)
      // console.log(image)
      // this.selectedImages.push(image)
      // if (img) {
      //   this.files.forEach((item) => (item.is_main = item.uzid == img))
      // }

      // this.$emit("change", this.files)
      this.$emit("set-main-image", img)
      // this.$emit("activeImage", img)
    },
    activeImage(e, e1) {
      console.log(e1)
      this.$emit("set-main-image", e)
      console.log(this.list)
      this.files = []
      this.rebaseImages()
    }
  }
}
</script>
