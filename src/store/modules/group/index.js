import store from "@/store"
import { modules } from "@/assets/js/helper"

export const state = () => ({
  list: []
})

export const getters = {
  list: (state) => state.list
  // groupTitleById(state, payload) {
  //     const r = state.list.find(
  //         item => item.id == this.$route.params.grou_id
  //     );
  //     return r && r.title && r.title[this.$i18n.locale];
  // }
}

export const mutations = {
  setList(state, payload) {
    state.list = payload
  },
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
    // console.log('group deleteItem', payload);
    const findIndex = state.list.findIndex((item) => item.id == payload)
    if (findIndex != -1) {
      state.list = [
        ...state.list.slice(0, findIndex),
        ...state.list.slice(findIndex + 1)
      ]
    }
    // debugger
  },

  addGroupCategory(state, payload) {
    const copyList = state.list.slice(0)
    copyList.forEach((_, groupIndex) => {
      copyList[groupIndex].category = [
        ...copyList[groupIndex].category,
        payload
      ]
    })
    state.list = [...copyList]
  },
  updateGroupCategory(state, payload) {
    // console.log(payload);
    const copyList = state.list.slice(0)
    copyList.forEach((item, groupIndex) => {
      if (item.category) {
        item.category.forEach((cat, categoryIndex) => {
          if (cat.id == payload.id) {
            copyList[groupIndex].category[categoryIndex] = payload
          }
        })
      }
    })

    state.list = [...copyList]
  },
  // this.$store.dispatch('group/deleteCategoryFromGroup', {
  //     group_id: this.form.group_id,
  //     cat_id: sdsd,
  // })
  deleteGroupCategory(state, payload) {
    const { group_id, cat_id } = payload

    const copyList = state.list.slice(0)

    // copyList.foreEach((item, index) => {
    //     if (item.id == group_id) {
    //         if (item.category) {
    //             const findIndex = item.category.findIndex(cat => cat.id == cat_id)

    //             if (findIndex != -1)
    //                 item.category.splice(findIndex, 1)
    //         }
    //     }
    // })

    const w = copyList.map((item) => {
      if (item.id == group_id && item.category) {
        return {
          ...item,
          category: item.category.filter((cat) => cat.id != cat_id)
        }
      }
      return item
    })

    // console.log(w);

    state.list = w
  }
}

export const actions = {
  async fetch({ commit }, params) {
    const payload = ["/admin/group/list?"]
    if (params) payload.push(params)

    try {
      const { data } = await store.$api.get(payload.join("&"))

      commit("setList", data || [])
      return data || []
    } catch (error) {
      console.log(error)
    }
  },
  async fetchId(_, payload) {
    if (!payload) console.error("no payload in group fetchId")
    try {
      const { data } = await store.$api.get("/admin/group/detail/" + payload)
      return data || []
    } catch (error) {
      console.log(error)
    }
  },

  createItemAction({ commit }, payload) {
    const data = modules.dataToForm(payload)
    this.$api
      .post("/admin/group/create", data)
      .then((res) => {
        // console.log(res);
        commit("createItem", res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  },
  updateItemAction({ commit }, payload) {
    const data = modules.dataToForm(payload)
    this.$api
      .put("/admin/group/update/" + payload.id, data)
      .then((res) => {
        // console.log(res);
        commit("updateItem", res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  },
  removeItemAction({ commit }, payload) {
    this.$api
      .delete("/admin/group/delete/" + payload)
      .then((res) => {
        // console.log('removeItemAction', res);
        if (res.status == 204) {
          commit("deleteItem", payload)
          return ""
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
