export const actions = {
  async fetchList() {
    let res = await this.$api.get("/structure/roles/list/")
    return res && res.data
  }
}
