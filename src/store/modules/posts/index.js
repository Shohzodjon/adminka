export const actions = {
  fetch(_, payload) {
    return this.$api
      .get("/cms/menu/" + payload.menu_id + "/posts/", {
        params: payload.params
      })
      .then((res) => {
        return res && res.data
      })
  },
  createPost(_, payload) {
    return this.$api.post("/cms/post/create/", payload).then((res) => {
      return res && res.data
    })
  },
  deletePost(_, payload) {
    return this.$api.delete("/cms/post/" + payload + "/delete/").then((res) => {
      return res
    })
  },
  async fetchPostComments(_, { id, status }) {
    const { data } = await this.$api.get(
      `/cms/post/${id}/comment/list/?status=${status || ""}`,
      {
        status
      }
    )
    return data
  }
}
