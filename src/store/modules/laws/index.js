export const actions = {
  async fetchAllLaws() {
    const { data } = await this.$api.get(`/common/laws/list/`)
    return data
  },
  async fetchLawsById(_, id) {
    const { data } = await this.$api.get(`/common/laws/detail/${id}/`)
    return data
  }
}
