export const actions = {
  async fetchDeputies(_, payload) {
    const { data } = await this.$api.get(
      `/structure/committee/${payload}/deputy/list/`
    )
    return data
  },
  async fetchAllDeputies(_, params) {
    const { data } = await this.$api.get("/structure/deputy/list/", {
      params
    })
    return data
  }
}
