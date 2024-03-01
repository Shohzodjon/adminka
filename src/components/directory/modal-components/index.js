export default {
  modalTags: () => import(/* webpackChunkName: "modal-tags" */ "./modal-tags"),
  modalComponents: () =>
    import(/* webpackChunkName: "modal-tags" */ "./modal-components")
}
