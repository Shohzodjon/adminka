<template>
  <div>
    <a-row class="content-title" type="flex">
      <h2 class="flex-1">
        {{ $route.meta.title[$i18n.locale] }}
      </h2>

      <a-row class="flex-no__wrap wanted-search-input-wrapper" type="flex">
        <a-select
          v-model="activeFilter"
          style="width: 100%"
          option-label-prop="label"
        >
          <a-select-option
            v-for="(item, i) in filters"
            :key="i"
            :value="item.value"
            :label="item && item.text && item.text[$i18n.locale]"
          >
            {{ item && item.text && item.text[$i18n.locale] }}
          </a-select-option>
        </a-select>
      </a-row>
    </a-row>
    <a-row>
      <spinner v-if="loading" />
      <a-table
        v-else-if="commentsList"
        :key="$route.fullPath"
        :columns="columns"
        :data-source="commentsList"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template slot="name" slot-scope="item">
          <a href="#" class="modal-link" @click.prevent="openModal(item)">{{
            item.content
          }}</a>
        </template>
        <template slot="type" slot-scope="item">
          <span>{{ getType(item.type) }}</span>
        </template>
        <template slot="state" slot-scope="item">
          <span>{{ item.states }}</span>
        </template>
        <template slot="operation" slot-scope="item">
          <a-select
            v-model="item.status"
            style="width: 120px"
            default-value="Действие"
            @change="handleComments(item)"
          >
            <a-select-option value="approved">
              {{ $t("Activate") }}
            </a-select-option>
            <a-select-option value="blocked">
              {{ $t("Block") }}
            </a-select-option>
          </a-select>
        </template>
      </a-table>

      <p v-else>Список коментариев пуст</p>
      <a-modal v-model="visible" title="Контент">
        <template slot="footer">
          <button key="back" class="danger" @click="handleCancel">
            {{ $t("Block") }}
          </button>
          <button
            key="submit"
            class="primary"
            :loading="loading"
            @click="handleOk"
          >
            {{ $t("Activate") }}
          </button>
        </template>
        <div v-if="detail" class="detail">
          <h4>
            Ф.И.О :
            {{
              detail.author.last_name +
              " " +
              detail.author.first_name +
              " " +
              detail.author.middle_name
            }}
          </h4>
          <h5>{{ detail.author.username }}</h5>
          <h5>Тип : {{ getType(detail.type) }}</h5>
          <h5 v-if="detail.type == 'state'">Статья :{{ detail.states }}</h5>
          <p>Контент : {{ detail.content }}</p>
          <p>Название Закона : {{ detail.order_project.title }}</p>
        </div>
      </a-modal>

      <!-- <a-row class="mt-1">
      <a-pagination
        :current="page"
        :total="+tableProps.count || 0"
        @change="toPage"
      />
    </a-row> -->
    </a-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      visible: false,
      activeFilter: "",
      detail: null,
      pagination: {},
      offset: 0,
      filters: [
        {
          text: {
            ru: "Все",
            uz: "Barchasi",
            oz: "Барчаси",
            en: "All"
          },
          value: ""
        },
        {
          text: {
            ru: "Новые",
            uz: "Yangi",
            oz: "Янги",
            en: "New"
          },
          value: "pending"
        },
        {
          text: {
            ru: "Активные",
            uz: "Faol",
            oz: "Фаол",
            en: "Active"
          },
          value: "approved"
        },
        {
          text: {
            ru: "Блокированные",
            uz: "Bloklangan",
            oz: "Блокланган",
            en: "Blocked"
          },
          value: "blocked"
        }
      ],
      columns: [
        {
          title: this.$t("TagsColTitle"),
          key: "title",
          class: "wanted-fio-td",
          scopedSlots: { customRender: "name" },
          width: "30%"
        },
        {
          title: this.$t("CommentType"),
          key: "type",
          scopedSlots: { customRender: "type" },
          width: "30%"
        },
        {
          title: this.$t("ArticleNumber"),
          key: "state",
          scopedSlots: { customRender: "state" },
          width: "30%"
        },
        {
          title: this.$t("UsersColTitle2"),
          key: "operation",
          scopedSlots: { customRender: "operation" }
        }
      ],

      commentsList: null
    }
  },
  watch: {
    async activeFilter(val) {
      this.loading = true
      this.commentsList = await this.$store.dispatch(
        "comments/fetchLawsCommentsList",
        {
          status: val
        }
      )
      this.commentsList = this.commentsList.map((e) => ({
        ...e,
        status: e.status == "pending" ? this.$t("NotActive") : e.status
      }))
      this.loading = false
    }
  },
  async created() {
    this.getCommentsList()
  },
  methods: {
    handleTableChange(pagination) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.offset = (this.pagination.current - 1) * 10
      this.getCommentsList()
    },
    async handleComments(item) {
      await this.$api.patch(
        `/structure/orderproject/comment/admin/update/${item.id}/`,
        {
          status: item.status
        }
      )
    },
    async getCommentsList() {
      this.loading = true
      let data = await this.$store.dispatch("comments/fetchLawsCommentsList", {
        limit: 10,
        offset: this.offset
      })
      this.commentsList =
        data &&
        data.results &&
        data.results.map((e) => ({
          ...e,
          status: e.status == "pending" ? this.$t("NotActive") : e.status
        }))
      const pagination = { ...this.pagination }
      pagination.total = data.count
      this.pagination = pagination
      this.loading = false
    },
    async openModal(item) {
      console.log(item)
      this.detail = {
        ...item
      }
      this.visible = true
    },
    async handleCancel() {
      await this.$api.patch(
        `/structure/orderproject/comment/admin/update/${this.detail.id}/`,
        {
          status: "blocked"
        }
      )
      this.getCommentsList()
      this.visible = false
    },
    async handleOk() {
      console.log("sdsd")
      await this.$api.patch(
        `/structure/orderproject/comment/admin/update/${this.detail.id}/`,
        {
          status: "approved"
        }
      )
      this.getCommentsList()
      this.visible = false
    },
    getType(value) {
      return value == "order" ? this.$t("Law") : this.$t("Article")
    }
  }
}
</script>
<style>
.ant-modal {
  max-height: 600px;
}
.scroll-container {
  padding: 20px 0px;
}
input[type="datetime-local"] {
  border-radius: 2px;
  padding: 4px;
  border: 1px solid #c7c7c7;
}
.flex-end {
  justify-content: flex-end;
}
.modal-link {
  color: #222;
}
.modal-link:hover {
  text-decoration: underline;
}
.primary {
  background-color: #28a745;
  outline: none;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  color: #fff;
  cursor: pointer;
}
.danger {
  background-color: #dc3545;
  outline: none;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  color: #fff;
  cursor: pointer;
}
.detail h4 {
  margin-bottom: 16px;
}
.detail h5 {
  margin-bottom: 16px;
}
</style>
