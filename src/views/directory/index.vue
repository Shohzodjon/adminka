<template>
  <blank-container :title="$route.meta.title[$i18n.locale]" @add-btn="setModal">
    <a-tabs :default-active-key="activeTabName" tab-position="left">
      <!--tags-->
      <a-tab-pane key="tags" tab="Теги">
        <h3 v-if="!loader && c_tabData.length == 0">Пусто</h3>
        <spinner v-else-if="loader" />
        <span v-else>
          <d-item
            v-for="item in c_tabData"
            :key="item + '_' + Math.random().toString().slice(2)"
            @delete="deleteMethod(item.id)"
            @edit="setModal(item)"
            >{{ item.name }}</d-item
          >
        </span>
      </a-tab-pane>
    </a-tabs>

    <a-modal
      v-if="modal.state"
      v-model="modal.state"
      :footer="null"
      :title="
        modal && modal.data && modal.data.id ? 'Редактировать' : 'Добавить'
      "
      centered
    >
      <component
        :is="`modal-${activeTabName}`"
        :data="modal.data"
        @cancel="setModal(false)"
        @submit="submitModal"
      />
    </a-modal>
  </blank-container>
</template>

<script>
import modalComponents from "@/components/directory/modal-components"
import directoryItem from "@/components/directory/directory-item"

export default {
  components: {
    ...modalComponents,
    "d-item": directoryItem
  },
  data: () => ({
    activeTabName: "tags",
    tabData: null,
    loader: false,
    modal: {
      state: false,
      data: null
    }
  }),

  computed: {
    c_tabData() {
      return (
        (this.tabData &&
          this.tabData
            .slice()
            .sort((a, b) => new Date(a.created) - new Date(b.created))) ||
        []
      )
    }
  },
  watch: {
    $route: {
      handler: "getTabData",
      immediate: true
    }
  },

  methods: {
    async deleteMethod(args) {
      // alert(args)
      // delete method will init function with active tab name
      await this.$store.dispatch(`${this.activeTabName}/delete`, args)
      // console.log("deleteMethod", res);

      this.getTabData()
    },
    async submitModal(args) {
      try {
        await this.$store.dispatch(`${this.activeTabName}/submit`, args)
        // console.log("submitModal", res);
      } catch (e) {
        console.log("submitModal", e)
      }

      this.setModal(false)
      this.getTabData()
    },
    setModal(obj) {
      this.modal = {
        data: obj && obj.id && obj,
        state: !!obj
      }
    },
    async getTabData() {
      this.loader = true

      // fetch active tab data
      try {
        const res = await this.$store.dispatch(`${this.activeTabName}/fetch`)

        this.tabData = res || []
      } catch (err) {
        console.log(err)
      }

      this.loader = false
    }
  }
}
</script>
