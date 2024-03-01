export const state = () => ({
  list: []
})

export const getters = {
  list(state) {
    return (state && state.list) || []
  }
}

export const mutations = {
  setList: (state, payload) => (state.list = payload || []),

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
  fetch({ commit }, payload) {
    return this.$api
      .get("/cms/menu/list", {
        params: payload
      })
      .then((res) => {
        if (res && res.data) {
          commit("setList", res.data)
          return res.data || []
        }

        return []
      })
      .catch((err) => {
        console.log(err)
        return []
      })
  },

  fetchAll({ commit }, payload) {
    return this.$api
      .get("/menu/list/all", {
        params: payload
      })
      .then((res) => {
        if (res && res.data) {
          commit("setList", res.data)
          return res.data || []
        }

        return []
      })
      .catch((err) => {
        console.log(err)
        return []
      })
  },

  detail({ commit }, payload) {
    return this.$api
      .get("/cms/menu/update/" + payload + "/")
      .then((res) => {
        if (res && res.data) {
          commit("setList", res.data)
          return res.data
        }

        return []
      })
      .catch((err) => {
        console.log(err)
        return []
      })
  },

  async createItemAction({ commit }, payload) {
    try {
      const res = await this.$api.post("/cms/menu/create/", payload.data)
      commit("createItem", res.data)
      return res
    } catch (e) {
      console.error(e)
      return e
    }
  },

  async updateItemAction(_, payload) {
    try {
      const res = await this.$api.put(
        "/cms/menu/update/" + payload.id + "/",
        payload.data
      )
      return res
    } catch (e) {
      console.error(e)
      return e
    }
  },

  removeItemAction({ commit }, payload) {
    return this.$api
      .delete("/cms/menu/delete/" + payload)
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
  }
}
