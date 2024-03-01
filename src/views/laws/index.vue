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
              name: 'laws-create'
            })
          "
        >
          <a-icon type="plus" />{{ $t("Add") }}
        </a-button>
      </a-row>
    </a-row>
    <spinner v-if="loading" />

    <a-table
      v-else-if="laws.length"
      :key="$route.fullPath"
      :columns="columns"
      :data-source="laws"
      :loading="loading"
      :pagination="true"
      @change="handleTableChange"
    >
      <template slot="number" slot-scope="item">
        {{ item.id }}
      </template>
      <template slot="name" slot-scope="item">
        {{ item.title }}
      </template>
      <template slot="operation" slot-scope="item">
        <a-icon
          class="action-btns"
          style="margin: 0 10px"
          type="edit"
          @click="
            $router.push({ name: 'laws-detail', params: { id: item.id } })
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
    <p v-else>{{ $("LawsEmpty") }}</p>

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
          title: this.$t("TagsColTitle"),
          key: "title",
          class: "wanted-fio-td",
          scopedSlots: { customRender: "name" },
          width: "80%"
        },
        {
          title: this.$t("UsersColTitle2"),
          key: "operation",
          scopedSlots: { customRender: "operation" }
        }
      ],
      laws: [],
      loading: false
    }
  },
  created() {
    this.getAllLaws()
  },
  methods: {
    async getAllLaws() {
      this.loading = true
      this.laws = await this.$store.dispatch("laws/fetchAllLaws")
      this.loading = false
    },
    handleTableChange() {
      console.log("editing")
    },
    async removeItem(item) {
      try {
        await this.$api.delete(`/common/laws/delete/${item.id}/`)
        this.getAllLaws()
      } catch (e) {
        console.log(e)
        this.$message.error("Ошибка!")
      }
    }
  }
}
</script>
<style></style>
