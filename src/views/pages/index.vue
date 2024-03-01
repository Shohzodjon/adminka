<template>
  <div class="fractions">
    <div class="fractions_header">
      <h2>{{ $route.meta.title[$i18n.locale] }}</h2>
      <a-input
        v-model="searchText"
        :placeholder="$t('search')"
        class="input-search"
        @input="search"
      />
    </div>
    <a-table
      :columns="columns"
      :data-source="list"
      :loading="loading"
      :pagination="false"
      :row-key="() => Math.random().toString().slice(2)"
    >
      <div
        slot="page_title"
        slot-scope="item"
        class="td-post-item"
        @click="
          $router.push(
            {
              name: $options.name + '-detail',
              params: { id: item.id },
              query: item.post ? { post: item.post } : {}
            },
            () => null
          )
        "
      >
        {{ item.title }}
      </div>

      <template slot="operation" slot-scope="item">
        <a-icon
          class="action-btns"
          type="edit"
          @click="
            $router.push(
              { name: $options.name + '-detail', params: { id: item.id } },
              () => null
            )
          "
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

    <a-row v-if="count" class="mt-1">
      <a-pagination
        :current="+$route.query.page || 1"
        :total="count"
        @change="toPage"
      />
    </a-row>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/name-property-casing
  name: "pages",
  data() {
    return {
      loading: false,
      pending: false,
      searchText: "",
      list: [],
      count: 0,
      columns: [
        {
          title: this.$t("TagsColTitle"),
          key: "title",
          width: "90%",
          scopedSlots: { customRender: "page_title" }
        },
        {
          title: this.$t("UsersColTitle2"),
          key: "operation",
          scopedSlots: { customRender: "operation" }
        }
      ]
    }
  },

  computed: {
    c_perPage() {
      return this.$route.query.per_page || 10
    }
  },
  watch: {
    $route: {
      handler: "fetchData",
      immediate: true
    }
  },
  methods: {
    search() {
      if (this.searchText.length >= 3) {
        this.fetchData()
      } else if (this.searchText.length == 0) {
        this.fetchData()
      }
    },
    toPage(arg) {
      this.$router.push({ query: { page: arg } })
    },
    async fetchData() {
      this.loading = true
      try {
        const data = await this.$store.dispatch("pages/fetch", {
          offset: (this.$route.query.page - 1) * this.c_perPage || 0,
          limit: this.c_perPage,
          search: this.searchText
        })
        if (data) {
          this.list = data.results || []
          this.count = data.count
        }
        this.loading = false
      } catch (err) {
        this.$sentry.captureMessage(err)
      }
      this.loading = false
    },
    async removeItem(arg) {
      try {
        if (arg && arg.id) {
          await this.$store.dispatch("pages/removeItemAction", arg.id)

          const f = this.list.findIndex((item) => item.id == arg.id)

          if (f != -1) {
            this.list.splice(f, 1)
          }
        }
      } catch (error) {
        this.$sentry.captureMessage(error)
      }
    }
  }
}
</script>
<style>
.fractions {
  padding: 20px 0;
}
.fractions_header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.ant-table-pagination.ant-pagination {
  margin-top: 15px;
}
.success {
  background-color: #1890ff;
  margin-left: 8px;
  color: #fff;
  border-radius: 8px;
}
.success:hover {
  background-color: #1890ff;
  color: #fff;
}
.success:focus {
  background-color: #1890ff;
  color: #fff;
}
</style>
