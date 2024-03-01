<template>
  <a-table
    :columns="columns"
    :data-source="list"
    :loading="loading"
    :pagination="{ defaultPageSize: 10 }"
    :row-key="() => Math.random().toString().slice(2)"
  >
    <template slot="gallery_title" slot-scope="item">
      <a-row align="middle" type="flex" class="fl-no-wrap">
        <a-avatar
          :size="86"
          :src="item.photo || ''"
          class="mr-1x"
          icon="user"
          shape="square"
        />
        {{ item.title || "Нет заголовки" }}
      </a-row>
    </template>

    <template slot="operation" slot-scope="item">
      <a-icon
        class="action-btns"
        type="edit"
        @click="
          $router.push({
            name: 'gallery-detail',
            params: { id: item.id },
            query: { type: 'photo' }
          })
        "
      />
      <a-popconfirm
        cancel-text="Нет"
        ok-text="Да"
        title="Вы действительно хотите удалить?"
        @confirm="removeItem(item)"
      >
        <a-icon class="action-btns" style="margin: 0 10px" type="delete" />
      </a-popconfirm>
    </template>
  </a-table>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        {
          title: this.$t("TagsColTitle"),
          key: "title",
          scopedSlots: { customRender: "gallery_title" },
          width: "90%"
        },
        {
          title: this.$t("UsersColTitle2"),
          key: "operation",
          scopedSlots: { customRender: "operation" }
        }
      ],
      loading: false,
      list: []
    }
  },
  watch: {
    $route: {
      handler: "fetchData",
      immediate: true
    }
  },
  methods: {
    async fetchData() {
      // if (this.$route.query.tab != 'photo') {
      //   return
      // }
      this.loading = true
      try {
        const data = await this.$store.dispatch("gallery/fetchPhoto", {
          type: 0
        })

        // console.log(data)

        // if (data && data.results) {
        //   const d = data.results.map((item) => ({
        //     ...item,
        //     title: this.dataParse(item.title)
        //   }))

        this.$set(this, "list", data)
        // }

        // console.log('ptb', data)
      } catch (err) {
        console.log(err)
      }

      this.loading = false
    },

    async removeItem(arg) {
      if (arg && arg.id) {
        const res = await this.$store.dispatch(
          "gallery/removeItemAction",
          arg.id
        )
        if (res) {
          const f = this.list.findIndex((item) => item.id == arg.id)
          if (f != -1) {
            this.list.splice(f, 1)
          }
        }
      }
    }
  }
}
</script>
