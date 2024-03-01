<template>
  <blank-container
    class="open-data__wrapper"
    :title="$route.meta.title[$i18n.locale]"
    :wrapper-class="'open-data__wrapper'"
    @add-btn="$router.push({ name: 'open-data-create' })"
  >
    <a-table
      :columns="columns"
      :data-source="$store.getters['opendata/list']"
      :loading="loading"
      :pagination="false"
      :row-key="() => Math.random().toString().slice(2)"
      class="leadership-table"
    >
      <template slot="id" slot-scope="item">
        <span class="text-center">{{ item.id }}</span>
      </template>
      <template slot="lang_title" slot-scope="item">
        <b>{{ getFirstFulfilled(JSON.parse(item.title)).text }}</b>
        <br />
        <template v-for="(title, key) in JSON.parse(item.title)">
          <a-tag v-if="title" :key="key">
            <img
              width="14"
              class="flag-svg__tab"
              :src="contentLanguages[key].flagSrc"
              :alt="key"
            />
            {{ contentLanguages[key].abr }}
          </a-tag>
        </template>
      </template>

      <template slot="lang_content" slot-scope="item">
        <b>{{ getFirstFulfilled(JSON.parse(item.content)).text }}</b>
        <br />
        <template v-for="(content, key) in JSON.parse(item.content)">
          <a-tag v-if="content" :key="key">
            <img
              width="14"
              class="flag-svg__tab"
              :src="contentLanguages[key].flagSrc"
              :alt="key"
            />
            {{ contentLanguages[key].abr }}
          </a-tag>
        </template>
      </template>

      <template slot="file_links" slot-scope="item">
        <a-tag v-if="item.csv">
          <a :href="item.csv" download>CSV</a>
        </a-tag>
        <a-tag v-if="item.xml">
          <a :href="item.xml" download>XML</a>
        </a-tag>
        <a-tag v-if="item.json">
          <a :href="item.json" download>JSON</a>
        </a-tag>
      </template>
      <template slot="link" slot-scope="item">
        <a :href="item.link || '//www.uz'" rel="noreferrer" target="blank">{{
          item.link || "www.uz"
        }}</a>
      </template>

      <template slot="operation" slot-scope="item">
        <a-icon
          class="action-btns"
          type="edit"
          @click="
            $router.push({ name: 'open-data-detail', params: { id: item.id } })
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
    <a-row class="content-title" style="margin-top: 15px">
      <a-pagination
        v-model="pagination.page"
        :page-size-options="['2', '10', '20', '30', '40']"
        show-size-changer
        :default-current="1"
        :page-size="pagination.limit"
        :default-page-size="pagination.limit"
        :total="+$store.getters['opendata/count']"
        @showSizeChange="onShowSizeChange"
        @change="paginate"
      />
    </a-row>
  </blank-container>
</template>

<script>
import { CONTENT_LANGUAGES } from "@/constants"
const columns = [
  {
    title: "ID",
    key: "id",
    scopedSlots: { customRender: "id" },
    width: 80,
    className: "text-center font-md"
  },
  {
    title: "Название",
    key: "title",
    scopedSlots: { customRender: "lang_title" }
  },
  {
    title: "Контент",
    key: "content",
    scopedSlots: { customRender: "lang_content" }
  },
  {
    title: "Cылка",
    key: "link",
    scopedSlots: { customRender: "link" }
  },
  {
    title: "Links",
    key: "file_links",
    scopedSlots: { customRender: "file_links" }
  },
  {
    title: "Действие",
    key: "operation",
    scopedSlots: { customRender: "operation" }
  }
]

export default {
  data: () => ({
    loading: false,
    columns,
    pagination: {
      limit: 10,
      page: 1
    }
  }),
  computed: {
    contentLanguages: () => CONTENT_LANGUAGES
  },
  watch: {
    $route: {
      handler: "fetchList",
      immediate: true
    },
    "$i18n.locale": {
      handler: "fetchList",
      immediate: true
    }
  },
  methods: {
    getFirstFulfilled(fields) {
      let lang = this.$i18n.locale
      if (!fields) return {}
      if (fields[lang]) {
        return {
          text: fields[lang],
          lang: lang
        }
      } else {
        const lang = Object.keys(fields).find((l) => fields[l])
        if (!lang) {
          return {}
        }
        return {
          text: fields[lang],
          lang: lang
        }
      }
    },
    paginate(page) {
      this.pagination.page = page
      this.fetchList()
    },
    onShowSizeChange(current, page_size) {
      this.pagination.limit = page_size
      this.pagination.page = current || 1
      this.fetchList()
    },
    async fetchList() {
      this.loading = true
      try {
        await this.$store.dispatch("opendata/fetch", this.pagination)
      } catch (error) {
        console.log(error)
        this.loading = false
      }

      this.loading = false
    },

    async removeItem(item) {
      //todo
      try {
        await this.$store.dispatch("opendata/removeItemAction", item.id)

        // console.log("removeItem", res);
        this.fetchList()
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
