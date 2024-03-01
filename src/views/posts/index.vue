<template>
  <a-row>
    <a-row class="content-title" type="flex">
      <a-col>
        <h2>
          {{
            categoryProps &&
            categoryProps.title &&
            categoryProps.title[$i18n.locale]
          }}
        </h2>
      </a-col>
      <a-col style="margin-left: auto">
        <a-input
          v-model="searchText"
          :placeholder="$t('search')"
          class="input-search"
          @input="search"
        />
        <a-button
          style="margin-left: auto"
          type="primary"
          @click="createFunc()"
        >
          <a-icon type="plus" />{{ $t("Add") }}
        </a-button>
      </a-col>
    </a-row>
    <a-table
      :columns="columns"
      :data-source="categoryProps || []"
      :loading="loading"
      :pagination="false"
      :row-key="(rec) => rec.id"
    >
      <div
        slot="news_title"
        slot-scope="item"
        class="td-post-item"
        @click="
          $router.push({
            name: 'post-update',
            params: { id: item.id },
            query: { tab: 'content', ...$route.query }
          })
        "
      >
        <b style="cursor: pointer">{{ item.title }}</b>
        <br />
        <!-- <a-tag v-if="item.title">
          <img
            width="14"
            class="flag-svg__tab"
            :src="contentLanguages[getFirstFulfilled(item.title).lang].flagSrc || ''"
            :alt="getFirstFulfilled(item.title).lang"
          />
          {{ contentLanguages[getFirstFulfilled(item.title).lang].abr }}
        </a-tag> -->
      </div>

      <template slot="id" slot-scope="item">
        <b>{{ item.id }}</b>
      </template>

      <!-- <template slot="title" slot-scope="item">
        <b>{{ item.title }}</b>
      </template> -->

      <template v-if="item.title" slot="title_languages" slot-scope="item">
        <template v-for="(title, key) in item.title_language_support">
          <a-tag v-if="title" :key="key">
            <img
              width="14"
              class="flag-svg__tab"
              :src="contentLanguages[key].flagSrc || ''"
              :alt="key"
            />
            {{ contentLanguages[key].abr }}
          </a-tag>
        </template>
      </template>

      <template slot="content_languages" slot-scope="item">
        <template v-for="(content, key) in item.content_language_support">
          <a-tag v-if="content" :key="key">
            <img
              width="14"
              class="flag-svg__tab"
              :src="contentLanguages[key].flagSrc || ''"
              :alt="key"
            />
            {{ contentLanguages[key].abr }}
          </a-tag>
        </template>
      </template>

      <template slot="created" slot-scope="item">
        {{ moment.utc(item.pub_date).format("LLL") }}
      </template>

      <template slot="files" slot-scope="item">
        {{ (item.images && item.images.length) || " - " }}
      </template>

      <template slot="position" slot-scope="item">
        {{ item.position }}
      </template>

      <template v-if="item" slot="updated" slot-scope="item">
        {{ moment.utc(item).format("LLL") }}
      </template>

      <template v-if="item" slot="slug" slot-scope="item">
        {{ item.slug }}
      </template>

      <template slot="language_support" slot-scope="item">
        <template v-for="(languageSupport, key) in item.language_support">
          <a-tag v-if="languageSupport" :key="key">
            <img
              width="14"
              class="flag-svg__tab"
              :src="contentLanguages[key].flagSrc || ''"
              :alt="key"
            />
            {{ contentLanguages[key].abr }}
          </a-tag>
        </template>
      </template>

      <template slot="status" slot-scope="item">
        <!-- <osg-image :img="item" /> -->
        <a-tag :color="item.is_active ? 'geekblue' : 'volcano'">
          {{ item.is_active ? "Опубликован" : "Не опубликован" }}
        </a-tag>
      </template>

      <template v-if="'is_main' in item" slot="is_main" slot-scope="item">
        <a-tag :color="item.is_main ? 'geekblue' : 'volcano'">
          {{ item.is_main ? "Вкл." : "Выкл." }}
        </a-tag>
      </template>

      <template v-if="'to_slider' in item" slot="to_slider" slot-scope="item">
        <a-badge
          :status="item.is_slider ? 'success' : 'error'"
          :text="item.is_slider ? $t('Yes') : $t('No')"
        />
      </template>

      <template v-if="item && 'views' in item" slot="views" slot-scope="item">
        <a-icon type="eye" />
        {{ item.views }}
      </template>

      <template
        v-if="item && 'files' in item"
        slot="files_size"
        slot-scope="item"
      >
        {{
          bytesToSize(Object.values(item.files).reduce((a, b) => a + b.size, 0))
        }}
      </template>

      <template slot="operation" slot-scope="item">
        <a-icon
          class="action-btns"
          type="edit"
          @click="
            $router.push(
              {
                name: 'post-update',
                params: { id: item.id },
                query: { ...$route.query }
              },
              () => null
            )
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
    <div style="padding: 15px 0">
      <a-pagination
        :key="perPage"
        :current="page"
        :default-page-size="perPage"
        :total="+total || 0"
        @change="toPage"
      />
    </div>
  </a-row>
