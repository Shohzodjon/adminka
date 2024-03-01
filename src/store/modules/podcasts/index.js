export const actions = {
  async fetchPodcastsList() {
    const { data } = await this.$api.get("/common/podcast/list/")
    return data
  },
  async fetchPodcastById(_, id) {
    const { data } = await this.$api.get(`/common/podcast/update/${id}/`)
    return data
  }
}
