export const actions = {
  async fetchPostCommnetsList(_, params) {
    const { data } = await this.$api.get("/cms/post/comment/list/", {
      params: params
    })
    return data
  },
  async fetchPostCommentById(_, id) {
    const { data } = await this.$api.get(`/cms/post/comment/${id}/`)
    return data
  },
  async fetchLawsCommentsList(_, params) {
    const { data } = await this.$api.get(
      "/structure/orderproject/comment/admin/list/",
      {
        params: params
      }
    )
    return data
  }
}
