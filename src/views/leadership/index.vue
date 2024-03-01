<template>
  <div class="fraction-create">
    <div class="fraction-create-header">
      <h2>{{ $route.meta.title[$i18n.locale] }}</h2>
    </div>
    <div class="fraction-create-body">
      <a-row align="middle" class="flex-baseline input-form__group" />
      <a-row align="top" class="input-form__group" type="flex">
        <a-col
          :span="6"
          style="text-align: right; padding-top: 5px; padding-right: 8px"
        >
          {{ $t("Chairman") }}:
        </a-col>
        <a-col :span="12">
          <a-select
            v-model="form.speaker"
            style="width: 100%"
            option-label-prop="label"
            show-search
            :filter-option="filterOption"
          >
            <a-select-option
              v-for="item in allDeputies"
              :key="item.id"
              :value="item.id"
              :label="item.last_name + ' ' + item.first_name"
            >
              {{
                item.first_name + " " + item.last_name + " " + item.middle_name
              }}
            </a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <a-row align="top" class="input-form__group" type="flex">
        <a-col
          :span="6"
          style="text-align: right; padding-top: 5px; padding-right: 8px"
        >
          <span style="display: none">1</span>
        </a-col>
        <a-col :span="12">
          <draggable
            v-model="form.sub_speakers"
            group="people"
            @start="drag = true"
            @end="drag = false"
          >
            <div
              v-for="(element, index) in form.sub_speakers"
              :key="element.id"
              class="dragItem"
            >
              {{ index + 1 }}.
              {{ getMember(element) && getMember(element).last_name }}
              {{ getMember(element) && getMember(element).first_name }}
              {{ getMember(element) && getMember(element).middle_name }}
            </div>
          </draggable>
        </a-col>
      </a-row>
      <a-row align="top" class="input-form__group" type="flex">
        <a-col
          :span="6"
          style="text-align: right; padding-top: 5px; padding-right: 8px"
        >
          {{ $t("Deputy") }}:
        </a-col>
        <a-col :span="12">
          <a-select
            v-model="form.sub_speakers"
            style="width: 100%"
            option-label-prop="label"
            mode="multiple"
            show-search
            :filter-option="filterOption"
          >
            <a-select-option
              v-for="item in filterDeputies"
              :key="item.id"
              :value="item.id"
              :label="item.last_name + ' ' + item.first_name"
            >
              {{
                item.first_name + " " + item.last_name + " " + item.middle_name
              }}
            </a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="6" />
        <a-col :span="12">
          <div class="fraction-create-footer">
            <a-button
              style="margin-left: 10px"
              type="primary"
              :disabled="isFilled"
              @click="onSubmit"
            >
              <a-icon type="check" />
              {{ $t("Save") }}
            </a-button>
          </div>
        </a-col>
      </a-row>
      <!--       
      <a-row>
        <a-col :span="12">
          <div class="form_field">
            <label>Title</label>
            <a-input
              v-model="form['title_' + getKey]"
              :placeholder="$t('InputText')"
            />
          </div>
          <div class="form_field">
            <label>deputies</label>
            <a-select
              v-model="form.deputies"
              width="400px"
              option-label-prop="label"
              mode="multiple"
            >
              <a-select-option
                v-for="item in allDeputies"
                :key="item.id"
                :value="item.id"
                :label="item.last_name + ' ' + item.first_name"
              >
                {{
                  item.first_name +
                  " " +
                  item.last_name +
                  " " +
                  item.middle_name
                }}
              </a-select-option>
            </a-select>
          </div>
        </a-col>
      </a-row> -->
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable"

export default {
  name: "CommissionsDetail",

  components: {
    draggable
  },
  data() {
    return {
      langTab: $langPrefix,
      method: "post",
      form: {
        speaker: null,
        sub_speakers: []
      },
      allDeputies: []
    }
  },
  computed: {
    isFilled() {
      return (
        this.form.title_uz == "" &&
        this.form.title_oz == "" &&
        this.form.url == ""
      )
    },
    filterDeputies() {
      return this.allDeputies.filter((i) => {
        return i.id != this.form.speaker
      })
    }
  },
  created() {
    this.getAllDeputies()
    this.getManagment()
  },

  mounted() {
    setTimeout(() => {
      console.log(this.form)
      console.log(this.filterDeputies)
    }, 10000)
  },
  methods: {
    getMember(val) {
      return this.filterDeputies.find((i) => i.id == val)
    },
    async getManagment() {
      const { data } = await this.$api.get("/structure/management/1/update/")
      this.form = data
      if (data.id) {
        this.method = "patch"
      }
    },
    async getAllDeputies() {
      this.allDeputies = await this.$store.dispatch(
        "commissions/fetchCommissionDeputies"
      )
    },
    async onSubmit() {
      try {
        this.method == "post"
          ? await this.$api.post("/structure/management/create/", this.form)
          : await this.$api.patch("/structure/management/1/update/", this.form)
        this.$message.success("Данные успешно сохранены")
      } catch (e) {
        this.$message.error("Ошибка")
        console.log(e)
      }
    }
  }
}
</script>

<style>
.fraction-create {
  padding: 20px 0;
}
.form_field {
  margin: 10px 0;
  height: 70px;
  padding: 0 30px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.form_field > .fraction_image {
  width: 70px;
  height: 70px;
  border: 1px solid grey;
  border-radius: 40px;
  overflow: hidden;
  display: inline;
  margin-right: 30px;
}
.form_field > .fraction_image > img {
  width: 100%;
  height: 100%;
}
.form_field > label {
  margin-bottom: 7px;
  display: block;
  width: 100%;
}
.form_field > div {
  width: 100%;
}
.form_field_btn {
  margin: 10px 0;
  height: 70px;
  padding: 0 30px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.fraction-create-body {
  margin-bottom: 20px;
}
.fraction-create-footer {
  display: flex;
  justify-content: flex-end;
}
.dragItem {
  padding: 8px 0;
  border-bottom: 1px solid #ececec;
  cursor: pointer;
  transition: all 0.25s ease-in-out;
}
.dragItem:hover {
  background: #f5f5f5;
  padding-left: 8px;
}
.dragItem:last-child {
  border-bottom: 0;
}
</style>
