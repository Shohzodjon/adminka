export const actions = {
  async fetchList() {
    let res = await this.$api.get("/structure/orderprojecttype/list/")
    return res && res.data
  },
  async create(_, payload) {
    let res = await this.$api.post(
      "/structure/orderprojecttype/create/",
      payload
    )
    return res && res.status
  },
  async fetchDetail(_, id) {
    let res = await this.$api.get(`/structure/orderprojecttype/update/${id}/`)
    return res && res.data
  }
}
