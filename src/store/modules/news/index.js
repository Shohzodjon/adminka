import store from "@/store"

export const state = () => ({
  list: []
})

export const getters = {
  usersList: (state) => state.list || []
}

export const mutations = {
  setList: (state, payload) => (state.list = payload),
  createItem(state, payload) {
    state.list = [
      ...state.list,
      {
        ...payload,
        title: JSON.parse(payload.title)
      }
    ]
  },
  updateItem(state, payload) {
    const findIndex = state.list.findIndex((item) => item.id == payload.id)
    if (findIndex !== -1) {
      state.list = [
        ...state.list.slice(0, findIndex),
        payload,
        ...state.list.slice(findIndex + 1)
      ]
    }
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
  fetch: () => store.$api.get("/admin/news/list"),
  async fetchByCategory(_, category_id) {
    const { data } = await this.$api.get(
      "/post/list/by-category/" + category_id
    )

    return data || []
  },
  async fetchByGroup(_, group_id) {
    const { data } = await this.$api.get("/post/list/by-group/" + group_id)

    return data || []
  },
  createItemAction({ commit }, payload) {
    return this.$api
      .post("/news/post/create", payload)
      .then((res) => {
        // console.log(res);
        commit("createItem", res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  },
  updateItemAction({ commit }, payload) {
    return this.$api
      .put("/news/post/update/", payload)
      .then((res) => {
        // console.log(res);
        commit("updateItem", res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  },
  deleteItemAction({ commit }, payload) {
    return this.$api
      .delete("/news/post/delete/" + payload)
      .then((res) => {
        // console.log(res);
        commit("deleteItem", payload)
        return res
      })
      .catch((err) => {
        console.log(err)
        return err
      })
  }
}
