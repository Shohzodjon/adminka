import cloneDeep from "lodash/cloneDeep"

export default {
  data() {
    return {
      spoiler: {
        modalVisibility: false,
        title: "",
        content: "<p></p>",
        contentBox: ``,
        valid: null
      }
    }
  },
  methods: {
    appendToEditor() {
      if (this.spoiler.contentBox !== ``) {
        this.spoiler.modalVisibility.selection
          .getNode()
          .closest(
            "details"
          ).innerHTML = `<summary>${this.spoiler.title}</summary>${this.spoiler.content}`

        this.spoiler.contentBox = ``
        this.spoiler.valid = false
        this.spoiler.modalVisibility = false
      } else if (this.spoiler.title && this.spoiler.content) {
        this.spoiler.modalVisibility.insertContent(
          this.editorChangeHandler(
            `<details><summary>${this.spoiler.title}</summary><p>${this.spoiler.content}</p></details><br>`
          )
        )
        this.spoiler.valid = false
        this.spoiler.modalVisibility = false
      } else {
        this.spoiler.valid = true
      }

      this.spoiler.title = ""
      this.spoiler.content = ""
      this.spoiler = cloneDeep(this.spoiler)
    },

    spoilerHandler() {
      if (
        this.spoiler.modalVisibility.selection.getNode().closest("details") !==
        null
      ) {
        this.spoiler.contentBox = this.spoiler.modalVisibility.selection
          .getNode()
          .closest("details")

        this.spoiler.title =
          this.spoiler.contentBox.querySelector("summary").textContent
        this.spoiler.content =
          this.spoiler.contentBox.querySelector("p").textContent
      }
    },
    closeSpoilerModal() {
      this.spoiler.valid = false
      this.spoiler.modalVisibility = false
    },
    openStoreModal() {
      this.modalVisible = true
    }
  }
}
