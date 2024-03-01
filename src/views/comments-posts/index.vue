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
        :pagination="true"
        @change="handleTableChange"
      >
        <template slot="name" slot-scope="item">
          <a href="#" class="modal-link" @click.prevent="openModal(item)">{{
            item.content
          }}</a>
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

      <p v-else>{{ $t("CommentEmpty") }}</p>
      <a-modal v-model="visible" :title="$t('Content')">
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
            {{ $t("FISH") }} :
            {{
              detail.author.last_name +
              " " +
              detail.author.first_name +
              " " +
              detail.author.middle_name
            }}
          </h4>
          <h4>{{ $t("TagsColNumber") }} : {{ detail.author.username }}</h4>
          <p>{{ $t("Content") }} : {{ detail.content }}</p>
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
          width: "90%"
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
        "comments/fetchPostCommnetsList",
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
    handleTableChange() {
      console.log("edit")
    },
    async handleComments(item) {
      await this.$api.patch(`/cms/post/comment/${item.id}/update/`, {
        status: item.status
      })
    },
    async getCommentsList() {
      this.loading = true
      const comments = await this.$store.dispatch(
        "comments/fetchPostCommnetsList"
      )
      this.commentsList = comments.map((e) => ({
        ...e,
        status: e.status == "pending" ? this.$t("NotActive") : e.status
      }))

      this.loading = false
    },
    async openModal(item) {
      console.log(item)
      this.detail = await this.$store.dispatch(
        "comments/fetchPostCommentById",
        item.id
      )
      this.visible = true
    },
    async handleCancel() {
      await this.$api.patch(`/cms/post/comment/${this.detail.id}/update/`, {
        status: "blocked"
      })
      this.getCommentsList()
      this.visible = false
    },
    async handleOk() {
      console.log("sdsd")
      await this.$api.patch(`/cms/post/comment/${this.detail.id}/update/`, {
        status: "approved"
      })
      this.getCommentsList()
      this.visible = false
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
