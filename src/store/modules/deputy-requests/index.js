export const actions = {
    async fetchList() {
      let res = await this.$api.get("/structure/orderproject/deputy-request/list/")
      return res && res.data
    },
    // deputy-initiative/create/
    async create(_, payload) {
      let res = await this.$api.post("/structure/orderproject/deputy-request/create/", payload)
      return res && res.status
    },
    async fetchDetail(_, id) {
      let res = await this.$api.get(`/structure/orderproject/deputy-request/detail/${id}/`)
      return res && res.data
    },
  }