</template>

<script>
// import osgImage from "@/components/image/osgImage/osgImage";
import { CONTENT_LANGUAGES } from "@/constants"

export default {
  // components: {
  //   osgImage
  // },
  data() {
    return {
      loading: false,
      perPage: 20,
      page: 1,
      offset: 0,
      total: 0,
      columns: [
        // {
        //   title: "ID",
        //   key: "id",
        //   width: 100,
        //   scopedSlots: { customRender: "id" }
        // },
        {
          title: this.$t("TableHead"),
          width: 500,
          key: "news_title",
          scopedSlots: { customRender: "news_title" }
        },
        // {
        //   title: "Языки заголовков",
        //   key: "title_languages",
        //   width: 150,
        //   scopedSlots: { customRender: "title_languages" }
        // },
        {
          title: this.$t("LangContent"),
          key: "content_languages",
          width: 150,
          scopedSlots: { customRender: "content_languages" }
        },
        // {
        //   title: "Доступность языков",
        //   key: "language_support",
        //   width: 150,
        //   scopedSlots: { customRender: "language_support" }
        // },
        // {
        //   title: "Cтатус",
        //   width: 100,
        //   key: "status",
        //   scopedSlots: { customRender: "status" }
        // },
        // {
        //   title: "ЧПУ",
        //   width: 300,
        //   key: "slug",
        //   scopedSlots: { customRender: "slug" }
        // },
        {
          title: this.$t("File"),
          width: 100,
          key: "files",
          scopedSlots: { customRender: "files" }
        },
        // {
        //   title: "Отображать на главной",
        //   width: 100,
        //   key: "is_main",
        //   scopedSlots: { customRender: "is_main" }
        // },
        // {
        //   title: "Позиция",
        //   width: 100,
        //   key: "position",
        //   scopedSlots: { customRender: "position" }
        // },
        // {
        //   title: "Отобразить на слайдере",
        //   width: 200,
        //   key: "to_slider",
        //   scopedSlots: { customRender: "to_slider" }
        // },
        // {
        //   title: "Просмотров",
        //   width: 150,
        //   key: "views",
        //   scopedSlots: { customRender: "views" }
        // },
        // {
        //   title: "Обновлено",
        //   dataIndex: "updated",
        //   key: "updated",
        //   width: 150,
        //   scopedSlots: { customRender: "updated" }
        // },
        // {
        //   title: "Размер файлов",
        //   key: "files_size",
        //   width: 150,
        //   scopedSlots: { customRender: "files_size" }
        // },
        // {
        //   title: "Количество файлов",
        //   key: "files_num",
        //   width: 150,
        //   scopedSlots: { customRender: "files_num" }
        // },
        {
          title: this.$t("Created"),
          // dataIndex: "created",
          key: "created",
          width: 200,
          scopedSlots: { customRender: "created" }
        },
        // {
        //     title: "Название",
        //     key: "title",
        //     scopedSlots: { customRender: "lang_title" }
        // },
        {
          title: this.$t("UsersColTitle2"),
          key: "operation",
          fixed: "right",
          scopedSlots: { customRender: "operation" }
        }
      ],
      searchText: "",
      categoryProps: []
    }
  },
  computed: {
    contentLanguages: () => CONTENT_LANGUAGES
  },
  watch: {
    $route: {
      handler: "fetchData",
      immediate: true
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    toPage(arg) {
      this.$router.push({ query: { page: arg } })
    },
    search() {
      if (this.searchText.length >= 3) {
        this.fetchData()
      } else if (this.searchText.length == 0) {
        this.fetchData()
      }
    },
    bytesToSize(bytes) {
      const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
      if (bytes === 0) return "n/a"
      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
      if (i === 0) return `${bytes} ${sizes[i]})`
      return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`
    },
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
    async fetchData() {
      this.loading = true
      this.offset = +this.$route.query.page || 1
      this.page = this.offset
      this.offset = (this.offset - 1) * this.perPage
      try {
        let params = {
          search: this.searchText,
          limit: this.perPage,
          offset: this.offset
        }
        let { count, results } = await this.$store.dispatch("posts/fetch", {
          menu_id: this.$route.params && this.$route.params.id,
          params: params
        })

        this.total = count
        this.$set(this, "categoryProps", [...results])
      } catch (e) {
        this.$sentry.captureMessage(e)
      }
      this.loading = false
    },
    async removeItem(item) {
      try {
        const res = await this.$store.dispatch("posts/deletePost", item.id)
        console.log(res)
        if (res && res.status == 204) {
          // const f = this.categoryProps.news.findIndex(
          //   (elem) => elem.id == item.id
          // )

          // if (f != -1) {
          //   this.categoryProps.news.splice(f, 1)
          // }
          this.$router.go()
        }
      } catch (e) {
        this.$sentry.captureMessage(e)
      }
    },
    async createFunc() {
      // let parent = null
      let res = await this.$api.post("/cms/post/create/", {
        menu: this.$route.params.id,
        is_active: true
      })
      this.$router.push({
        name: "post-update",
        params: { id: res && res.data && res.data.id }
      })
    }
  }
}
</script>
