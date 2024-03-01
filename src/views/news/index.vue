<template>
  <a-col>
    <a-row class="content-title" type="flex">
      <a-button
        type="primary"
        style="margin-left: auto"
        @click="$router.push({ name: 'news-create' })"
      >
        <a-icon type="plus" />Добавить
      </a-button>
    </a-row>
    <a-table
      :loading="loading"
      :columns="columns"
      :data-source="list"
      :pagination="{ defaultPageSize: 5 }"
    >
      <template slot="id" slot-scope="item">
        <b>{{ item }}</b>
      </template>
      <template slot="category" slot-scope="item">{{
        item.category && item.category.name_ru
      }}</template>
      <template slot="operation" slot-scope="item">
        <a-icon
          type="edit"
          class="action-btns"
          @click="
            $router.push({ name: 'news-detail', params: { id: item.slug } })
          "
        />
        <a-popconfirm
          :cancel-text="$t('No')"
          :ok-text="$t('Yes')"
          :title="$t('DeleteYes')"
          @confirm="removeNews(item)"
        >
          <a-icon type="delete" class="action-btns" style="margin: 0 10px" />
        </a-popconfirm>
      </template>
    </a-table>
  </a-col>
</template>

<script>
const columns = [
  {
    title: "ID",
    key: "id",
    dataIndex: "id",
    scopedSlots: { customRender: "id" }
  },
  { title: "Заголовок", dataIndex: "title_ru", key: "title_ru" },
  { title: "Описание", dataIndex: "content_ru", key: "content_ru" },
  {
    title: "Отображать на главной",
    key: "is_main",
    scopedSlots: { customRender: "is_main" }
  },
  {
    title: "Категория",
    key: "category",
    scopedSlots: { customRender: "category" }
  },
  { dataIndex: "images", key: "images" },
  {
    title: "Действие",
    key: "operation",
    scopedSlots: { customRender: "operation" }
  }
]

export default {
  data: () => ({
    loading: false,
    pending: false,
    list: [],
    categoryList: [],
    columns
  }),
  methods: {
    async fetchList() {
      this.loading = true

      // get categories
      // this.categoryList = await this.$store.dispatch("category/fetch")

      // const { data } = await this.$store.dispatch("news/fetch")
      // if (data) {
      //   this.list = data
      // }
      this.loading = false
    }
  }
}
</script>
