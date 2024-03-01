<template>
  <a-row>
    <a-row class="content-title" type="flex">
      <h2 class="flex-1">{{ $route.meta.title[$i18n.locale] }}</h2>

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

        <a-input
          v-model="filter.searchText"
          :placeholder="$t('search')"
          class="input-search"
          @input="search"
        />
        <a-select
          v-model="filter.status"
          option-label-prop="label"
          class="selects"
          placeholder="Status"
          @change="statusChange"
        >
          <a-select-option
            v-for="item in 3"
            :key="item"
            :value="item"
            :label="getStatus(item)"
          >
            {{ getStatus(item) }}
          </a-select-option>
        </a-select>

        <!-- <searchInput
          v-model="inputs.search.text"
          :placeholder="inputs.search.placeholder[$i18n.locale]"
          :searching="inputs.search.spinner"
          @handler="onSearch"
        /> -->
        <a-button
          v-if="filter.status"
          type="primary"
          class="btn-clear"
          @click="clearFilter"
        >
          {{ $t("Clear") }}
        </a-button>
      </a-row>
    </a-row>

    <a-table
      :columns="columns"
      :data-source="form"
      :loading="loading"
      :pagination="false"
      :row-key="(record) => record.id"
    >
      <!-- @change="handleTableChange" -->
      <template slot="id" slot-scope="item">
        <b>{{ item.id }}</b>
      </template>
      <template slot="name" slot-scope="item">
        <router-link
          :to="{
            name: 'appeals-detail',
            params: {
              id: item.id
            }
          }"
          class="td-post-item"
          tag="span"
          >{{ item.full_name }}</router-link
        >
      </template>
      <template slot="whom" slot-scope="item">
        {{ item.whom.last_name }}
        {{ item.whom.first_name }}
        {{ item.whom.middle_name }}
      </template>
      <template slot="region" slot-scope="item">
        <b>{{ item.region && item.region.title }}</b> /
        {{ item.district && item.district.title }}
      </template>
      <template slot="phone" slot-scope="item">
        <a
          style="color: rgba(0, 0, 0, 0.65)"
          :href="'tel:' + item.phone_number"
        >
          {{ item.phone_number }}</a
        >
      </template>
      <template slot="status" slot-scope="item">
        <span
          :class="
            item.status == 3
              ? 'green-btn'
              : item.status == 1
              ? 'blue-btn'
              : 'yellow-btn'
          "
          >{{ getStatus(item.status) }}</span
        >
      </template>
      <template slot="created_at" slot-scope="item">
        <span>{{ getDate(item.created_at) }}</span>
      </template>
    </a-table>
    <a-col style="padding: 15px 0">
      <a-pagination
        :key="perPage"
        :current="page"
        :default-page-size="perPage"
        :total="+total || 0"
        @change="toPage"
      />
    </a-col>
  </a-row>
</template>
<script>
import appeals from "@/mixins/appeals"

export default {
  mixins: [appeals],
  data() {
    return {
      perPage: 50,
      page: 1,
      offset: 0,
      total: 0,
      filter: {
        status: "",
        searchText: ""
      },
      form: [],
      loading: false,
      columns: [
        {
          title: "ID",
          key: "id",
          scopedSlots: { customRender: "id" }
        },
        {
          title: "Ф.И.О",
          key: "name",
          scopedSlots: { customRender: "name" }
        },
        {
          title: "Кимга",
          key: "whom",
          scopedSlots: { customRender: "whom" }
        },
        {
          title: "Область",
          key: "region",
          scopedSlots: { customRender: "region" }
        },
        {
          title: this.$t("FormPhone"),
          key: "phone",
          scopedSlots: { customRender: "phone" }
        },
        {
          title: this.$t("appealDate"),
          key: "created_at",
          scopedSlots: { customRender: "created_at" }
        },
        {
          title: this.$t("Status"),
          key: "status",
          scopedSlots: { customRender: "status" }
        }
      ]
    }
  },
  created() {
    this.fetchAppeals()
  },
  watch: {
    $route: {
      handler: "fetchAppeals",
      immediate: true
    }
  },
  methods: {
    toPage(arg) {
      this.$router.push({ query: { page: arg } })
    },
    getDate(date) {
      let res
      if (date) {
        let arr = date.split("T")
        let arr2 = arr[0].split("-")
        res = arr2[2] + "." + arr2[1] + "." + arr2[0]
      } else {
        res = ""
      }
      return res
    },
    async fetchAppeals() {
      this.loading = true

      this.offset = +this.$route.query.page || 1
      this.page = this.offset
      this.offset = (this.offset - 1) * this.perPage
      const { results, count } = await this.$store.dispatch(
        "appeals/getAppeals",
        {
          params: {
            search: this.filter.searchText,
            status: this.filter.status,
            limit: this.perPage,
            offset: this.offset
          }
        }
      )
      this.total = count
      this.form = results
      this.loading = false
    },
    async removeItem(id) {
      this.loading = true
      try {
        await this.$api.delete(`/appeals/${id}/delete/`)
        this.fetchAppeals()
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    statusChange(e) {
      this.offset = 0
      this.fetchAppeals()
      console.log(e)
    },
    search() {
      this.offset = 0
      this.fetchAppeals()
    },
    clearFilter() {
      this.filter = {
        searchText: "",
        status: ""
      }
    }
    // handleTableChange(pagination) {
    //   const pager = { ...this.pagination }
    //   pager.current = pagination.current
    //   this.pagination = pager
    //   this.offset = (this.pagination.current - 1) * 50
    //   this.fetchAppeals()
    //   console.log(this.pagination, "this.pagination")
    // }
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
.ellipsis {
  overflow: hidden;
  max-width: 100px;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
}
.green-btn {
  background: green;
  color: white;
  padding: 8px;
  border-radius: 6px;
}
.yellow-btn {
  background: #ffc107;
  color: white;

  padding: 6px 8px;
  border-radius: 6px;
  display: block;
  width: max-content;
  white-space: nowrap;
}
.blue-btn {
  background: #0d6efd;
  color: white;

  padding: 8px;
  border-radius: 6px;
}
.green {
  color: green;
}
.yellow {
  color: #ffc107;
}
.blue {
  color: #0d6efd;
}
</style>
