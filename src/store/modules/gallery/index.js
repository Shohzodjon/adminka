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
  // fetch(_, payload) {
  //     return this.$api
  //         .get("/gallery/list", {
  //             params: payload
  //         })
  //         .then((res) => {
  //             if (res && res.data) {
  //                 //  commit('setList', res.data)
  //                 return res.data
  //             }

  //             return []
  //         })
  //         .catch((err) => {
  //             console.log(err)
  //             return []
  //         })
  // },
  fetchPhoto(_, payload) {
    return this.$api.get("/common/photo-gallery/list/", payload).then((res) => {
      return res && res.data
    })
  },

  fetchVideo(_, payload) {
    return this.$api.get("/common/video-gallery/list/", payload).then((res) => {
      return res && res.data
    })
  },

  detail(_, payload) {
    return this.$api
      .get(`/common/${payload.type}-gallery/update/${payload.id}/`)
      .then((res) => {
        if (res && res.data) {
          return res.data
        }

        return {}
      })
      .catch((err) => {
        console.log(err)
        return {}
      })
  },
  createItemActionPhoto(_, payload) {
    return this.$api
      .post("/common/photo-gallery/create/", payload.data)
      .then((res) => {
        // commit('createItem', res.data)
        return res
      })
      .catch((err) => {
        console.log(err)
        return err
      })
  },

  updateItemActionPhoto(_, payload) {
    return this.$api
      .put("/common/photo-gallery/update/" + payload.id + "/", payload.data)
      .then((res) => {
        // commit('updateItem', res.data)
        return res
      })
      .catch((err) => {
        console.log(err)
        return err
      })
  },

  removeItemAction(_, payload) {
    return this.$api
      .delete("/common/photo-gallery/delete/" + payload + "/")
      .then((res) => !!(res && res.status >= 200))
      .catch((err) => {
        console.log(err)
        return false
      })
  },
  createItemActionVideo(_, payload) {
    return this.$api
      .post("/common/video-gallery/create/", payload.data)
      .then((res) => {
        // commit('createItem', res.data)
        return res
      })
      .catch((err) => {
        console.log(err)
        return err
      })
  },

  updateItemActionVideo(_, payload) {
    return this.$api
      .put("/common/video-gallery/update/" + payload.id + "/", payload.data)
      .then((res) => {
        // commit('updateItem', res.data)
        return res
      })
      .catch((err) => {
        console.log(err)
        return err
      })
  },

  removeItemActionVideo(_, payload) {
    return this.$api
      .patch(
        `/common/video-gallery/${payload.videoId}/video-gallery-attachments/remove/`,
        {
          videos: [payload.galleryId]
        }
      )
      .then((res) => !!(res && res.status >= 200))
      .catch((err) => {
        console.log(err)
        return false
      })
  },
  removeVideoGallery(_, payload) {
    return this.$api
      .delete(`/common/video-gallery/delete/${payload.id}/`, {
        videos: [payload.id]
      })
      .then((res) => !!(res && res.status >= 200))
      .catch((err) => {
        console.log(err)
        return false
      })
  }
}
