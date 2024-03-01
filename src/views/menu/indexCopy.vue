<template>
  <a-col class="h-100 overflow-hidden">
    <a-row class="content-title" type="flex">
      <h2 style="margin-bottom: 0">
        {{ $route.meta.title[$i18n.locale] }}
      </h2>
      <a-button
        style="margin-left: auto"
        type="primary"
        @click="$router.push({ name: 'menu-create' })"
      >
        <a-icon type="plus" />
        {{ $t("Add") }}
      </a-button>
    </a-row>

    <spinner v-if="loading" />

    <a-row v-else class="list-container menu-list__container thin-scroll">
      <Tree
        :data="sortedChildMenuList"
        cross-tree="cross-tree"
        draggable="draggable"
        @change="$store.commit('menu/setList', arguments[0])"
      >
        <div slot-scope="{ data, store }">
          <span v-if="!data.isDragPlaceHolder">
            <a-icon
              v-if="data.children && data.children.length"
              class="ml-10"
              :type="data.open ? 'minus' : 'plus'"
              @click.stop="store.toggleOpen(data)"
            />
            <span class="mx-1">{{
              data.title[$i18n.locale] || "Нет название"
            }}</span>
            <a-icon
              type="edit"
              class="action-btns"
              @click="
                $router.push({ name: 'menu-detail', params: { id: data.id } })
              "
            />

            <a-popconfirm
              title="Вы действительно хотите удалить?"
              ok-text="Да"
              cancel-text="Нет"
              @confirm="removeItem(data)"
            >
              <a-icon
                type="delete"
                class="action-btns"
                style="margin: 0 10px"
              />
            </a-popconfirm>
          </span>
        </div>
      </Tree>
    </a-row>
  </a-col>
</template>

<script>
import { DraggableTree } from "vue-draggable-nested-tree"
import { breadthFirstSearch } from "tree-helper"

const columns = [
  {
    title: "Название",
    key: "title",
    scopedSlots: { customRender: "lang_title" }
  },
  {
    title: "Действие",
    key: "operation",
    scopedSlots: { customRender: "operation" },
    width: 300
  }
]
export default {
  components: {
    Tree: DraggableTree
    // breadthFirstSearch
  },

  data: () => ({
    loading: false,
    columns,

    list: []
  }),
  computed: {
    menuList() {
      return (
        (this.$store.getters["menu/list"] &&
          this.$store.getters["menu/list"].map((item) => ({
            ...item,
            title: item.title,
            open: false
          }))) ||
        [] ||
        []
      )
    },
    sortedMenuList() {
      return (
        (this.list &&
          this.list.slice().sort((a, b) => a.position - b.position)) ||
        []
      )
    },
    sortedChildMenuList() {
      return (
        this.sortedMenuList &&
        this.sortedMenuList.slice().map((item) => ({
          ...item,
          children:
            item.children &&
            item.children.slice().sort((a, b) => a.position - b.position)
        }))
      )
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        const data = await this.$store.dispatch("menu/fetch")

        // console.log("data", data);
        const d =
          (data &&
            data.map((item) => ({
              ...item,
              title: {
                ...this.langKeys,
                ...(item.title && JSON.parse(item.title))
              },
              children:
                item.children &&
                item.children.map((c) => ({
                  ...c,
                  title: {
                    ...(c.title && JSON.parse(c.title))
                  }
                })),
              draggable: false,
              open: false
            }))) ||
          []
        this.$set(this, "list", d)

        this.collapseAll()
        this.loading = false
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    expandAll() {
      breadthFirstSearch(this.list, (node) => {
        node.open = true
      })
    },
    collapseAll() {
      breadthFirstSearch(this.list, (node) => {
        node.open = false
      })
    },
    // eslint-disable-next-line no-unused-vars
    dragHandler(node, targetTree, oldTree) {
      // console.log('dragHandler', node, targetTree, oldTree)
      // console.log(this.list);
    },
    async removeItem(arg) {
      try {
        const res = await this.$store.dispatch("menu/removeItemAction", arg.id)
        if (res) {
          this.fetchData()
        } else {
          throw "Не удалось удалить"
        }
        // console.log(res)
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="scss">
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
