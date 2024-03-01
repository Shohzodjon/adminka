export default {
  data() {
    return {}
  },
  methods: {
    ISVALID(res, clb) {
      console.log(res, "RES")
      try {
        if (res.status == 200 || res.status == 201) {
          clb && clb()
          this.$message.success(this.$t("successSaved"))
        } else {
          let data = null
          if (res.response && res.response.data) {
            data = res.response.data
          } else {
            data = res
            throw new Error(data.text)
          }

          Object.keys(data).forEach((i) => {
            if (Array.isArray(data[i])) {
              throw new Error(`${i}: ${data[i]}`)
            } else {
              const obj = data[i]
              Object.keys(obj).forEach((k) => {
                throw new Error(`${i}: ${obj[k][0]}`)
              })
            }
          })
        }
      } catch (e) {
        this.$message.error(e.message, 2, {
          position: "top"
        })
        console.error(e)
      }
    }
  }
}
