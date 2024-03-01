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

    <!-- <a-row v-else class="list-container menu-list__container thin-scroll">
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
            <span class="mx-1">{{ node.title || "Нет название" }}</span>
            <a-icon
              type="edit"
              class="action-btns"
              @click="
                $router.push({ name: 'menu-detail', params: { id: node.id } })
              "
            />

            <a-popconfirm
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
            </a-popconfirm>
          </span>
        </div>
      </Tree>
    </a-row> -->
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
                name: 'menu-detail',
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
            <a-icon
              type="edit"
              class="action-btns"
              @click="
                $router.push({ name: 'menu-detail', params: { id: node.id } })
              "
            />
            <a-popconfirm
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
            </a-popconfirm>
          </span>
        </div>
      </Tree>
    </a-row>
  </a-col>
</template>

<script>
import "he-tree-vue/dist/he-tree-vue.css"
import { Tree, Fold } from "he-tree-vue"

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
    Tree: Tree.mixPlugins([Fold])
    // breadthFirstSearch
  },

  data: () => ({
    loading: false,
    columns,
    list: []
  }),
  computed: {},
  mounted() {
    this.fetchData()
  },
  methods: {
    parseTitles(list) {
      return (
        list &&
        list.map((item) => ({
          ...item,
          $folded: true,
          title: {
            ...this.langKeys,
            ...(item.title && JSON.parse(item.title))
          },
          children: (item.children && this.parseTitles(item.children)) || []
        }))
      )
    },

    async fetchData() {
      this.loading = true
      try {
        const data = await this.$store.dispatch("menu/fetch")

        // console.log("data", data);
        // const d = (data && this.parseTitles(data)) || []
        this.$set(this, "list", data)

        this.loading = false
      } catch (err) {
        console.log(err)
      }
      this.loading = false
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
