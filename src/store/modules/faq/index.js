export const state = () => ({
  list: []
})

export const getters = {
  list: (state) => state.list || [],
  sortedList: (_, getters) =>
    getters.list
      .map((item) => ({
        ...item,
        answer: item.answer && JSON.parse(item.answer),
        question: item.question && JSON.parse(item.question)
      }))
      .sort((a, b) => a.position - b.position) || []
}

export const mutations = {
  setList(state, payload) {
    state.list = payload || []
  },

  deleteItem(state, payload) {
    const findIndex = state.list.findIndex((item) => item.id == payload)
    if (findIndex != -1) {
      state.list = [
        ...state.list.slice(0, findIndex),
        ...state.list.slice(findIndex + 1)
      ]
    }
  }
}

export const actions = {
  fetch({ commit }) {
    return this.$api
      .get("/faq/list")
      .then((res) => {
        commit("setList", (res.data && res.data.results) || [])
        return (res && res.data) || []
      })
      .catch((err) => {
        console.log(err)
      })
  },
  detail(_, payload) {
    return this.$api
      .get("/faq/detail/" + payload)
      .then((res) => {
        return (res && res.data) || {}
      })
      .catch((err) => {
        console.log(err)
      })
  },
  createItemAction(_, payload) {
    return this.$api
      .post("/faq/create", payload.data)
      .then((res) => {
        // console.log('faq createItemAction res', res.data);
        return res.data || {}
      })
      .catch((err) => {
        console.log(err)
      })
  },
  updateItemAction(_, payload) {
    return this.$api
      .put("/faq/update/" + payload.id, payload.data)
      .then((res) => {
        // console.log('faq updateItemAction', res);
        return res.data || {}
      })
      .catch((err) => {
        console.log("faq", err)
      })
  },
  removeItemAction({ commit }, payload) {
    return this.$api
      .delete("/faq/delete/" + payload)
      .then((res) => {
        // console.log(res);
        if (res.status >= 200 && res.status < 300) {
          commit("deleteItem", payload)
          return true
        }
      })
      .catch((err) => {
        console.log(err)
        return false
      })
  }
}
