<template>
  <a-row class="content-fix" type="flex">
    <spinner v-if="loading" />
    <a-col v-else class="height100 flex-1">
      <a-tabs :key="$route.fullPath" class="main-tabs" type="card">
        <a-tab-pane key="content">
          <span slot="tab">
            <a-icon type="project" />{{ $t("TableContent") }}
          </span>

          <!-- lang tabs -->
          <a-row align="middle" class="flex-baseline input-form__group">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              {{ $t("Lang") }}:
            </a-col>
            <a-col :span="12">
              <!-- lang translit tabs -->
              <a-row align="middle" class="flex-baseline flex-wrap">
                <lang-tabs v-model="langTab" class="mb-1x" />
              </a-row>
            </a-col>
          </a-row>

          <!-- route name -->
          <a-row
            :class="{ 'form-group--error': titlesCheck }"
            align="middle"
            class="flex-baseline input-form__group"
          >
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              {{ $t("MenuTitle") }}
            </a-col>
            <a-col :span="12">
              <a-input
                v-model="$v.form.title[langTab].$model"
                :placeholder="$t('MenuTitlePlace')"
              />
              <div v-if="!$v.form.title.oz.required" class="error-text">
                {{ $t("EnterNameOz") }}.
              </div>
              <div v-if="!$v.form.title.uz.required" class="error-text">
                {{ $t("EnterNameUz") }}.
              </div>
              <div v-if="!$v.form.title.ru.required" class="error-text">
                {{ $t("EnterNameRu") }}.
              </div>
            </a-col>
          </a-row>
          <a-row align="middle" class="flex-baseline input-form__group">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              {{ $t("MenuGroup") }}
            </a-col>
            <a-col :span="12">
              <a-input
                v-model="form.group"
                :placeholder="$t('MenuGroupPlace')"
              />
            </a-col>
          </a-row>
          <!-- route url -->
          <!-- <a-row align="top" class="input-form__group" type="flex">
            <a-col
              :span="6"
              style="text-align: right; padding-top: 5px; padding-right: 8px"
            >
              Адрес:
            </a-col>
            <a-col :span="12">
              <a-textarea
                v-model="form.group"
                :auto-size="{ minRows: 2, maxRows: 6 }"
                placeholder="Введите адрес для перехода"
              />
            </a-col>
          </a-row> -->

          <!-- route name -->
          <a-row
            v-if="form.id && !form.parent_id"
            align="top"
            class="input-form__group"
            type="flex"
          >
            <a-col
              :span="6"
              style="text-align: right; padding-top: 5px; padding-right: 8px"
            >
              {{ $t("Variable") }}:
            </a-col>
            <a-col :span="12">
              <a-textarea
                v-model="form.name"
                :autosize="{ minRows: 2, maxRows: 6 }"
                placeholder="Введите название переменной"
              />
            </a-col>
          </a-row>

          <!-- menu list to pick parent menu -->
          <a-row
            v-if="!(form && form.id && form.parent_id === null)"
            style="margin-bottom: 15px"
          >
            <a-col
              :span="6"
              style="text-align: right; padding-right: 8px; padding-top: 6px"
            >
              {{ $t("MenuParentName") }}
            </a-col>
            <a-col :span="12">
              <a-select
                v-model="form.parent"
                :filter-option="filterOption"
                show-search
                option-filter-prop="children"
                :placeholder="$t('MenuParentName')"
                style="width: 100%"
              >
                <a-select-option
                  v-for="menu in menuList"
                  :key="menu.id"
                  :value="menu.id"
                >
                  {{ menu.title || "-" }}
                </a-select-option>
              </a-select>
            </a-col>
          </a-row>

          <!-- position -->
          <a-row align="middle" class="flex-baseline input-form__group">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              {{ $t("MenuPosition") }}
            </a-col>
            <a-col :span="12">
              <a-input-number
                v-model="form.position"
                placeholder="Введите позицию"
              />
              <div v-if="!form.position" class="error-text">
                {{ $t("EnterPosition") }}
              </div>
            </a-col>
          </a-row>
          <!-- status toggle -->
          <a-row style="margin-top: 25px">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              {{ $t("IsStatic") }}:
            </a-col>
            <a-switch v-model="form.is_static" />
          </a-row>

          <!-- active toggle -->
          <a-row style="margin-top: 25px">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              {{ $t("Active") }}:
            </a-col>
            <a-switch v-model="form.is_active" />
          </a-row>

          <!-- has_category toggle -->
          <a-row style="margin-top: 25px">
            <a-col :span="6" style="text-align: right; padding-right: 8px">
              {{ $t("Hascategory") }}?:
            </a-col>
            <a-switch v-model="form.has_category" />
          </a-row>

          <!-- is static -->
          <!-- <div>
            <p>IS static</p>
            <input v-model="form.is_static" type="checkbox" />
          </div> -->

          <!-- is active -->
          <!-- <div>
            <p>IS active</p>
            <input v-model="form.is_active" type="checkbox" />
          </div> -->
        </a-tab-pane>

        <span v-if="form.id" slot="tabBarExtraContent">
          <a-popconfirm
            placement="bottomRight"
            title="Вы действительно хотите удалить?"
            @confirm="removeItem"
          >
            <a-button :disabled="pending" style="margin-right: 10px">
              <a-icon type="delete" />{{ $t("Delete") }}
            </a-button>
          </a-popconfirm>
        </span>
      </a-tabs>

      <a-row class="form-buttons__action" type="flex">
        <a-col :span="6" style="text-align: right; padding-right: 8px" />
        <a-col>
          <a-button :disabled="pending" @click="$router.go(-1)">
            <a-icon type="close" />{{ $t("Cancel") }}
          </a-button>

          <a-button
            :loading="pending"
            style="margin-left: 10px"
            type="primary"
            @click="submit"
          >
            <a-icon type="check" />
            {{ form.id ? $t("Save") : $t("Add") }}
          </a-button>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>

