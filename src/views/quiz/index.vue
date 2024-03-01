<template>
  <div class="committees">
    <div class="committees_header">
      <h2>{{ $route.meta.title[$i18n.locale] }}</h2>
      <a-button
        style="margin-left: auto"
        type="primary"
        @click="$router.push({ name: 'quiz-create' })"
      >
        <a-icon type="plus" />{{ $t("Add") }}
      </a-button>
    </div>

    <a-table
      :loading="loading"
      :columns="columns"
      :data-source="dataSource"
      :pagination="{ defaultPageSize: 10 }"
    >
      <template slot="id" slot-scope="id">
        <b>{{ id }}</b>
      </template>
      <template slot="question" slot-scope="item">
        {{ item }}
      </template>
      <template slot="operation" slot-scope="item">
        <a-icon
          type="edit"
          class="action-btns"
          @click="
            $router.push({ name: 'quiz-detail', params: { id: item.id } })
          "
        />
        <a-popconfirm
          :cancel-text="$t('No')"
          :ok-text="$t('Yes')"
          :title="$t('DeleteYes')"
          @confirm="removeNews(item.id)"
        >
          <a-icon type="delete" class="action-btns" style="margin: 0 10px" />
        </a-popconfirm>
      </template>
    </a-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      langTab: $langPrefix,
      dataSource: null,
      columns: [
        {
          title: "ID",
          key: "id",
          dataIndex: "id",
          scopedSlots: { customRender: "id" }
        },
        {
          title: this.$t("TagsColTitle"),
          dataIndex: "question",
          key: "question",
          width: "95%",
          scopedSlots: { customRender: "question" }
        },
        {
          title: this.$t("UsersColTitle2"),
          key: "operation",
          scopedSlots: { customRender: "operation" }
        }
      ],
      loading: false
    }
  },
  computed: {},

  async mounted() {
    this.loading = true
    this.dataSource = await this.$store.dispatch("quiz/fetchQuiz")
    this.loading = false
    console.log(this.dataSource)
    // this.getPoll().then((res) => {
    //   if (res) {
    //     // eslint-disable-next-line no-unused-vars
    //     const { id, ...props } = res
    //     this.form = props
    //     console.log(this.form)
    //   }
    // })
  },
  methods: {
    async removeNews(itemId) {
      try {
        let res = await this.$api.delete("/cms/survey/" + itemId + "/delete/")
        if (res && res.status == 204) {
          this.dataSource = this.dataSource.filter((item) => item.id != itemId)
        }
      } catch (err) {
        console.log(err)
      }
    },
    async onSearch() {
      if (this.searchText.length > 2) {
        const { data } = await this.$api.get("/search/text/", {
          params: {
            query: this.searchText
          }
        })
        console.log("SEARCh", data)
      }
    }
  }
}
</script>
<style scoped>
.content-fix {
  display: flex;
  flex-direction: column;
}
.committees {
  padding: 20px 0;
}
.committees_header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>
