// import store from "@/store"

export const state = () => ({})

export const mutations = {}

export const actions = {
  async fetchInteractiveServices() {
    const { data } = await this.$api.get(`/common/interactive-services/list/`)
    return data
  },
  async fetchInteractiveServicesById(_, id) {
    const { data } = await this.$api.get(
      `/common/interactive-services/detail/${id}/`
    )
    return data
  }
}
