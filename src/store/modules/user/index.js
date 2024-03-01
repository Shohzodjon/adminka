import store from "@/store"

export const state = () => ({
  list: []
})

export const getters = {
  usersList: (state) => state.list || []
}

export const mutations = {
  createItem(state, payload) {
    state.list = [...state.list, payload]
  },
  updateItem(state, payload) {
    const findIndex = state.list.findIndex((item) => item.id == payload.id)
    if (findIndex != -1) {
      state.list = [
        ...state.list.slice(0, findIndex),
        payload,
        ...state.list.slice(findIndex + 1)
      ]
    }
  },
  deleteItem(state, payload) {
    const findIndex = state.list.findIndex((item) => item.id == payload.id)
    if (findIndex != -1) {
      state.list = [
        ...state.list.slice(0, findIndex),
        ...state.list.slice(findIndex + 1)
      ]
    }
  }
}

export const actions = {
  fetchList: () => store.$api.get("/account/user/list/"),
  detail: (_, payload) =>
    store.$api.get("/account/user/detail/" + payload + "/"),
  async createItemAction({ commit }, payload) {
    let clonePaylaod = payload
    delete clonePaylaod.id
    try {
      const res = await this.$api.post("/account/user/create/", clonePaylaod)
      commit("createItem", res.data)
      return res
    } catch (e) {
      console.error(e)
      return e
    }
  },
  async updateItemAction({ commit }, payload) {
    try {
      const res = await this.$api.put(
        "/account/user/update/" + payload.id + "/",
        payload
      )
      commit("updateItem", res.data)
      return res
    } catch (e) {
      console.error(e)
    }
  },
  deleteItemAction({ commit }, payload) {
    this.$api
      .delete("/account/user/delete/" + payload + "/")
      .then((res) => {
        // console.log(res);
        commit("deleteItem", res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
