<template>
  <a-table
    :columns="columns"
    :data-source="list"
    :loading="loading"
    :pagination="{ defaultPageSize: 10 }"
    :row-key="(item) => item.id"
  >
    <template slot="gallery_title" slot-scope="item">
      <a-row align="middle" class="fl-no-wrap" type="flex">
        <!--        <a-avatar v-if="item.files && item.files.length && filesUrl + item.files[0].file"-->
        <!--          :size="86"-->
        <!--          :src="filesUrl + item.files[0].file"-->
        <!--          class="mr-1x"-->
        <!--          icon="user"-->
        <!--          shape="square"-->
        <!--        />-->
        <a-icon
          :style="{ fontSize: '36px' }"
          class="mr-2x"
          type="video-camera"
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
            query: { type: 'video' }
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
      // if (this.$route.query.tab != 'video') {
      //   return
      // }
      this.loading = true
      try {
        const data = await this.$store.dispatch("gallery/fetchVideo", {
          type: 1
        })

        console.log(data)
        // if (data && data.results) {
        //   const d = data.results.map((item) => ({
        //     ...item
        //     // title: this.dataParse(item.title)
        //   }))

        //   this.$set(this, "list", d)
        // }

        this.list = data

        // console.log('ptb', data)
      } catch (err) {
        console.log(err)
        this.loading = false
      }

      this.loading = false
    },
    async removeItem(arg) {
      console.log(arg, "arg")
      if (arg && arg.id) {
        const res = await this.$store.dispatch(
          "gallery/removeVideoGallery",
          arg
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
