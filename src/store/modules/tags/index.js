export const state = () => ({})

export const getters = {}

export const mutations = {}

export const actions = {
  fetch() {
    return this.$api.get("/cms/post/tag/list/").then((res) => {
      if (res && res.data) {
        return res.data
      }
    })
  },

  submit(_, payload) {
    // skip id
    // eslint-disable-next-line no-unused-vars
    const { id, ...props } = payload

    const req = {
      method: payload && payload.id ? "put" : "post",
      url: payload && payload.id ? "/tag/update/" + payload.id : "/tag/create",
      data: {
        ...props,
        name: JSON.stringify(props.name)
      }
    }

    return this.$api[req.method](req.url, req.data)
      .then((res) => {
        // console.log(res)

        if (res && res.data) {
          return res.data
        }
      })
      .catch((err) => {
        console.log(err)
      })
  },

  delete(_, payload) {
    return this.$api
      .delete("/tag/delete/" + payload)
      .then((res) => {
        // console.log(res)
        return res
      })
      .catch((err) => console.log(err))
  },

  fetchTagById(_, payload) {
    return this.$api
      .get("/cms/post/tag/" + payload + "/update/")
      .then((res) => {
        return res && res.data
      })
  }
}
