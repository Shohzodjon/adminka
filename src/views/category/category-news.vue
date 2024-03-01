<template>
  <a-row class="content-fix">
    <a-row class="content-title" type="flex">
      <h2>
        {{
          categoryProps &&
          categoryProps.title &&
          JSON.parse(categoryProps.title)[$i18n.locale]
        }}
      </h2>
      <a-button
        style="margin-left: auto"
        type="primary"
        @click="
          $router.push({
            name: 'news-create',
            params: {
              cat_id: $route.params.cat_id
            }
          })
        "
      >
        <a-icon type="plus" />{{ $t("Add") }}
      </a-button>
    </a-row>
    <a-table
      :scroll="{ x: 2500 }"
      :columns="columns"
      :data-source="(categoryProps && categoryProps.news) || []"
      :loading="loading"
      :pagination="{ defaultPageSize: 10 }"
      :row-key="(rec) => rec.id"
    >
      <div
        slot="news_title"
        slot-scope="item"
        class="td-post-item"
        @click="
          $router.push(
            { name: 'news-detail', params: { id: item.id } },
            () => null
          )
        "
      >
        <b>{{ getFirstFulfilled(item.title).text }}</b>
        <br />
        <a-tag v-if="item.title">
          <img
            width="14"
            class="flag-svg__tab"
            :src="contentLanguages[getFirstFulfilled(item.title).lang].flagSrc"
            :alt="getFirstFulfilled(item.title).lang"
          />
          {{ contentLanguages[getFirstFulfilled(item.title).lang].abr }}
        </a-tag>
      </div>

      <template slot="id" slot-scope="item">
        <b>{{ item.id }}</b>
      </template>
      <template slot="position" slot-scope="item">
        <b>{{ item.position }}</b>
      </template>
      <template v-if="item.title" slot="title_languages" slot-scope="item">
        <template v-for="(title, key) in item.title">
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
      <template slot="content_languages" slot-scope="item">
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
      <template slot="created" slot-scope="item">
        {{ moment.utc(item).format("LLL") }}
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
              :src="contentLanguages[key].flagSrc"
              :alt="key"
            />
            {{ contentLanguages[key].abr }}
          </a-tag>
        </template>
      </template>
      <template slot="status" slot-scope="item">
        <!-- <osg-image :img="item" /> -->
        <a-tag :color="item.status ? 'geekblue' : 'volcano'">
          {{ item.status ? "Опубликован" : "Не опубликован" }}
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
          :text="item.is_slider ? 'Да' : 'Нет'"
        />
      </template>
      <template
        v-if="item && 'files' in item"
        slot="files_num"
        slot-scope="item"
      >
        {{ Object.keys(item.files).length }}
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
              { name: 'news-detail', params: { id: item.id } },
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
      columns: [
        {
          title: "ID",
          key: "id",
          width: 100,
          scopedSlots: { customRender: "id" }
        },
        {
          title: this.$t("TableHead"),
          width: 500,
          key: "news_title",
          scopedSlots: { customRender: "news_title" }
        },
        {
          title: "Языки заголовков",
          key: "title_languages",
          width: 150,
          scopedSlots: { customRender: "title_languages" }
        },
        {
          title: "Языки контента",
          key: "content_languages",
          width: 150,
          scopedSlots: { customRender: "content_languages" }
        },
        {
          title: "Доступность языков",
          key: "language_support",
          width: 150,
          scopedSlots: { customRender: "language_support" }
        },
        {
          title: "Cтатус",
          width: 100,
          key: "status",
          scopedSlots: { customRender: "status" }
        },
        {
          title: "ЧПУ",
          width: 300,
          key: "slug",
          scopedSlots: { customRender: "slug" }
        },
        {
          title: this.$t("File"),
          width: 100,
          key: "files",
          scopedSlots: { customRender: "files" }
        },
        {
          title: "Отображать на главной",
          width: 100,
          key: "is_main",
          scopedSlots: { customRender: "is_main" }
        },
        {
          title: "Позиция",
          width: 100,
          key: "position",
          scopedSlots: { customRender: "position" }
        },
        {
          title: "Отобразить на слайдере",
          width: 200,
          key: "to_slider",
          scopedSlots: { customRender: "to_slider" }
        },
        {
          title: "Просмотров",
          width: 200,
          key: "views",
          scopedSlots: { customRender: "views" }
        },
        {
          title: "Обновлено",
          dataIndex: "updated",
          key: "updated",
          width: 150,
          scopedSlots: { customRender: "updated" }
        },
        {
          title: "Размер файлов",
          key: "files_size",
          width: 150,
          scopedSlots: { customRender: "files_size" }
        },
        {
          title: "Количество файлов",
          key: "files_num",
          width: 150,
          scopedSlots: { customRender: "files_num" }
        },
        {
          title: this.$t("Created"),
          dataIndex: "created",
          key: "created",
          width: 150,
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
      categoryProps: {}
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
  methods: {
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

      try {
        const r = await this.$store.dispatch(
          "category/detail",
          this.$route.params.cat_id
        )

        this.$set(this, "categoryProps", {
          ...r,
          news:
            r.news &&
            r.news.map((item) => ({
              ...item,
              title: {
                ...((item && item.title && JSON.parse(item.title)) || {})
              }
            }))
        })
      } catch (e) {
        this.$sentry.captureMessage(e)
      }

      this.loading = false
    },
    async removeItem(item) {
      try {
        const res = await this.$store.dispatch("news/deleteItemAction", item.id)

        if (this.resOK(res)) {
          const f = this.categoryProps.news.findIndex(
            (elem) => elem.id == item.id
          )

          if (f != -1) {
            this.categoryProps.news.splice(f, 1)
          }
        }
      } catch (e) {
        this.$sentry.captureMessage(e)
      }
    }
  }
}
</script>
