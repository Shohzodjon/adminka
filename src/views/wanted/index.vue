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
        <!-- <searchInput
          v-model="inputs.search.text"
          :placeholder="inputs.search.placeholder[$i18n.locale]"
          :searching="inputs.search.spinner"
          @handler="onSearch"
        /> -->
        <a-select v-model="filterType" style="width: 200px" class="selects">
          <a-select-option v-for="item in types" :key="item.value">
            {{ item.title }}
          </a-select-option>
        </a-select>
        <a-input
          v-model="form.searchText"
          :placeholder="$t('search')"
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
              name: 'wanted-create',
              params: { type: $route.name && wantedType[$route.name].code }
            })
          "
        >
          <a-icon type="plus" />{{ $t("Add") }}
        </a-button>
      </a-row>
    </a-row>

    <!-- <a-table
      :key="$route.fullPath"
      :columns="columns"
      :data-source="tableProps.results"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
    > -->
    <a-table
      :key="$route.fullPath"
      :columns="columns"
      :data-source="tableProps.results"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <template slot="name" slot-scope="item">
        {{ item.first_name }}
        {{ item.last_name }}
        {{ item.middle_name }}
      </template>
      <template slot="operation" slot-scope="item">
        <a-icon
          class="action-btns"
          style="margin: 0 10px"
          type="edit"
          @click="editDeputy(item)"
        />
        <a-popconfirm
          :cancel-text="$t('No')"
          :ok-text="$t('Yes')"
          :title="$t('DeleteYes')"
          @confirm="removeItem(item)"
        >
          <a-icon class="action-btns" style="margin: 0 10px" type="delete" />
        </a-popconfirm>
      </template>
    </a-table>

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
// import searchInput from "@/components/wanted/search-input"

export default {
  components: {
    // searchInput
  },
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
      pagination: {},
      offset: 0,
      tableProps: {
        results: [],
        count: 1
      },
      types: [
        {
          value: 1,
          title: "Deputies"
        },
        {
          value: 2,
          title: "Councel"
        }
      ],
      filterType: 1,
      perPage: 10,
      page: 1,
      loading: false,
      inputs: {
        search: {
          text: "",
          spinner: false,
          placeholder: {
            oz: "Ф.И.О киритинг, туғилган йили",
            uz: "F.I.O kiriting, tug'ilgan yili",
            ru: "Введите Ф.И.О, год рождения",
            en: "Enter full name, year of birth"
          }
        }
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
    $route: {
      handler: "fetchData",
      immediate: true
    },
    filterType(newValue) {
      ;(newValue == 2 && this.fetchCouncil()) || this.fetchData()
    },
    regionId(val) {
      if (val) {
        this.form.district = null
        this.getRegionDistrict(val)
        this.fetchData()
      }
    },
    districtId(val) {
      if (val) {
        this.fetchData({
          districtId: val
        })
      }
    }
  },
  async created() {
    this.getAllRegions()
  },
  methods: {
    clearFilter() {
      this.form.region = null
      this.form.district = null
      this.form.searchText = null
      this.fetchData()
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
    toPage(arg) {
      this.$router.push({ query: { page: arg } })
    },
    async fetchData() {
      this.loading = true

      this.page = +this.$route.query.page || 1
      try {
        // get missing or wanted
        if (
          !(
            (this.wantedType[this.$route.name] &&
              this.wantedType[this.$route.name].code) ||
            {}.code
          )
        ) {
          return
        }

        let params = {}
        const searchText = this.inputs.search.text

        if (isNaN(searchText)) {
          params.fio = searchText
        } else {
          params.bd = +searchText
        }

        const r = await this.$store.dispatch("wanted/fetch", {
          // ...params,
          // type: this.wantedType[this.$route.name].code,
          limit: this.perPage,
          offset: this.offset,
          full_name: this.form.searchText,
          district: this.form.district,
          region: this.form.region
        })

        console.log(r)
        const pagination = { ...this.pagination }
        pagination.total = r.count
        this.pagination = pagination
        if (r) {
          this.$set(this, "tableProps", {
            results: (r && r.results) || [],
            count: r && r.results && r.results.length
          })
        }
      } catch (e) {
        this.$sentry.captureMessage(e)
        this.loading = false
      }
      this.loading = false
    },
    async fetchCouncil() {
      let res = await this.$api.get("/structure/members/")
      this.tableProps = {
        results: res && res.data
      }
    },
    async onSearch() {
      if (
        this.inputs.search.text.length == 1 ||
        !(
          this.wantedType[this.$route.name] &&
          this.wantedType[this.$route.name].code
        )
      ) {
        return
      }

      this.page = 1

      this.loading = true

      try {
        let params = {}
        const searchText = this.inputs.search.text

        if (isNaN(searchText)) {
          params.fio = searchText
        } else {
          params.bd = +searchText
        }

        const r = await this.$store.dispatch("wanted/fetch", {
          ...params,
          type: this.wantedType[this.$route.name].code,
          limit: this.perPage,
          page: this.page
        })

        if (r) {
          // console.log(r);
          this.$set(this, "tableProps", {
            results: r.results || [],
            count: r.count
          })
        }
      } catch (err) {
        console.log(err)
        this.loading = false
      }

      this.loading = false
    },
    async removeItem(item) {
      //todo
      try {
        await this.$store.dispatch("wanted/removeItemAction", item.id)

        // console.log(res, item);

        // if (res) {
        const f = this.tableProps.results.findIndex(
          (elem) => elem.id == item.id
        )

        if (f != -1) {
          this.tableProps.results.splice(f, 1)
          this.$message.success("Успешно удалено")
        }
        // }
      } catch (e) {
        this.$sentry.captureMessage(e)
      }
    },
    editDeputy(item) {
      this.$router.push({
        name: "wanted-update",
        params: {
          id: item.id
        }
      })
    },
    handleTableChange(pagination) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.offset = (this.pagination.current - 1) * 10
      this.fetchData()
      console.log(pagination)
    },
    search() {
      this.offset = 0
      this.fetchData()
    }
  }
}
</script>

<style scoped>
.wanted-search-input-wrapper {
  -webkit-box-flex: 0;
  -ms-flex: 0 0 430px;
  flex: 0 0 430px;
  justify-content: space-around;
}
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
