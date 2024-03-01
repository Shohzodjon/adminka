// import store from "@/store"

export const state = () => ({})

export const mutations = {}

export const actions = {
  async fetchUsefulLinks() {
    const { data } = await this.$api.get("/common/useful-links/list/")
    return data
  },
  async fetchUsefulLinksById(_, id) {
    const { data } = await this.$api.get(`/common/useful-links/update/${id}/`)
    return data
  }
}
