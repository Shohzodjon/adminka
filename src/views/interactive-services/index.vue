<template>
  <a-row>
    <a-row class="content-title" type="flex">
      <h2 class="flex-1">{{ $route.meta.title[$i18n.locale] }}</h2>

      <a-row class="flex-no__wrap wanted-search-input-wrapper" type="flex">
        <a-button
          type="primary"
          @click="$router.push({ name: 'interactiveServices-create' })"
        >
          <a-icon type="plus" />{{ $t("Add") }}
        </a-button>
      </a-row>
    </a-row>
    <a-table
      :columns="columns"
      :data-source="form"
      :loading="loading"
      :pagination="{ defaultTabPageSize }"
      :row-key="(record) => record.id"
    >
      <template slot="id" slot-scope="item">
        <b>{{ item.id }}</b>
      </template>
      <template slot="name" slot-scope="item">
        <router-link
          :to="{
            name: 'interactiveServices-detail',
            params: {
              id: item.id
            }
          }"
          class="td-post-item"
          tag="span"
          >{{ item.title }}</router-link
        >
      </template>
      <template slot="operation" slot-scope="item">
        <a-popconfirm
          :cancel-text="$t('No')"
          :ok-text="$t('Yes')"
          :title="$t('DeleteYes')"
          @confirm="removeItem(item.id)"
        >
          <a-icon class="action-btns" style="margin: 0 25px" type="delete" />
        </a-popconfirm>
      </template>
    </a-table>
  </a-row>
</template>

<script>
export default {
  data() {
    return {
      form: [],
      loading: false,
      columns: [
        {
          title: "ID",
          key: "id",
          scopedSlots: { customRender: "id" }
        },
        {
          title: this.$t("TagsColTitle"),
          key: "name",
          scopedSlots: { customRender: "name" },
          width: "90%"
        },
        {
          title: this.$t("UsersColTitle2"),
          key: "operation",
          scopedSlots: { customRender: "operation" }
        }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        const form = await this.$store.dispatch(
          "interactiveServices/fetchInteractiveServices"
        )
        this.form = form
        this.loading = false
      } catch (error) {
        console.log(error)
        this.loading = false
      }
    },
    async removeItem(id) {
      this.loading = true
      try {
        await this.$api.delete(`/common/interactive-services/delete/${id}/`)
        this.fetchData()
        this.$message.success("Интерактивный сервис успешно удален")
        this.loading = false
      } catch (error) {
        console.log(error)
        this.loading = false
      }
    }
  }
}
</script>
<style scoped>
.wanted-search-input-wrapper {
  justify-content: flex-end;
}
</style>
