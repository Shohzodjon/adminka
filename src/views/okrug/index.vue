<template>
  <a-row>
    <a-row class="content-title" type="flex">
      <h2 class="flex-1">
        {{ $route.meta.title[$i18n.locale] }}
      </h2>

      <a-row
        class="flex-no__wrap ml-auto wanted-search-input-wrapper"
        type="flex"
      >
        <a-input
          v-model="form.searchText"
          :placeholder="$t('Search')"
          class="input-search"
          @input="search"
        />
        <a-select
          v-model="form.region"
          option-label-prop="label"
          class="selects"
        >
          <a-select-option
            v-for="item in allRegions"
            :key="item.id"
            :value="item.id"
            :label="item.title"
          >
            {{ item.title }}
          </a-select-option>
        </a-select>
        <a-select
          v-model="form.district"
          class="selects"
          option-label-prop="label"
        >
          <a-select-option
            v-for="item in allDistrict.districts"
            :key="item.id"
            :value="item.id"
            :label="item.title"
          >
            {{ item.title }}
          </a-select-option>
        </a-select>
        <!-- <searchInput
          v-model="inputs.search.text"
          :placeholder="inputs.search.placeholder[$i18n.locale]"
          :searching="inputs.search.spinner"
          @handler="onSearch"
        /> -->
        <a-button
          v-if="form.region"
          type="primary"
          class="btn-clear"
          @click="clearFilter"
        >
          {{ $t("Clear") }}
        </a-button>
        <a-button
          type="primary"
          @click="
            $router.push({
              name: 'okrug-create'
            })
          "
        >
          <a-icon type="plus" />{{ $t("Add") }}
        </a-button>
      </a-row>
    </a-row>
    <spinner v-if="loading" />
    <a-table
      v-else-if="okrugs.results.length"
      :key="$route.fullPath"
      :columns="columns"
      :data-source="okrugs.results"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <template slot="name" slot-scope="item">
        {{ item.title }}
      </template>
      <template slot="operation" slot-scope="item">
        <a-icon
          class="action-btns"
          style="margin: 0 10px"
          type="edit"
          @click="
            $router.push({
              name: 'okrug-detail',
              params: { id: item.id }
            })
          "
        />
        <a-popconfirm
          :cancel-text="$t('No')"
          :ok-text="$t('Yes')"
          :title="$t('DeleteYes')"
          @confirm="removeItem(item.id)"
        >
          <a-icon class="action-btns" style="margin: 0 10px" type="delete" />
        </a-popconfirm>
      </template>
    </a-table>
    <p v-else>{{ $t("CountiesEmpty") }}</p>

    <!-- <a-row class="mt-1">
      <a-pagination
        :current="page"
        :total="+tableProps.count || 0"
        @change="toPage"
      />
    </a-row> -->
  </a-row>
</template>
<script>
export default {
  data() {
    return {
      allRegions: [],
      allDistrict: [],
      form: {
        region: null,
        district: null,
        searchText: ""
      },
      columns: [
        {
          title: this.$t("TagsColTitle"),
          key: "title",
          class: "wanted-fio-td",
          scopedSlots: { customRender: "name" },
          width: "90%"
        },
        {
          title: this.$t("UsersColTitle2"),
          key: "operation",
          scopedSlots: { customRender: "operation" }
        }
      ],
      okrugs: [],
      loading: false,
      page: 1,
      offset: 0,
      pagination: {},
      tableProps: {
        results: [],
        count: 1
      }
    }
  },
  computed: {
    regionId() {
      return this.form.region
    },
    districtId() {
      return this.form.district
    },
    isFilter() {
      return this.form.region && this.form.district ? true : false
    }
  },
  watch: {
    regionId(val) {
      if (val) {
        this.form.district = null
        this.getRegionDistrict(val)
        this.getOkrugList()
      }
    },
    districtId(val) {
      if (val) {
        this.getOkrugList({
          districtId: val
        })
      }
    }
  },
  created() {
    this.getOkrugList()
    this.getAllRegions()
  },
  methods: {
    clearFilter() {
      this.form.region = null
      this.form.district = null
      this.form.searchText = null
      this.getOkrugList()
    },
    async getAllRegions() {
      this.allRegions = await this.$store.dispatch("okrug/fetchAllRegions")
      console.log(this.allRegions)
    },
    async getRegionDistrict(id) {
      this.allDistrict = await this.$store.dispatch(
        "okrug/fetchRegionDistricts",
        id
      )
    },
    async getOkrugList() {
      this.loading = true
      this.page = +this.$route.query.page || 1
      this.okrugs = await this.$store.dispatch("okrug/fetchOkrugList", {
        limit: 10,
        offset: this.offset,
        title: this.form.searchText,
        district: this.form.district,
        region: this.form.region
      })
      const pagination = { ...this.pagination }
      pagination.total = this.okrugs.count
      this.pagination = pagination
      if (this.okrugs) {
        this.$set(this, "tableProps", {
          results: (this.okrugs && this.okrugs.results) || [],
          count:
            this.okrugs && this.okrugs.results && this.okrugs.results.length
        })
      }
      this.loading = false
    },

    async removeItem(id) {
      await this.$api.delete(`/common/okrug/${id}/delete/`)
      this.getOkrugList()
    },
    handleTableChange(pagination) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.offset = (this.pagination.current - 1) * 10
      this.getOkrugList()
      console.log(pagination)
    },
    search() {
      this.offset = 0
      this.getOkrugList()
    }
  }
}
</script>
<style scoped>
.selects {
  width: 200px;
  margin-right: 15px;
}
.btn-clear {
  margin-right: 15px;
}
.input-search {
  width: 200px;
  display: inline-block;
  margin-right: 15px;
}
</style>
