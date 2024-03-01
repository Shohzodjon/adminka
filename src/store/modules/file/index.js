import store from "@/store"

export const state = () => ({})

export const getters = {}

export const mutations = {}

export const actions = {
  delete(_, payload) {
    // console.log('delete', payload)
    return store.$api
      .delete("/news/file/delete/" + payload)
      .then((res) => {
        // console.log(res)
        return +res.status >= 200
      })
      .catch((err) => {
        console.log(err)
        return false
      })
  },

  deletePost(_, payload) {
    // console.log('delete', payload)
    return store.$api
      .delete("/news/post/file/delete/" + payload)
      .then((res) => {
        // console.log(res)
        return +res.status >= 200
      })
      .catch((err) => {
        console.log(err)
        return false
      })
  }
}
