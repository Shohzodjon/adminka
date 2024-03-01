import "@/store"

export const state = () => ({
  items_count: 0,
  results: []
})

export const mutations = {
  removeImg(state, id) {
    const findIndex = state.results.findIndex((item) => item.id == id)
    if (findIndex != -1) {
      state.results = [
        ...state.results.slice(0, findIndex),
        ...state.results.slice(findIndex + 1)
      ]
    }
  },

  setState(state, payload) {
    Object.keys(payload).forEach((item) => {
      if (item in state) {
        state[item] = payload[item]
      }
    })
  }
}

export const actions = {
  fetchImages({ commit }, params) {
    return this.$api
      .get("/filestore/list", {
        params: {
          ...(params || {})
        }
      })
      .then((response) => {
        // commit("setImages", response.data || []);
        commit("setState", response.data)
      })
      .catch((err) => {
        console.error(err)
        return false
      })
  },
  submitImage(_, data) {
    const req = {
      method: "post",
      url: "/filestore/upload/"
    }

    const f = new FormData()
    Object.keys(data).forEach((item) => f.append(item, data[item]))

    return this.$api[req.method](req.url, f).catch((err) => {
      console.error(err)
      return false
    })
  },
  removeImage({ commit }, id) {
    return this.$api
      .delete(`/filestore/${id}/delete/`)
      .then(() => {
        commit("removeImg", id)
      })
      .catch((err) => {
        console.error(err)
        return false
      })
  }
}

// export const getters = {
//   allImages(state) {
//     return state.images;
//   },
// };
