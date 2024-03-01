<template>
  <a-row>
    <a-row class="content-title" type="flex">
      <h2 class="flex-1">
        {{ $route.meta.title[$i18n.locale] }}
      </h2>

      <a-row
        class="flex-no__wrap ml-auto wanted-search-input-wrapper"
        type="flex"
      >
        <!-- <searchInput
          v-model="inputs.search.text"
          :placeholder="inputs.search.placeholder[$i18n.locale]"
          :searching="inputs.search.spinner"
          @handler="onSearch"
        /> -->
        <a-button
          type="primary"
          @click="
            $router.push({
              name: 'Legislative-create'
            })
          "
        >
          <a-icon type="plus" />{{ $t("Add") }}
        </a-button>
      </a-row>
    </a-row>

    <a-table
      :key="$route.fullPath"
      :columns="columns"
      :data-source="legislative"
      :loading="loading"
      :pagination="true"
      @change="handleTableChange"
    >
      <template slot="number" slot-scope="item">
        {{ item.id }}
      </template>
      <template slot="position" slot-scope="item">
        <a-input-number id="inputNumber" v-model="item.order" :min="0" />
        <a-button class="success" @click="onSave(item)">
          {{ $t("Save") }}
        </a-button>
      </template>
      <template slot="name" slot-scope="item">
        <router-link
          :to="{
            name: 'Legislative-persons',
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
          style="margin: 0 10px"
          type="edit"
          @click="
            $router.push({
              name: 'Legislative-detail',
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

    <!-- <a-row class="mt-1">
      <a-pagination
        :current="page"
        :total="+tableProps.count || 0"
        @change="toPage"
      />
    </a-row> -->
  </a-row>
</template>
<script>
export default {
  data() {
    return {
      columns: [
        {
          title: "№",
          key: "id",
          class: "wanted-fio-td",
          scopedSlots: { customRender: "number" }
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
          class: "wanted-fio-td",
          scopedSlots: { customRender: "name" },
          width: "60%"
        },
        {
          title: this.$t("UsersColTitle2"),
          key: "operation",
          scopedSlots: { customRender: "operation" }
        }
      ],
      legislative: [],
      loading: false
    }
  },
  created() {
    this.getLegislative()
  },
  methods: {
    async getLegislative() {
      this.loading = true
      this.legislative = await this.$store.dispatch(
        "legislative/getDepartmentList"
      )
      this.loading = false
    },
    handleTableChange() {
      console.log("editing")
    },
    async removeItem(item) {
      try {
        await this.$api.delete(`/structure/department/delete/${item.id}/`)
        this.getLegislative()
      } catch (e) {
        console.log(e)
        this.$message.error("Ошибка!")
      }
    },
    async onSave(item) {
      await this.$api.patch(`/structure/department/update/${item.id}/`, {
        order: item.order
      })
    }
  }
}
</script>
<style scoped>
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
