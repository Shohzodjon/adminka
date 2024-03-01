export const actions = {
  async fetchFriendshipGroup() {
    const { data } = await this.$api.get("/structure/deputyfriendship/list/")
    return data
  },
  async fetchDeputyList() {
    const { data } = await this.$api.get("/structure/deputy/list/")
    return data
  },
  async fetchFriendshipGroupById(_, id) {
    const { data } = await this.$api.get(
      `/structure/deputyfriendship/update/${id}/`
    )
    return data
  }
}
