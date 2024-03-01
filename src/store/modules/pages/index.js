export const state = () => ({
  list: []
})

export const getters = {
  list: (state) => state.list || []
}

export const mutations = {
  setList: (state, payload) => (state.list = payload),

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
      .get("/cms/menu/static/list/", {
        params: payload || {}
      })
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

  detail(_, payload) {
    return this.$api
      .get("/news/post/page/detail/" + payload)
      .then((res) => {
        if (res && res.data) {
          return res.data || {}
        }

        return {}
      })
      .catch((err) => {
        console.log(err)
        return {}
      })
  },

  createItemAction(_, payload) {
    return this.$api
      .post("/news/post/page/create", payload.data)
      .then((res) => {
        // commit('createItem', res.data);
        return res
      })
      .catch((err) => {
        console.log(err)
        return err
      })
  },

  updateItemAction(_, payload) {
    return this.$api
      .put("/news/post/page/update/" + payload.id, payload.data)
      .then((res) => {
        // commit('updateItem', res.data);
        return res
      })
      .catch((err) => {
        console.log(err)
        return err
      })
  },

  removeItemAction(_, payload) {
    return this.$api
      .delete("/news/post/page/delete/" + payload)
      .then((res) => {
        if (res && res.status >= 200) {
          // commit('deleteItem', payload);
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
