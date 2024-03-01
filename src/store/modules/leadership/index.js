import "@/store"

export const state = () => ({
  list: []
})

export const getters = {
  list: (state) => state.list || [],
  sortedList: (_, getters) =>
    getters.list.sort((a, b) => a.position - b.position)
}

export const mutations = {
  setList(state, payload) {
    state.list = payload || []
  },

  createItem(state, payload) {
    state.list = [...state.list, payload]
  },

  updateItem(state, payload) {
    const f = state.list.findIndex((item) => item.id == payload.id)

    if (f != -1) {
      state.list = [
        ...state.list.slice(0, f),
        payload,
        ...state.list.slice(f + 1)
      ]
    }
  },

  deleteItem(state, payload) {
    const f = state.list.findIndex((item) => item.id == payload)

    if (f != -1) {
      state.list = [...state.list.slice(0, f), ...state.list.slice(f + 1)]
    }
  }
}

export const actions = {
  fetch({ commit }) {
    return this.$api
      .get("/leadership/list")
      .then((res) => {
        if (res && res.data) {
          commit("setList", res.data)
          return res.data || []
        }
      })
      .catch((err) => console.log(err))
  },

  detail(_, payload) {
    return this.$api
      .get("/leadership/detail/" + payload)
      .then((res) => {
        if (res && res.data) {
          return res.data || {}
        }
      })
      .catch((err) => console.log(err))
  },

  createItemAction({ commit }, payload) {
    return this.$api
      .post("/leadership/create", payload.data)
      .then((res) => {
        commit("createItem", res.data)
        return res
      })
      .catch((err) => {
        console.log(err)
      })
  },

  updateItemAction({ commit }, payload) {
    return this.$api
      .put("/leadership/update/" + payload.id, payload.data)
      .then((res) => {
        commit("updateItem", res.data)
        return res
      })
      .catch((err) => {
        console.log(err)
      })
  },

  removeItemAction({ commit }, payload) {
    return this.$api
      .delete("/leadership/delete/" + payload)
      .then((res) => {
        if (res && res.status >= 200) {
          commit("deleteItem", payload)
          return true
        }

        return false
      })
      .catch((err) => {
        console.log(err)
        return false
      })
  },
  DeleteAvatar(_, payload) {
    return this.$api
      .delete("/leadership/avatar/delete/" + payload)
      .then((res) => {
        if (res && res.status >= 200) {
          return true
        }

        return false
      })
      .catch((err) => {
        console.log(err)
        return false
      })
  }
}
