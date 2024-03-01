<template>
  <a-row>
    <a-row class="content-title" type="flex">
      <h2 class="flex-1">
        {{ $route.meta.title[$i18n.locale] }}
      </h2>
      <a-col style="margin-left: auto">
        <a-input
          v-model="form.searchText"
          :placeholder="$t('search')"
          class="input-search"
          style="width: 400px"
          @input="search"
        />
        <a-button
          type="primary"
          @click="
            $router.push({
              path: '/deputy-articles/create'
            })
          "
        >
          <a-icon type="plus" />{{ $t("Add") }}
        </a-button>
      </a-col>
    </a-row>
    <a-table
      :key="$route.fullPath"
      :columns="columns"
      :data-source="tableProps.results"
      :loading="loading"
      :pagination="false"
      @change="handleTableChange"
    >
      <template slot="name" slot-scope="item">
        {{ item.title }}
      </template>
      <template slot="wanted" slot-scope="item">
        {{ item.deputy.first_name }}
        {{ item.deputy.last_name }}
        {{ item.deputy.middle_name }}
      </template>
      <template slot="pub_date" slot-scope="item">
        <!-- {{ moment(item.pub_date).format("") }} -->
        {{ item.pub_date }}
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
    <div style="padding: 15px 0">
      <a-pagination
        :key="perPage"
        :current="page"
        :default-page-size="perPage"
        :total="+tableProps.count || 0"
        @change="toPage"
      />
    </div>
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
      list: [],
      form: {
        searchText: ""
      },
      columns: [
        {
          title: this.$t("TagsColTitle"),
          key: "title",
          class: "wanted-fio-td",
          scopedSlots: { customRender: "name" },
          width: "50%"
        },
        {
          title: this.$t("AuthorArticle"),
          key: "wanted",
          scopedSlots: { customRender: "wanted" },
          width: "50%"
        },
        {
          title: this.$t("TableDate"),
          key: "pub_date",
          scopedSlots: { customRender: "pub_date" },
          width: "200px"
        },
        {
          title: this.$t("UsersColTitle2"),
          key: "operation",
          scopedSlots: { customRender: "operation" },
          width: "120px"
        }
        //  {
        //   title: this.$t("TagsColTitle"),
        //   key: "first_name",
        //   class: "wanted-fio-td",
        //   scopedSlots: { customRender: "name" },
        //   width: "90%"
        // },
      ],
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
      perPage: 20,
      page: 1,
      offset: 0,
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
    }
  },
  methods: {
    clearFilter() {
      this.form.searchText = null
      this.fetchData()
    },
    toPage(arg) {
      this.$router.push({ query: { page: arg } })
    },

    async fetchData() {
      this.loading = true
      this.offset = +this.$route.query.page || 1
      this.page = this.offset
      this.offset = (this.offset - 1) * this.perPage
      try {
        const r = await this.$api("/structure/admin/deputy/article/list/", {
          params: {
            limit: this.perPage,
            offset: this.offset,
            query: this.form.searchText
          }
        })
        const result = r && r.data
        if (r) {
          this.$set(this, "tableProps", {
            results: (result && result.results) || [],
            count: result && result.count
          })
        }
      } catch (e) {
        this.$sentry.captureMessage(e)
        this.loading = false
      }
      this.loading = false
    },
    async removeItem(item) {
      //todo
      try {
        await this.$api.delete(`/structure/deputy/article/${item.id}/delete/`)

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
        name: "deputy-articles-detail",
        params: { id: item.id },
        query: { ...this.$route.query }
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
