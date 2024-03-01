export const actions = {
  async fetchAllRegions() {
    const { data } = await this.$api.get("/common/region/list/")
    return data
  },
  async fetchRegionDistricts(_, id) {
    const { data } = await this.$api.get(`/common/region/detail/${id}/`)
    return data
  },
  async fetchSubDistrict(_, payload) {
    console.log(payload)
    const { data } = await this.$api.get(
      `/common/districts/free-sub-district/list/?districts=${payload}`
    )
    return data
  },
  async fetchOkrugList(_, params) {
    const { data } = await this.$api.get("/common/okrug/list/", {
      params
    })
    return data
  },
  async fetchOkrugById(_, id) {
    const { data } = await this.$api.get(`/common/okrug/${id}/update/`)
    return data
  }
}
