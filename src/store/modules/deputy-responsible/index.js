export const actions = {
    async fetchList() {
      let res = await this.$api.get("/structure/orderproject/deputy-responsible/list/")
      return res && res.data
    },
    // deputy-initiative/create/
    async create(_, payload) {
      let res = await this.$api.post("/structure/orderproject/deputy-responsible/create/", payload)
      return res && res.status
    },
    async fetchDetail(_, id) {
      let res = await this.$api.get(`/structure/orderproject/deputy-responsible/detail/${id}/`)
      return res && res.data
    },
    async fetchCommissionDeputies() {
      const  {data} = await this.$api.get("/structure/deputy/list/");
      return data
    },
  }