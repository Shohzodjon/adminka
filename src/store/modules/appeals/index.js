export const actions = {
  async getAppeals(_, { params }) {
    const { data } = await this.$api.get("/appeals/list/", {
      params
    })
    return data
  },
  async getAppealsById(_, id) {
    const { data } = await this.$api.get(`/appeals/${id}/`)
    return data
  },
  async getResponseById(_, id) {
    const { data } = await this.$api.get(`/appeals/response/${id}/`)
    return data
  }
}
