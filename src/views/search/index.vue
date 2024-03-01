<template>
  <a-row class="content-fix" type="flex">
    <a-col
      :span="5"
      style="padding: 25px 0px; border-right: solid 0.5px #d9d9d9"
    >
      <a-row type="flex" class="search-row">
        <h1 class="title-search">{{ searchCatTitle[$i18n.locale] }}</h1>
        <div v-for="(item, index) in checkBoxList" :key="index">
          <a-checkbox
            v-model="filters[item.key]"
            class="search-checkbox"
            @change="onSearch"
          >
            {{ item.name[$i18n.locale] }}
          </a-checkbox>
        </div>
      </a-row>
    </a-col>
    <a-col :span="19" style="padding: 25px 0px 0px 25px">
      <a-col class="relative r-wanted search-input">
        <a-input
          v-model="text"
          :disabled="searching"
          class="search-input__input"
          :spell-check="false"
        />
        <a-button
          class="search-input__icon z-index-0"
          type="primary"
          @click="onSearch()"
        >
          <a-icon :type="searching ? 'loading' : 'search'" />
          {{ searchTitle[$i18n.locale] }}
        </a-button>
      </a-col>
      <h1 v-if="data.results.length == 0" class="Nothingfound">
        {{ Nothingfound[$i18n.locale] }}
      </h1>
      <a-col v-else class="search_result">
        <!-- <div v-for="(item, index) in data.results" :key="index">
          <div
            class="search_result-title"
            @click="
              $router.push({
                path: item.slug2
              })
            "
          >
            {{ item.title }}
          </div>
        </div> -->
        <a-table
          :key="$route.fullPath"
          :columns="columns"
          :data-source="data.results"
          :pagination="{ defaultPageSize: 10 }"
        >
          <template slot="name" slot-scope="item">
            <div
              class="td-post-item"
              tag="span"
              @click="
                $router.push({
                  path: item.slug2
                })
              "
            >
              {{ item && item.title }}
            </div>
          </template>
        </a-table>
      </a-col>
    </a-col>
  </a-row>
</template>

<script>
export default {
  data() {
    return {
      filters: {
        deputy: false,
        deputy_article: false,
        post: false,
        committee: false,
        fraction: false,
        commission: false
      },
      columns: [
        {
          title: this.$t("TagsColTitle"),
          key: "name",
          width: "100%",
          scopedSlots: { customRender: "name" }
        }
      ],
      searchTitle: {
        uz: "Qidirish",
        oz: "Кидириш",
        ru: "Поиск",
        en: "Search"
      },
      searchCatTitle: {
        uz: "Quyidagilar bo'yicha:",
        oz: "Куйидагилар бойича:",
        ru: "По этим категориям:",
        en: "По этим категориям:"
      },
      Nothingfound: {
        uz: "Malumot topilmadi.",
        oz: "Малумот топилмади.",
        ru: "Ничего не найдено.",
        en: "Nothing found."
      },
      checkBoxList: [
        {
          name: {
            uz: "Deputatlar",
            oz: "Депутатлар",
            ru: "Депутаты",
            en: "Deputy"
          },
          key: "deputy"
        },
        {
          name: {
            uz: "Deputatlarni maqolalari",
            oz: "Депутатларни маколалари",
            ru: "Депутаты статья",
            en: "Deputy article"
          },
          key: "deputy_article"
        },
        {
          name: {
            uz: "Yangiliklar",
            oz: "Янгиликлар",
            ru: "Новости",
            en: "News"
          },
          key: "post"
        },
        {
          name: {
            uz: "Qomitalar",
            oz: "Комиталар",
            ru: "Комитеты",
            en: "Committee"
          },
          key: "committee"
        },
        {
          name: {
            uz: "Fraksiyalar",
            oz: "Фракциялар",
            ru: "Фракции",
            en: "Fraction"
          },
          key: "fraction"
        },
        {
          name: {
            uz: "Komissiyalar",
            oz: "Комиссиялар",
            ru: "Комиссии",
            en: "Commission"
          },
          key: "commission"
        }
      ],
      searching: false,
      text: "",
      data: {
        results: []
      }
    }
  },
  methods: {
    async onSearch() {
      if (this.text.length >= 3) {
        this.searching = true
        try {
          let params = {
            ...this.filters,
            query: this.text
          }
          let res = await this.$api.get("/search/text/", { params })

          this.data = {
            results: res.data.map((el) => {
              let cat = ""
              if (el.class_name == "Post") {
                cat = "category/posts/update"
              } else if (el.class_name == "Deputy") {
                cat = "wanted"
              } else if (el.class_name == "Committee") {
                cat = "committees"
              } else if (el.class_name == "Commission") {
                cat = "commissions"
              } else if (el.class_name == "Faction") {
                cat = "fractions"
              } else if (el.class_name == "DeputyArticle") {
                cat = "deputy-articles"
              }
              return {
                ...el,
                slug2: cat + "/" + el.object_id
              }
            })
          }
          this.searching = false
        } catch (error) {
          this.searching = false
          console.log(error)
        }
      }
    }
  }
}
</script>

<style>
.search-row {
  flex-direction: column;
  justify-content: center;
}
.search-input {
  margin-right: 0;
}
.title-search,
.search-checkbox {
  margin-bottom: 25px;
  margin-left: 0 !important;
}
.search_result {
  padding-top: 25px;
}
.search_result-title:hover {
  color: #de2626;
  background-color: #fff2f0;
}
.search_result-title {
  cursor: pointer;
  padding: 15px 10px;
  width: 100%;
  border: 0.5px solid rgb(217, 217, 217);
  border-radius: 8px;
  margin-bottom: 10px;
}
.Nothingfound {
  text-align: center;
  padding: 25px 0px 0px 25px;
}
</style>
