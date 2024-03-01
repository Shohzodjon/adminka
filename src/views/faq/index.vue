<template>
  <blank-container
    :title="$route.meta.title[$i18n.locale]"
    @add-btn="$router.push({ name: 'faq-create' })"
  >
    <a-table
      :columns="columns"
      :data-source="$store.getters['faq/sortedList']"
      :loading="loading"
      :pagination="{ defaultPageSize: 10 }"
      :row-key="() => Math.random().toString().slice(2)"
      class="leadership-table"
    >
      <template slot="position" slot-scope="item">
        <span class="text-center">{{ item.position }}</span>
      </template>

      <template slot="question" slot-scope="item">
        <span class="text-center">{{
          removeTags(item.question[$i18n.locale]) || "Не заполнено"
        }}</span>
      </template>

      <template slot="operation" slot-scope="item">
        <a-icon
          class="action-btns"
          type="edit"
          @click="$router.push({ name: 'faq-detail', params: { id: item.id } })"
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
  </blank-container>
</template>

<script>
const columns = [
  {
    title: "Поз.",
    key: "position",
    scopedSlots: { customRender: "position" },
    className: "text-center font-md"
  },
  {
    title: "Вопрос",
    key: "question",
    scopedSlots: { customRender: "question" },
    width: "90%"
  },
  {
    title: "Действие",
    key: "operation",
    scopedSlots: { customRender: "operation" }
  }
]
export default {
  data: () => ({
    loading: false,
    columns
  }),
  watch: {
    $route: {
      handler: "fetchData",
      immediate: true
    }
  },
  methods: {
    async fetchData() {
      this.loading = true

      try {
        await this.$store.dispatch("faq/fetch")

        // if (r) {
        // console.log(r);
        // }
      } catch (error) {
        console.log(error)
        this.loading = false
      }
      this.loading = false
    },
    removeItem(arg) {
      try {
        this.$store.dispatch("faq/removeItemAction", arg.id)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style></style>
