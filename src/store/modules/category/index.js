import store from "@/store"
import { i18n } from "@/assets/js/vue-i18n-init"

export const state = () => ({
  list: []
})

export const getters = {
  list: (state) => state.list || [],
  sortedList(state) {
    return state.list && state.list.sort((a, b) => b.is_main - a.is_main)
  }
}

export const mutations = {
  setList(state, payload) {
    state.list = payload
  },
  createItem(state, payload) {
    // console.log('category createItem', payload);
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
  async fetch({ commit }, params) {
    try {
      const { data } = await store.$api.get("/cms/menu/non-static/list/", {
        params: params
      })

      // console.log('news/category/list', data)
      commit("setList", data)

      return data || []
    } catch (error) {
      console.log(error)
      return []
    }
  },
  async fetchById(_, group_id) {
    if (!group_id) {
      return
    }
    try {
      const { data } = await store.$api.get("/news/category/list/" + group_id)
      return data || []
    } catch (error) {
      console.log(error)
    }
  },

  fetchWithParams(_, { params, category_slug }) {
    return store.$api
      .get("/news/post/list", {
        params: {
          ...params,
          params: JSON.stringify({ category_slug: category_slug })
        }
      })
      .then((res) => (res && res.data) || {})
      .catch((err) => {
        console.error(err)
      })
  },

  async detail(_, category_id) {
    if (!category_id) {
      return
    }
    try {
      const { data } = await store.$api.get(
        "/news/category/detail/" + category_id,
        {
          headers: {
            CO: "",
            "Accept-Language": ""
          }
        }
      )
      return data || null
    } catch (error) {
      console.log(error)
    }
  },

  // // get category posts
  // async posts(_, category_id) {
  //   try {
  //     const { data } = await store.$api.get('/news/post/list/' + category_id)
  //
  //     return data || []
  //   } catch (e) {
  //     console.log(e)
  //   }
  // },

  createItemAction({ commit }, payload) {
    return this.$api
      .post("/news/category/create", payload)
      .then((res) => {
        // console.log('category createItemAction res', res.data);
        commit("createItem", {
          ...res.data,
          title: JSON.parse(res.data.title)[i18n.locale]
        })
        // commit('group/updateGroupCategory', res.data, { root: true })
      })
      .catch((err) => {
        console.log(err)
      })
  },
  updateItemAction({ commit }, payload) {
    return this.$api
      .put("/news/category/update/" + payload.id, payload.data)
      .then((res) => {
        // console.log('category updateItemAction', res);
        commit("updateItem", {
          ...res.data,
          title: JSON.parse(res.data.title)[i18n.locale]
        })
        // commit('group/updateGroupCategory', res.data, { root: true })
      })
      .catch((err) => {
        console.log("category", err)
      })
  },
  removeItemAction({ commit }, payload) {
    return this.$api
      .delete("/news/category/delete/" + payload)
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
