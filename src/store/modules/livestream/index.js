export const actions = {
  async fetchLivestreamDetail(_, id) {
    const { data } = await this.$api.get(`/structure/livestream/${id}/`)
    return data
  },
  async fetchLivestreamList() {
    const { data } = await this.$api.get(`/structure/livestream/list/`)
    return data
  }
}
