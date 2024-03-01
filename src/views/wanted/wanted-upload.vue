<template>
  <a-col>
    <a-row class="content-title">
      <h2>
        Загрузка
        {{ +$route.params.type == 1 ? "розыска" : "без вести пропавшие" }}
      </h2>
    </a-row>

    <a-upload-dragger
      :before-upload="beforeUpload"
      :file-list="fileList"
      :multiple="false"
      :remove="handleRemove"
      accept="text/xml"
      name="file"
      style="height: 500px"
    >
      <p class="ant-upload-drag-icon">
        <a-icon type="inbox" />
      </p>
      <p class="ant-upload-text">
        Нажмите сюда или перетащите файл для загрузки
      </p>
      <!-- <p class="ant-upload-hint"></p> -->
    </a-upload-dragger>

    <a-button
      :disabled="fileList.length === 0"
      :loading="uploading"
      style="margin-top: 16px"
      type="primary"
      @click="handleUpload"
    >
      {{ uploading ? "Загружается..." : "Загрузить на сервер" }}
    </a-button>
  </a-col>
</template>
<script>
export default {
  data: () => ({
    fileList: [],
    uploading: false
  }),
  computed: {
    t() {
      return {
        1: {
          uz: "",
          oz: "",
          ru: "разыскиваемых лиц",
          en: ""
        },
        2: {
          uz: "",
          oz: "",
          ru: "пропавых без вести",
          en: ""
        }
      }
    }
  },
  watch: {
    $route: {
      handler: "checkRouteParams",
      immediate: true
    }
  },
  methods: {
    checkRouteParams() {
      if (
        !this.$route.params.type ||
        +this.$route.params.type <= 0 ||
        +this.$route.params.type > 3
      ) {
        alert("Неправильный аргумент в параметрах запроса")
        return this.$router.push({ name: "wanted" })
      }
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    beforeUpload(file) {
      this.fileList = [file]
      return false
    },
    async handleUpload() {
      const { fileList } = this
      const formData = new FormData()
      fileList.forEach((file) => {
        formData.append("file", file)
        formData.append("type", this.$route.params.type)
      })

      this.uploading = true

      try {
        await this.$store.dispatch("wanted/upload", formData)
        this.$message.success("Загрузка успешно завершена")
      } catch (e) {
        console.log(e)
        this.$message.error(e)
        this.$sentry.captureMessage(e)
      }

      this.uploading = false
    },
    handleChange(info) {
      const status = info.file.status
      if (status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (status === "done") {
        this.$message.success(`${info.file.name} успешно загружен на сервер.`)
      } else if (status === "error") {
        this.$message.error(`Ошибка при загрузке ${info.file.name}.`)
      }
    }
  }
}
</script>

<style></style>
