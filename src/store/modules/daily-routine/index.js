export const actions = {
    async fetchList() {
      let res = await this.$api.get("/cms/post/agenda/list")
      return res && res.data
    },
    // deputy-initiative/create/
    async create(_, payload) {
      let res = await this.$api.post("/cms/post/agenda/create/", payload)
      return res && res.status
    },
    async fetchDetail(_, id) {
      let res = await this.$api.get(`/cms/post/agenda/detail/${id}/`)
      return res && res.data
    },
  
  }