<template>
  <div class="commissions">
    <div class="commissions_header">
      <h2>{{ title[$i18n.locale] }}</h2>
      <a-button
        style="margin-left: auto"
        type="primary"
        @click="
          $router.push({
            name: 'friendship-create'
          })
        "
      >
        <a-icon type="plus" />{{ $t("Add") }}
      </a-button>
    </div>
    <a-table
      :columns="columns"
      :data-source="friendshipGroup"
      :row-key="(record) => record.id"
      :loading="loading"
      :pagination="{ defaultTabPageSize }"
    >
      <template slot="id" slot-scope="item">
        <b>{{ item.id }}</b>
      </template>
      <template slot="commission_title" slot-scope="item">
        <router-link
          :to="{
            name: 'friendship-detail',
            params: {
              id: item.id
            }
          }"
          class="td-post-item"
          tag="span"
        >
          <span>{{ item.title }}</span>
        </router-link>
      </template>
      <template slot="operation" slot-scope="item">
        <a-icon
          class="action-btns"
          type="edit"
          @click="
            $router.push({
              name: 'friendship-detail',
              params: { id: item.id }
            })
          "
        />
        <a-popconfirm
          :cancel-text="$t('No')"
          :ok-text="$t('Yes')"
          :title="$t('DeleteYes')"
          @confirm="removeItem(item.id)"
        >
          <a-icon class="action-btns" style="margin: 0 10px" type="delete" />
        </a-popconfirm>
      </template>
    </a-table>
  </div>
</template>

<script>
export default {
  name: "Commissions",
  data() {
    return {
      friendshipGroup: [],
      columns: [
        {
          title: "ID",
          key: "id",
          scopedSlots: { customRender: "id" }
        },
        {
          title: this.$t("TagsColTitle"),
          key: "title",
          scopedSlots: { customRender: "commission_title" },
          width: "90%"
        },
        {
          title: this.$t("UsersColTitle2"),
          key: "operation",
          scopedSlots: { customRender: "operation" }
        }
      ],
      loadeing: false,
      title: {
        uz: "Do'stlik guruhlari",
        oz: "Дўстлик гуруҳлари",
        ru: "группы дружбы",
        en: "friendly groups"
      }
    }
  },
  created() {
    this.fetchData()
    console.log(this.$route)
  },
  methods: {
    async fetchData() {
      this.loading = true
      this.friendshipGroup = await this.$store.dispatch(
        "friendship/fetchFriendshipGroup"
      )
      this.loading = false
    },
    async removeItem(id) {
      await this.$api.delete(`/structure/deputyfriendship/delete/${id}/`)
      this.fetchData()
    }
  }
}
</script>

<style>
.commissions {
  padding: 20px 0;
}
.commissions_header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>
