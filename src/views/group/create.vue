<template>
  <a-tabs :key="$route.fullPath" class="main-tabs" type="card">
    <a-tab-pane key="content">
      <span slot="tab"> <a-icon type="project" />Содержимое </span>
      <a-col>
        <a-form class="antd-form">
          <a-form-item
            label="Язык"
            :label-col="formItemSpan().labelCol"
            :wrapper-col="formItemSpan().wrapperCol"
          >
            <lang-tabs v-model="langTab" />
          </a-form-item>
          <a-form-item
            label="Заголовок"
            :label-col="formItemSpan().labelCol"
            :wrapper-col="formItemSpan().wrapperCol"
          >
            <a-input
              v-model="form.title[langTab]"
              :placeholder="$t('EnterTitle')"
              :spell-check="false"
              @input="slugCompute($event, langTab, 'group')"
            />
          </a-form-item>
          <a-form-item
            label="ЧПУ"
            :label-col="formItemSpan().labelCol"
            :wrapper-col="formItemSpan().wrapperCol"
          >
            <a-input
              v-model="form.slug"
              placeholder="Введите человеку понятный урл"
              @change="slugCheck({ type: 'group', slug: form.slug })"
            />
          </a-form-item>

          <a-form-item
            label="Тип группы"
            :label-col="formItemSpan().labelCol"
            :wrapper-col="formItemSpan().wrapperCol"
          >
            <a-select
              v-model="group.type"
              show-search
              placeholder="Выберите тип группы"
            >
              <a-select-option
                v-for="group in group.list"
                :key="group.id"
                :value="group.name"
              >
                {{ group.title[$i18n.locale] }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item
            label="Добавить категорию"
            :label-col="formItemSpan().labelCol"
            :wrapper-col="formItemSpan().wrapperCol"
          >
            <a-switch
              :checked="form.has_category"
              @click="form.has_category = !form.has_category"
            />
          </a-form-item>

          <a-form-item
            label="Статус"
            :label-col="formItemSpan().labelCol"
            :wrapper-col="formItemSpan().wrapperCol"
          >
            <a-switch
              :checked="form.status"
              @click="form.status = !form.status"
            />
          </a-form-item>

          <a-row>
            <a-col :span="6" />
            <a-col>
              <a-row>
                <a-button
                  style="margin-right: 10px"
                  :disabled="loading"
                  @click="$router.push({ name: 'group-list' })"
                >
                  <a-icon type="close" />Отмена
                </a-button>
                <a-button :loading="loading" type="primary" @click="submitForm">
                  <a-icon type="check" />
                  {{ form.id ? "Сохранить" : "Создать" }}
                </a-button>
              </a-row>
            </a-col>
          </a-row>
        </a-form>

        <!-- <pre>{{$store.state.category.list}}</pre> -->
      </a-col>
    </a-tab-pane>

    <span v-if="form.id" slot="tabBarExtraContent">
      <a-popconfirm
        placement="bottomRight"
        title="Вы действительно хотите удалить?"
        @confirm="deleteGroup"
      >
        <a-button v-if="form.id" :disabled="loading">
          <a-icon type="delete" />Удалить
        </a-button>
      </a-popconfirm>
    </span>
  </a-tabs>
</template>

<script>
export default {
  data: () => ({
    loading: false,
    form: {
      title: {
        oz: "янги гурух",
        uz: "yangi guruh",
        ru: "новая группа",
        en: "new group"
      },
      slug: "novaya-gruppa",
      status: true,
      position: 1,
      has_category: false
    },

    group: {
      list: [
        {
          title: {
            ru: "Услуги",
            en: "Services",
            uz: "Xizmatlar",
            oz: "Хизматлар"
          },
          name: "services",
          id: 1
        },
        {
          title: {
            ru: "Слайдер",
            en: "Slider",
            uz: "Slayder",
            oz: "Слайдер"
          },
          name: "slider",
          id: 2
        },
        {
          title: {
            ru: "Новости",
            en: "News",
            uz: "Yangiliklar",
            oz: "Янгиликлар"
          },
          name: "news",
          id: 3
        }
      ],
      type: null
    },
    category_id: null,
    langTab: $langPrefix
  }),
  watch: {
    "$route.params": {
      handler: "fetchData",
      immediate: true
    }
  },
  methods: {
    async deleteGroup() {
      await this.$store.dispatch("group/removeItemAction", this.form.id)
      this.$router.push({ name: "group-list" })
    },
    async fetchData() {
      if (isNaN(this.$route.params.id)) return

      await this.$store.dispatch("category/fetch", this.$route.params.id)
      const data = await this.$store.dispatch(
        "group/fetchId",
        this.$route.params.id
      )

      if (data) {
        this.$set(this, "form", data)

        if (data.type) {
          this.group.type = data.type
        }
      }
    },
    async submitForm() {
      this.loading = true

      try {
        const res = await this.$store.dispatch(
          `group/${this.form.id ? "update" : "create"}ItemAction`,
          {
            ...this.form,
            title: JSON.stringify(this.form.title),
            type: this.group.type || "services"
          }
        )

        if (!(res && res.code)) {
          this.$message.success(
            `Раздел успешно ${!this.form.id ? "создан" : "сохранен"}`
          )
          this.$router.push({ name: "group-list" })
        }
      } catch (error) {
        console.log(error)
        this.$message.error(error)
      }

      this.loading = false
    }
  }
}
</script>

<style></style>
