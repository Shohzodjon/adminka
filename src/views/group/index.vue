<template>
  <a-row class="content-fix">
    <a-row class="content-title" type="flex">
      <h2 style="margin-bottom: 0">Разделы</h2>
      <a-button
        style="margin-left: auto"
        type="primary"
        @click="$router.push({ name: 'group-create' })"
      >
        <a-icon type="plus" />
        Добавить
      </a-button>
    </a-row>
    <a-table
      :columns="columns"
      :data-source="$store.getters['group/list']"
      :loading="loading"
      :pagination="{ defaultPageSize: 10 }"
      :row-key="(rec) => rec.id"
    >
      <template slot="lang_title" slot-scope="item">
        <router-link
          :to="{
            name: item.has_category ? 'group-categories' : 'group-news',
            params: { group_id: item.id }
          }"
          class="td-post-item"
          tag="span"
        >
          {{ item.title[$i18n.locale] }}
        </router-link>
      </template>
      <template slot="operation" slot-scope="item">
        <a-icon
          class="action-btns"
          type="edit"
          @click="
            $router.push({ name: 'group-detail', params: { id: item.id } })
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
  </a-row>
</template>

<script>
const columns = [
  {
    title: "Название",
    key: "title",
    scopedSlots: { customRender: "lang_title" }
  },
  {
    title: "Действие",
    key: "operation",
    scopedSlots: { customRender: "operation" },
    width: 300
  }
]
export default {
  data: () => ({
    loading: false,
    columns
  }),
  mounted() {
    if (this.$store.state.token) this.$store.dispatch("group/fetch")
  },
  methods: {
    async removeItem(item) {
      const res = await this.$store.dispatch("group/removeItemAction", item.id)
      // console.log("removeItem", res);
      if (!res) {
        this.$message.success("Группа удалена")
        this.$store.dispatch("group/fetch")
      }
    }
  }
}
</script>

<style></style>
