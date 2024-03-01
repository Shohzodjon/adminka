export const state = () => ({
  list: []
})

export const getters = {
  list: (state) => state.list || [],
  wanted: (state) => state.list.filter((item) => item.Type == 1) || [],
  missing: (state) => state.list.filter((item) => item.Type == 2) || []
}

export const mutations = {
  setList: (state, payload) => (state.list = payload || []),
  deleteItem(state, payload) {
    const f = state.list.findIndex((item) => item.id == payload)

    if (f != -1) {
      state.list = [...state.list.slice(0, f), ...state.list.slice(f + 1)]
    }
  }
}

export const actions = {
  fetch({ commit }, payload) {
    return this.$api
      .get("/structure/deputy/list/", {
        params: payload
      })
      .then((res) => {
        commit("setList", res.data)
        return res.data || []
      })
      .catch((err) => {
        console.log(err)
        return []
      })
  },

  upload({ commit, getters }, payload) {
    return this.$api
      .post("/wanted/create", payload)
      .then((res) => {
        // console.log(res)
        if (res && res.data) {
          commit("setList", [...getters.list, ...res.data])
        }

        return res
      })
      .catch((err) => {
        console.log(err)
        return err
      })
  },

  removeItemAction({ commit }, payload) {
    return this.$api
      .delete("/structure/deputy/delete/" + payload + "/")
      .then((res) => {
        commit("deleteItem", payload)
        return res
      })
      .catch((err) => {
        console.log(err)
        return err
      })
  },
  async fetchOkrugList() {
    const { data } = await this.$api.get(`/common/okrug/list/`)
    return data
  },
  async fetchUniversity() {
    const { data } = await this.$api.get("/common/university/list/")
    return data
  }
}
