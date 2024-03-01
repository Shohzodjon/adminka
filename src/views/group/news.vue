<template>
  <a-row class="content-fix">
    <a-row class="content-title" type="flex">
      <h2>{{ groupTitle() }}</h2>

      <!-- <h2>{{$route.params}}</h2> -->

      <a-button
        type="primary"
        style="margin-left: auto"
        @click="$router.push({ name: 'group-news-create' })"
      >
        <a-icon type="plus" />Добавить
      </a-button>
    </a-row>
    <!-- <pre>{{groupNews}}</pre> -->

    <a-table
      :loading="loading"
      :columns="columns"
      :data-source="sortedGroupNews"
      :pagination="{ defaultPageSize: 10 }"
      :row-key="(record) => record.id"
    >
      <template slot="is_main_state" slot-scope="item">
        <a-icon
          v-if="item.is_main && item.status"
          type="check-circle"
          two-tone-color="#de2626"
          theme="twoTone"
          :style="{
            fontSize: '18px',
            marginLeft: 'auto',
            marginRight: 'auto',
            position: 'relative',
            top: '2px',
            right: '-8px'
          }"
        />
      </template>
      <template slot="news_title" slot-scope="item">
        <router-link
          tag="span"
          class="td-post-item"
          :to="{
            name: 'group-news-detail',
            params: { group_id: $route.params.group_id, news_id: item.id }
          }"
        >
          {{ item.title[$i18n.locale] || item.title.ru }}
        </router-link>
      </template>
      <template slot="operation" slot-scope="item">
        <a-icon
          type="edit"
          class="action-btns"
          @click="
            $router.push({
              name: 'group-news-detail',
              params: { group_id: $route.params.group_id, news_id: item.id }
            })
          "
        />
        <a-popconfirm
          :cancel-text="$t('No')"
          :ok-text="$t('Yes')"
          :title="$t('DeleteYes')"
          @confirm="deleteNews(item)"
        >
          <a-icon type="delete" class="action-btns" style="margin: 0 10px" />
        </a-popconfirm>
      </template>
    </a-table>
  </a-row>
</template>

<script>
const columns = [
  {
    title: "",
    key: "row_icon",
    width: 1,
    textAlign: "center",
    scopedSlots: { customRender: "is_main_state" }
  },
  {
    title: "Название",
    key: "title",
    scopedSlots: { customRender: "news_title" }
  },
  {
    title: "Действие",
    key: "operation",
    width: 300,
    scopedSlots: { customRender: "operation" }
  }
]

export default {
  data: () => ({
    groupNews: [],
    loading: false,
    columns
  }),
  computed: {
    sortedGroupNews() {
      return this.groupNews
        .slice()
        .sort((a, b) => b.status - a.status)
        .sort((a, b) => b.is_main - a.is_main)
    }
  },
  watch: {
    "$route.params": {
      handler: "fetchData",
      immediate: true
    }
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        const res = await this.$store.dispatch(
          "news/fetchByGroup",
          this.$route.params.group_id
        )

        // console.log(res);
        this.groupNews = res
      } catch (error) {
        console.log(error)
      }

      this.loading = false
    },
    groupTitle() {
      const s = this.$store.getters["group/list"].find(
        (item) => item.id == this.$route.params.group_id
      )

      if (s) {
        return s.title && s.title.ru
      }

      return ""
    },
    async deleteNews(item_props) {
      await this.$store.dispatch("news/deleteItemAction", item_props.id)
      const f = this.groupNews.findIndex((item) => item.id == item_props.id)

      if (f != -1) {
        this.groupNews.splice(f, 1)
      }
    }
  }
}
</script>

<style></style>
