export const state = () => ({
  messages: [],
  tags: [],
  showToast: false,
  info: false,
  danger: false,
  success: false
})

export const mutations = {
  hideToast(state) {
    state.showToast = false
  },
  showToast(state) {
    state.showToast = true
    setTimeout(() => {
      state.showToast = false
    }, 6000)
  },
  setPayload(state, { name, value }) {
    state[name] = value
  }
}

export const actions = {
  warning({ commit }, { messages, tags, danger, info, success }) {
    messages && commit("setPayload", { name: "messages", value: messages })
    tags && commit("setPayload", { name: "tags", value: tags })
    info && commit("setPayload", { name: "info", value: info })
    danger && commit("setPayload", { name: "danger", value: danger })
    success && commit("setPayload", { name: "success", value: success })
    commit("showToast")
  }
}
