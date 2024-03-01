export const actions = {
  async fetchMistakes() {
    const { data } = await this.$api.get("/cms/spellingmistake/list/")
    return data
  }
}