<script>
import { required } from "vuelidate/lib/validators"

const def = () => ({
  status: true,
  position: 1,
  title: {
    uz: "",
    oz: "",
    ru: "",
    en: "",
    qr: ""
  },
  // title_uz: "",
  // title_oz: "",
  // title_ru: "",
  // title_qr: "",
  // title_en: "",
  // path: "",
  children: null,
  group: null,
  parent: null,
  is_active: false,
  is_static: false,
  has_category: false
})

export default {
  data: () => ({
    langTab: $langPrefix,
    loading: false,
    pending: false,
    form: { ...def },
    submitStatus: "",

    menuList: []
  }),

  computed: {
    thereParent() {
      return !!(this.form && this.form.parent_id) // some conditional logic here...
    },
    titlesCheck() {
      return !!(
        this.$v.form.title.oz.$error ||
        this.$v.form.title.uz.$error ||
        this.$v.form.title.ru.$error
      )
    },
    cList() {
      return (
        this.menuList.filter((item) => {
          if (this.form && this.form.id) {
            if (item.id != this.form.id) {
              return item
            }
          }

          return item
        }) || []
      )
    },
    cMenuList() {
      return (
        (this.cList &&
          this.cList
            .slice()
            .sort((a, b) => a.position - b.position)
            .map((item) => ({
              ...item,
              title: {
                ...((item.title && JSON.parse(item.title)) || {})
              },
              children:
                item.children &&
                item.children
                  .map((c) => ({
                    ...c,
                    title: {
                      ...(c.title && JSON.parse(c.title))
                    }
                  }))
                  .sort((a, b) => a.position - b.position)
            }))) ||
        []
      )
    }
  },
  watch: {
    $route: {
      handler: "fetchData",
      immediate: true
    },
    form: {
      handler() {
        if (
          !this.form.id &&
          this.form.parent_id &&
          this.$route.name != "menu-detail"
        ) {
          const f = this.menuList.findIndex(
            (item) => item.id == this.form.parent_id
          )

          if (
            f != -1 &&
            this.menuList[f].children &&
            this.menuList[f].children.length
          ) {
            const childrenMenuLen = this.menuList[f].children.length

            this.form.position = childrenMenuLen + 1
          }
        }
      },
      deep: true
    }
  },

  created() {
    this.toDef()
  },

  beforeDestroy() {
    this.toDef()
  },

  validations: {
    form: {
      title: {
        uz: {
          required
        },
        oz: {
          required
        },
        ru: {
          required
        },
        en: {
          required
        }
      }
    }
  },

  methods: {
    toDef() {
      this.$set(this, "form", {
        ...def()
      })
    },
    async fetchMenuList() {
      this.loading = true
      try {
        const data = await this.$store.dispatch("menu/fetch")

        this.menuList = data || []
      } catch (e) {
        console.log(e)
        this.loading = false
      }
      this.loading = false
    },
    async fetchData() {
      await this.fetchMenuList()
      if (!this.$route.params.id || isNaN(this.$route.params.id)) {
        // console.log("Invalid params");
        return
      }
      this.loading = true
      try {
        const res = await this.$store.dispatch(
          "menu/detail",
          this.$route.params.id
        )

        if (res) {
          this.$set(this, "form", {
            ...res,
            title: {
              ...this.langKeys,
              // ...((res.title && JSON.parse(res.title)) || this.langKeys),
              ru: res.title_ru,
              uz: res.title_uz,
              oz: res.title_oz,
              en: res.title_en,
              qr: res.title_qr
            },
            position: +res.position
          })
          // console.log(this.form)
        }

        // console.log(res);
      } catch (err) {
        console.log(err)
        this.loading = false
        this.$sentry.captureMessage(err)
      }

      this.loading = false
    },

    async submit() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.submitStatus = "ERROR"
        return
      }
      // do your submit logic here
      this.pending = true
      try {
        this.form.title_ru = this.form.title.ru
        this.form.title_uz = this.form.title.uz
        this.form.title_oz = this.form.title.oz
        this.form.title_en = this.form.title.en
        this.form.title_qr = this.form.title.qr
        let form = { ...this.form }
        // console.log(form)
        delete form.title
        const req = {
          method: this.form && this.form.id ? "update" : "create",
          data: {
            id: (this.form && this.form.id) || null,
            data: {
              ...this.form,
              position: +this.form.position || 1
            }
          }
        }
        // console.log(req)
        const res = await this.$store.dispatch(
          `menu/${req.method}ItemAction`,
          req.data
        )
        this.ISVALID(res, () => {
          this.$router.go(-1)
        })

        // console.log("11", res);

        // this.$message.success(
        //   `Меню успешно ${this.form.id ? "обновлен" : "создан"}`
        // )
      } catch (e) {
        console.log(e)
        this.pending = false
      }

      this.pending = false
    },

    async removeItem() {
      try {
        const r = await this.$store.dispatch(
          "menu/removeItemAction",
          this.form.id
        )

        if (r) {
          this.$message.success("Меню успешно удален")
          this.$router.go(-1)
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
