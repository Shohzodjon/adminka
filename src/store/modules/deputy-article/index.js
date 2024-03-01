export const actions = {
  removeItemAction(_, payload) {
    this.$api.delete(`/structure/deputy/article/${payload}/delete/`)
  }
}
