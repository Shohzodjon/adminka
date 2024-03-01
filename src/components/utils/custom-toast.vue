<template>
  <div id="custom_toast">
    <div id="toast_list" />
  </div>
</template>

<script>
export default {
  name: "CustomToast",
  props: {
    messages: {
      type: Array,
      default() {
        return []
      }
    },
    tags: {
      type: Array,
      default() {
        return []
      }
    },
    danger: {
      type: Boolean,
      default() {
        return false
      }
    },
    success: {
      type: Boolean,
      default() {
        return false
      }
    },
    info: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  mounted() {
    let extraClass = this.danger ? "danger" : this.success ? "success" : "info"
    // let len =
    //   (this.messages && this.messages.length) || (this.tags && this.tags.length)
    function showToasts() {
      let childs = Array.from(document.getElementById("toast_list").childNodes)
      setTimeout(() => {
        childs.forEach((el) => {
          el.style.opacity = 1
        })
      }, 500)
      setTimeout(() => {
        childs.forEach((el) => {
          el.style.opacity = 0
        })
      }, 4500)
      //   }, 2500 * len)
    }

    function createToast(msg, type) {
      let toast = document.createElement("div")
      toast.className = `custom_toast ${extraClass}`
      type == "msg" && (toast.innerHTML = `<p>${msg}</p>`)
      type == "tag" && (toast.innerHTML = `${msg}`)
      document.getElementById("toast_list").appendChild(toast)
    }
    this.messages &&
      this.messages.length > 0 &&
      this.messages.forEach((el) => {
        createToast(el, "msg")
      })
    this.tags &&
      this.tags.length > 0 &&
      this.tags.forEach((el) => {
        createToast(el, "tag")
      })
    showToasts()
  }
}
</script>

<style scoped>
.success {
  color: #4f8a10 !important;
  background-color: #dff2bf !important;
}
.info {
  color: #00529b !important;
  background-color: #bde5f8 !important;
}
.danger {
  color: #d8000c !important;
  background-color: #ffd2d2 !important;
}
#custom_toast {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
}
#toast_list {
  min-width: 200px;
}
.custom_toast {
  /* display: block; */
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  /* justify-content: center; */
  border-radius: 4px;
  margin-bottom: 10px;
  /* color: #d8000c;
  background-color: #ffd2d2; */
  font-family: sans-serif;
  opacity: 0;
  transition: 2s;
  padding: 10px 8px;
  font-size: 16px;
}
.custom_toast > p {
  margin: 0;
  padding: 0;
  width: 100%;
}
</style>
