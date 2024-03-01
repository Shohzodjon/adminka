export const actions = {
  async fetchAllRegions() {
    const { data } = await this.$api.get("/common/region/list/")
    return data
  },
  async fetchRegionDistricts(_, id) {
    const { data } = await this.$api.get(`/common/region/detail/${id}/`)
    return data
  },
  async fetchSubDistrict(_, params) {
    const { data } = await this.$api.get(`/common/sub-district/list/`, {
      params
    })
    return data
  },
  async fetchSubDistrictById(_, id) {
    const { data } = await this.$api.get(`/common/sub-district/update/${id}/`)
    return data
  },
  async fetchDistrictById(_, id) {
    const { data } = await this.$api.get(`/common/district/update/${id}/`)
    return data
  },
  async fetchSubDistrictList(_, params) {
    const { data } = await this.$api.get(
      `/common/district/${params.id}/sub-district/list/`,
      {
        params
      }
    )
    return data
  }
}
