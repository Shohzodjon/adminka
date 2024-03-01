<template>
  <blank-container
    :title="$route.meta.title[$i18n.locale]"
    @add-btn="$router.push({ name: 'department-create' })"
  >
    <a-table
      :columns="columns"
      :data-source="$store.getters['department/list']"
      :loading="loading"
      :pagination="{ defaultPageSize: 10 }"
      :row-key="() => Math.random().toString().slice(2)"
      class="department-table"
    >
      <template slot="ID" slot-scope="item">
        <span class="text-center">{{ item.id }}</span>
      </template>
      <template slot="position" slot-scope="item">
        <span class="text-center">{{ item.position }}</span>
      </template>
      <template slot="lang_title" slot-scope="item">
        <a-row align="middle" type="flex">
          <a-avatar
            :size="64"
            :src="item.avatar && filesUrl + item.avatar"
            class="mr-1x"
            icon="user"
            shape="square"
          />
          {{ item.full_name || "Не указано" }}
        </a-row>
      </template>

      <template slot="department_name" slot-scope="item">
        <a-row align="middle" type="flex">
          {{ item.department_name || "Не указано" }}
        </a-row>
      </template>
      <template slot="status" slot-scope="item">
        <a-row align="middle" type="flex">
          <a-tag :color="item.status ? 'geekblue' : 'volcano'">
            {{ item.status ? "Опубликован" : "Не опубликован" }}
          </a-tag>
        </a-row>
      </template>
      <template slot="operation" slot-scope="item">
        <a-icon
          class="action-btns"
          type="edit"
          @click="
            $router.push({ name: 'department-detail', params: { id: item.id } })
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
  </blank-container>
</template>

<script>
const columns = [
  {
    title: "ID",
    key: "ID",
    scopedSlots: { customRender: "ID" },
    width: 100,
    className: "text-center font-md"
  },
  {
    title: "Поз.",
    key: "position",
    scopedSlots: { customRender: "position" },
    className: "text-center font-md"
  },
  {
    title: "Ф.И.О",
    key: "title",
    scopedSlots: { customRender: "lang_title" }
  },
  {
    title: "Название подразделения",
    key: "department_name",
    scopedSlots: { customRender: "department_name" }
  },
  {
    title: "Статус",
    key: "status",
    scopedSlots: { customRender: "status" }
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
    },
    "$i18n.locale": {
      handler: "fetchData",
      immediate: true
    }
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        await this.$store.dispatch("department/fetch")
      } catch (error) {
        console.error(error)
        this.loading = false
      }

      this.loading = false
    },

    async removeItem(item) {
      //todo
      try {
        const res = await this.$store.dispatch(
          "department/removeItemAction",
          item.id
        )

        console.log("removeItem", res)
        this.fetchData()
      } catch (e) {
        console.error("removeItem", e)
      }
    }
  }
}
</script>
