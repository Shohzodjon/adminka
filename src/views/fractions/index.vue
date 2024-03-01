<template>
  <div class="fractions">
    <div class="fractions_header">
      <h2>{{ title[$i18n.locale] }}</h2>
      <a-button
        style="margin-left: auto"
        type="primary"
        @click="
          $router.push({
            name: 'fraction-create'
          })
        "
      >
        <a-icon type="plus" />{{ $t("Add") }}
      </a-button>
    </div>
    <a-table
      :columns="columns"
      :data-source="fractionList"
      :row-key="(record) => record.id"
      :loading="loading"
      :pagination="{ defaultTabPageSize }"
    >
      <template slot="id" slot-scope="item">
        <b>{{ item.id }}</b>
      </template>
      <template slot="position" slot-scope="item">
        <a-input-number id="inputNumber" v-model="item.position" :min="0" />
        <a-button class="success" @click="onSave(item)">
          {{ $t("Save") }}
        </a-button>
      </template>
      <template slot="fraction_title" slot-scope="item">
        <router-link
          :to="{
            name: 'fraction-detail',
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
              name: 'fraction-detail',
              params: { id: item.id }
            })
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
  </div>
</template>

<script>
export default {
  name: "LeadershipCreate",
  data() {
    return {
      fractionList: [],
      columns: [
        {
          title: "ID",
          key: "id",
          scopedSlots: { customRender: "id" }
        },
        {
          title: this.$t("Position"),
          key: "position",
          scopedSlots: { customRender: "position" },
          width: "20%"
        },
        {
          title: this.$t("TagsColTitle"),
          key: "title",
          scopedSlots: { customRender: "fraction_title" },
          width: "90%"
        },
        {
          title: this.$t("UsersColTitle2"),
          key: "operation",
          scopedSlots: { customRender: "operation" }
        }
      ],
      loading: false,
      title: {
        uz: "Fraksiyalar",
        oz: "Фраксиялар",
        ru: "Фракции",
        en: "Fractions"
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
      let { data } = await this.$api.get("/structure/faction/list/")
      this.fractionList = data
      this.loading = false
      console.log(data)
    },
    async removeItem(item) {
      await this.$api.delete("/structure/faction/delete/" + item.id + "/")
      this.fetchData()
    },
    async onSave(item) {
      await this.$api.patch(`/structure/faction/update/${item.id}/`, {
        position: item.position
      })
      this.fetchData()
    }
  }
}
</script>

<style>
.fractions {
  padding: 20px 0;
}
.fractions_header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.ant-table-pagination.ant-pagination {
  margin-top: 15px;
}
.success {
  background-color: #1890ff;
  margin-left: 8px;
  color: #fff;
  border-radius: 8px;
}
.success:hover {
  background-color: #1890ff;
  color: #fff;
}
.success:focus {
  background-color: #1890ff;
  color: #fff;
}
</style>
