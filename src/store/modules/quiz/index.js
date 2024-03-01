// import store from "@/store"

export const state = () => ({
  loading: false,
  pending: false
})

export const mutations = {
  setState(state, payload) {
    Object.keys(payload).forEach((item) => {
      if (item in state) {
        state[item] = payload[item]
      }
    })
  }
}

export const actions = {
  // getPoll({ commit }, params) {
  //   commit("setState", {
  //     loading: true
  //   })

  //   return this.$api
  //     .get("/cms/survey/list/", { params })
  //     .then((res) => {
  //       commit("setState", {
  //         loading: false
  //       })
  //       return (res && res.data) || {}
  //     })
  //     .catch((err) => console.error(err))
  // },
  async fetchQuiz() {
    const { data } = await this.$api.get("/cms/survey/list/")
    return data
  }
}
