<template>
  <a-row>
    <a-row class="content-title" type="flex">
      <h2 class="flex-1">
        {{ $route.meta.title[$i18n.locale] }}
      </h2>
    </a-row>
    <spinner v-if="loading" />
    <a-table
      v-else-if="form.length"
      :key="$route.fullPath"
      :columns="columns"
      :data-source="form"
      :loading="loading"
      :pagination="true"
    >
      <template slot="id" slot-scope="item">
        <b>{{ item.id }}</b>
      </template>
      <template slot="name" slot-scope="item">
        <a
          :href="item.page_url"
          target="_blank"
          class="td-post-item link"
          tag="span"
        >
          {{ item.mistake }}
        </a>
      </template>
      <template slot="content" slot-scope="item">
        <span>{{ item.description }}</span>
      </template>
    </a-table>
    <p v-else>{{ $t("ListBroadcast") }}</p>
  </a-row>
</template>

<script>
// const columns = [
//   {
//     title: "ID",
//     key: "id",
//     scopedSlots: { customRender: "id" }
//   },
//   {
//     title: "Название",
//     key: "name",
//     scopedSlots: { customRender: "name" },
//     width: "90%"
//   },
//   {
//     title: "Действие",
//     key: "operation",
//     scopedSlots: { customRender: "operation" }
//   }
// ]

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
          width: "30%"
        },
        {
          title: this.$t("Content"),
          key: "content",
          scopedSlots: { customRender: "content" },
          width: "70%"
        }
      ]
    }
  },
  async created() {
    this.fetchData()
  },
  methods: {
    setPage(pageNumber) {
      this.$router.push({
        query: {
          ...this.$route.query,
          page: pageNumber
        }
      })
    },
    async fetchData() {
      this.loading = true
      const form = await this.$store.dispatch("mistakes/fetchMistakes")
      this.form = form
      this.loading = false
    },
    async removeItem(id) {
      this.loading = true
      try {
        const r = await this.$api.delete(`/structure/livestream/${id}/`)
        if (r) {
          this.fetchData()
          this.$message.success("Прямой эфир успешно удален")
        }
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
.link {
  color: #222;
}
.link:hover {
  color: red;
}
</style>
