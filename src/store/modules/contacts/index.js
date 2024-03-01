export const state = () => ({})

export const mutations = {}

export const actions = {
  async fetchContacts() {
    const { data } = await this.$api.get(`/cms/contact/1/update/`)
    return data
  }
}
