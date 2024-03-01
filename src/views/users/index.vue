<template>
  <a-row>
    <a-row class="content-title" type="flex">
      <h2>{{ $t("UserTitle") }}</h2>
      <a-button
        style="margin-left: auto"
        type="primary"
        @click="$router.push({ name: 'user-create' })"
      >
        <a-icon type="plus" /> {{ $t("Add") }}
      </a-button>
    </a-row>

    <a-table
      :columns="columns"
      :data-source="list"
      :loading="loading"
      :pagination="{ defaultPageSize: 5 }"
    >
      <template slot="operation" slot-scope="item">
        <a-icon
          class="action-btns"
          type="edit"
          @click="
            $router.push({ name: 'user-detail', params: { id: item.id } })
          "
        />
        <a-popconfirm
          :cancel-text="$t('No')"
          :ok-text="$t('Yes')"
          :title="$t('DeleteYes')"
          @confirm="removeUser(item)"
        >
          <a-icon class="action-btns" style="margin: 0 10px" type="delete" />
        </a-popconfirm>
      </template>
    </a-table>
    <!-- <pre>{{list}}</pre> -->
  </a-row>
</template>

<script>
// const columns = [
//   {
//     title: this.$t("UsersColTitle"),
//     dataIndex: "username",
//     key: "username",
//     width: "90%"
//   },
//   // { title: "Дата регистрации", dataIndex: "created", key: "created" },
//   {
//     title: "Действие",
//     key: "operation",
//     scopedSlots: { customRender: "operation" }
//   }
// ]

export default {
  data() {
    return {
      loading: false,
      list: [],
      columns: [
        {
          title: this.$t("UsersColTitle"),
          dataIndex: "username",
          key: "username",
          width: "90%"
        },
        // { title: "Дата регистрации", dataIndex: "created", key: "created" },
        {
          title: this.$t("UsersColTitle2"),
          key: "operation",
          scopedSlots: { customRender: "operation" }
        }
      ]
    }
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    async fetchList() {
      this.loading = true
      // try {
      const { data } = (await this.$store.dispatch("user/fetchList")) || []
      if (data) {
        this.list = data
      }
      this.loading = false
    },
    async removeUser(arg) {
      try {
        const r = await this.$api.delete("/account/user/delete/" + arg.id + "/")

        if (r && r.status >= 200 && r.status < 300) {
          const f = this.list.findIndex((item) => item.id == arg.id)

          if (f != -1) {
            this.list.splice(f, 1)
          }
        }
        // console.log(r)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
