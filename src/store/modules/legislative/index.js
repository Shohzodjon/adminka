export const actions = {
  async getDepartmentList() {
    const { data } = await this.$api.get("/structure/department/list/")
    return data
  }
}
