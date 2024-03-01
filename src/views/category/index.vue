<template>
  <a-row class="content-fix">
    <a-row class="content-title" type="flex">
      <h2>{{ $t("allCategory") }}</h2>

      <!-- <a-button
        style="margin-left: auto"
        type="primary"
        @click="
          $router.push({
            name: 'post-create'
          })
        "
      >
        <a-icon type="plus" />Добавить
      </a-button> -->
    </a-row>

    <!-- <a-table
      :columns="columns"
      :data-source="list"
      :loading="loading"
      :pagination="{ defaultTabPageSize }"
      :row-key="(record) => record.id"
    >
      <template slot="id" slot-scope="item">
        <b>{{ item.id }}</b>
      </template>
      <template slot="news_title" slot-scope="item">
        <router-link
          :to="{
            name: 'posts',
            params: {
              id: item.id
            }
          }"
          class="td-post-item"
          tag="span"
        >
          <span v-if="item.is_main" class="mr-1">
            <a-icon type="pushpin" />
          </span>
          <span>{{ item.title }}</span>
        </router-link>
      </template>
      <template slot="operation" slot-scope="item">
        <a-icon
          class="action-btns"
          type="edit"
          @click="
            $router.push({ name: 'category-edit', params: { cat_id: item.id } })
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
    </a-table> -->
    <!-- <a-row class="mt-1">
      <a-pagination
        :current="$route.query.page || 1"
        :total="tableProps.count || 0"
        @change="toPage"
      />
    </a-row>-->

    <a-row class="list-container menu-list__container thin-scroll">
      <Tree :value="sortChildMenuList(list)">
        <div slot-scope="{ node, tree, path }">
          <span v-if="!node.isDragPlaceHolder">
            <a-icon
              v-if="node.children && node.children.length"
              class="ml-10"
              :type="node.$folded ? 'plus' : 'minus'"
              @click="tree.toggleFold(node, path)"
            />
            <router-link
              :to="{
                name:
                  node && node.children && node.children.length > 0
                    ? ''
                    : 'posts',
                params: {
                  id: node.id
                }
              }"
              class="td-post-item"
              tag="span"
            >
              <span v-if="node.is_main" class="mr-1">
                <a-icon type="pushpin" />
              </span>
              <span>{{ node.title || "Нет название" }}</span>
            </router-link>
            <!-- <a-icon
              type="edit"
              class="action-btns"
              @click="
                $router.push({ name: 'menu-detail', params: { id: node.id } })
              " 
            /> -->

            <!-- <a-popconfirm
              title="Вы действительно хотите удалить?"
              ok-text="Да"
              cancel-text="Нет"
              @confirm="removeItem(node)"
            >
              <a-icon
                type="delete"
                class="action-btns"
                style="margin: 0 10px"
              />
            </a-popconfirm> -->
          </span>
        </div>
      </Tree>
    </a-row>
  </a-row>
</template>

<script>
import "he-tree-vue/dist/he-tree-vue.css"
import { Tree, Fold } from "he-tree-vue"

const columns = [
  {
    title: "ID",
    key: "id",
    scopedSlots: { customRender: "id" }
  },
  {
    title: "Название",
    key: "title",
    scopedSlots: { customRender: "news_title" },
    width: "98%"
  }
  // {
  //   title: "Действие",
  //   key: "operation",
  //   scopedSlots: { customRender: "operation" }
  // }
]

export default {
  components: {
    Tree: Tree.mixPlugins([Fold])
  },
  data: () => ({
    loading: false,
    columns,
    categoryForm: {},
    categoryNews: [],
    tableProps: {
      results: [],
      count: 1
    },
    page: 1,
    list: []
  }),
  watch: {
    $route: {
      handler: "fetchData",
      immediate: true
    },
    "$i18n.locale": {
      handler: "fetchData",
      immediate: true
    }
  },
  // created() {
  //   this.$router.push("/posts")
  // },
  methods: {
    async removeItem(item) {
      try {
        const r = await this.$store.dispatch(
          "category/removeItemAction",
          item.id
        )

        if (r) {
          if (this.tableProps && this.tableProps.results) {
            const f = this.tableProps.results.findIndex(
              (elem) => elem.id == item.id
            )

            if (f != -1) {
              this.tableProps.results.splice(f, 1)
              this.$message.succes("Успешно удалено")
            }
          }
        }
      } catch (error) {
        this.$sentry.captureMessage(error)
      }
    },
    toPage(arg) {
      this.page = arg || 1
      this.$router.push({ query: { page: this.page } })
    },
    async fetchData() {
      this.loading = true

      try {
        let res = await this.$store.dispatch("category/fetch")
        this.list = res
        // console.log(this.list)
      } catch (e) {
        console.error(e)
        this.$sentry.captureMessage(e)
      }

      this.loading = false
    },
    sortChildMenuList(list) {
      return (
        list &&
        list
          .slice()
          .map((item) => ({
            ...item,
            children:
              (item.children && this.sortChildMenuList(item.children)) || []
          }))
          .slice()
          .sort((a, b) => a.position - b.position)
      )
    }
  }
}
</script>

<style lang="scss">
.ant-table-row-collapsed {
  display: none;
}
.tree-node-inner {
  padding: 5px;
  border: 1px solid #ccc;
  cursor: pointer;
  border-radius: 5px;
}

// .draggable-placeholder {
// }

.draggable-placeholder-inner {
  border: 1px dashed #0088f8;
  box-sizing: border-box;
  background: rgba(0, 136, 249, 0.09);
  color: #0088f9;
  text-align: center;
  padding: 0;
  display: flex;
  align-items: center;
}

.tree3 .tree-node-inner {
  border: none;
  padding: 0px;
}

.tree3 .tree-node-inner-back:hover {
  background: #ddd;
}

.tree4 .tree-node-inner {
  border: none;
  border-bottom: 1px solid #ccc;
  padding: 5px 10px;
  background: #ccc;
}

.tree4 .draggable-placeholder-inner {
  background-color: orangered;
}
</style>
