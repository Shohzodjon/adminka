export const state = () => ({
  commissions: []
})

export const mutations = {
  setCommissions(state, commissions) {
    state.commissions = commissions
  },

  deleteCommission(state, id) {
    state.commissions = state.commissions.filter((i) => i.id != id)
    console.log(state.commissions)
  }
}

export const actions = {
  async fetchCommissionDeputies() {
    const { data } = await this.$api.get("/structure/deputy/list/")
    return data
  },
  async fetchCommissions({ commit }) {
    const { data } = await this.$api.get("/structure/commission/list/")
    commit("setCommissions", data)
  },
  async fetchCommissionDetail(_, id) {
    const { data } = await this.$api.get(`/structure/commission/update/${id}/`)
    return data
  }
}

export const getters = {
  getCommissions: (state) => state.commissions
}
