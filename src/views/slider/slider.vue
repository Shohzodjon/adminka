<template>
  <a-col>
    <a-col v-if="!$route.params.id">
      <a-row class="content-title" type="flex">
        <a-button type="primary" style="margin-left: auto">
          <a-icon type="plus" />Добавить
        </a-button>
      </a-row>
      <a-table
        :loading="loading"
        :columns="columns"
        :data-source="data"
        :pagination="{ defaultPageSize: 5 }"
        style="margin-top: 25px"
      >
        <img
          slot="image"
          slot-scope="image"
          height="80px"
          :src="filesUrl + image"
        />
        <template slot="operation" slot-scope="item">
          <a-icon
            type="edit"
            class="action-btns"
            @click="
              $router.push({ name: 'slider-detail', params: { id: item.slug } })
            "
          />

          <a-popconfirm
            title="Вы действительно хотите удалить?"
            ok-text="Да"
            cancel-text="Нет"
            @confirm="removeSlider(item)"
          >
            <a-icon type="delete" class="action-btns" style="margin: 0 10px" />
          </a-popconfirm>
        </template>
      </a-table>
    </a-col>
  </a-col>
</template>

<script>
const columns = [
  {
    title: "Изображение",
    dataIndex: "image",
    key: "image",
    scopedSlots: { customRender: "image" },
    width: 250
  },
  { title: "Заголовок", dataIndex: "title_ru", key: "title_ru" },
  { title: "Описание", dataIndex: "content_ru", key: "content_ru" },
  {
    title: "Действие",
    key: "operation",
    scopedSlots: { customRender: "operation" }
  }
]

export default {
  data() {
    return {
      data: [],
      columns,
      loading: false,

      modal: {
        title: "",
        state: false
      }
    }
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    fetchList() {
      this.loading = true
      this.$api
        .get("/site/slider/list")
        .then((res) => {
          if (res && res.data) {
            console.log(res.data)
            this.$set(this, "data", res.data)
          }
          this.loading = false
        })
        .catch((err) => {
          this.loading = false
          console.log(err)
        })
    },

    removeSlider(item) {
      this.loading = true
      if (!(item && item.id)) return
      this.$api
        .delete("/admin/slider/delete/" + item.id)
        .then((res) => {
          if (res) {
            console.log(res)
            this.fetchList()
          }
          this.loading = false
        })
        .catch((err) => {
          console.log(err)
          this.loading = false
        })
    },

    closeModal() {
      this.modal.state = false
      this.modal.title = ""
      this.fileList = []
    }
  }
}
</script>
