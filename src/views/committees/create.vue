<template>
  <div class="fraction-create">
    <div class="fraction-create-header">
      <h2>{{ $t("Add") }}</h2>
    </div>
    <!-- lang tabs -->
    <a-row align="middle" class="flex-baseline" style="margin-bottom: 15px">
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
    <div class="fraction-create-body">
      <a-row align="middle" class="flex-baseline input-form__group">
        <a-col :span="6" style="text-align: right; padding-right: 8px">
          {{ $t("CommitTitle") }}:
        </a-col>
        <a-col :span="12">
          <a-input
            v-model="form['title_' + getKey]"
            :placeholder="$t('CommitTitlePlac')"
          />
          <div
            v-if="$v.form['title_' + getKey].$error"
            :class="{ invalid: $v.form['title_' + getKey].$error }"
          >
            {{ $t("FieldEmpty") }}
          </div>
        </a-col>
      </a-row>

      <!-- <a-row align="top" class="input-form__group" type="flex">
        <a-col
          :span="6"
          style="text-align: right; padding-top: 5px; padding-right: 8px"
        >
          {{ $t("Url") }}:
        </a-col>
        <a-col :span="12">
          <a-input v-model="form.url" :placeholder="$t('InputText')" />
        </a-col>
      </a-row> -->
      <a-row align="top" class="input-form__group" type="flex">
        <a-col
          :span="6"
          style="text-align: right; padding-top: 5px; padding-right: 8px"
        >
          {{ $t("Chairman") }}:
        </a-col>
        <a-col :span="12">
          <a-select
            v-model="form.chairman"
            style="width: 100%"
            option-label-prop="label"
            show-search
            :filter-option="filterOption"
          >
            <a-select-option
              v-for="item in getChairmanDeputies"
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
          {{ $t("SubChairman") }}:
        </a-col>
        <a-col :span="12">
          <a-select
            v-model="form.sub_chairman"
            style="width: 100%"
            option-label-prop="label"
            mode="multiple"
            show-search
            :filter-option="filterOption"
          >
            <a-select-option
              v-for="item in getSubChairman"
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
            v-model="form.members"
            group="people"
            @start="drag = true"
            @end="drag = false"
          >
            <div
              v-for="(element, index) in form.members"
              :key="element.id"
              class="dragItem"
            >
              {{ index + 1 }}.
              {{ getMember(element).last_name }}
              {{ getMember(element).first_name }}
              {{ getMember(element).middle_name }}
            </div>
          </draggable>
        </a-col>
      </a-row>
      <a-row align="top" class="input-form__group" type="flex">
        <a-col
          :span="6"
          style="text-align: right; padding-top: 5px; padding-right: 8px"
        >
          {{ $t("Members") }}:
        </a-col>
        <a-col :span="12">
          <a-select
            v-model="form.members"
            style="width: 100%"
            option-label-prop="label"
            mode="multiple"
            show-search
            :filter-option="filterOption"
          >
            <a-select-option
              v-for="item in getFilterDeputies"
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
        <a-col :span="6" style="text-align: right; padding-right: 8px">
          {{ $t("TablePhotos") }}:
        </a-col>
        <a-col :span="12" class="sm-mb">
          <input
            type="file"
            accept="image/jpg, image/jpeg, image/png, image/svg"
            @change="handleFileUpload"
          />
          <!-- <a-upload name="file" :multiple="true" v-model="form.photo">
                <a-button> <a-icon type="upload" /> Click to Upload </a-button>
              </a-upload> -->
          <div class="committee-image">
            <img :src="image_url" />
          </div>
        </a-col>
      </a-row>
      <a-row align="top" class="input-form__group" type="flex">
        <a-col
          :span="6"
          style="text-align: right; padding-top: 5px; padding-right: 8px"
        >
          {{ $t("MenuPosition") }}
        </a-col>
        <a-col :span="12">
          <a-input-number v-model="form.position" :min="0" />
        </a-col>
      </a-row>

      <!-- <a-row align="top" class="input-form__group" type="flex">
        <a-col
          :span="6"
          style="text-align: right; padding-top: 5px; padding-right: 8px"
        >
          chairman:
        </a-col>
        <a-col :span="12">
          <a-select v-model="form.chairman" style="width: 100%;">
            <a-select-option
              v-for="item in deputiesList"
              :key="item.id"
              :value="item.id"
            >
              {{ item.first_name }} {{ item.last_name }} {{ item.middle_name }}
            </a-select-option>
          </a-select>
        </a-col>
      </a-row>

      <a-row align="top" class="input-form__group" type="flex">
        <a-col
          :span="6"
          style="text-align: right; padding-top: 5px; padding-right: 8px"
        >
          Sub chairman:
        </a-col>
        <a-col :span="12">
          <a-select v-model="form.sub_chairman" style="width: 100%;" mode="multiple">
            <a-select-option
              v-for="item in deputiesList"
              :key="item.id"
              :value="item.id"
            >
              {{ item.first_name }} {{ item.last_name }} {{ item.middle_name }}
            </a-select-option>
          </a-select>
        </a-col>
      </a-row> -->
    </div>
    <div class="fraction-create-footer">
      <a-button
        style="margin-left: 10px"
        type="primary"
        @click="submitCommittee"
      >
        <a-icon type="check" />
        {{ $t("Add") }}
      </a-button>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable"
import { required } from "vuelidate/lib/validators"

// const classObj = {
//   title: {
//     ru: "",
//     uz: "",
//     qr: "",
//     oz: "",
//     en: ""
//   },
//   url: "",
//   image: null
//   // chairman: null,
//   // sub_chairman: []
// }
export default {
  name: "CommitteeCreate",
  components: {
    draggable
  },
  data() {
    return {
      langTab: "ru",
      form: {
        title_ru: "",
        title_uz: "",
        title_oz: "",
        title_qr: "",
        title_en: "",
        chairman: "",
        sub_chairman: [],
        image: null,
        members: [],
        position: 0
      },
      image_url: "",
      allDeputies: [],
      sub_chairmanDeputies: []
      // deputiesList: []
    }
  },
  validations: {
    form: {
      title_uz: {
        required
      },
      title_oz: {
        required
      },
      title_qr: {},
      title_en: {},
      title_ru: {
        required
      }
    }
  },
  computed: {
    getKey() {
      return this.langTab
    },

    getChairman() {
      return this.form.chairman
    },
    getChairmanDeputies() {
      return this.allDeputies.filter(
        (i) => !this.form.sub_chairman.includes(i.id)
      )
    },
    getSubChairman() {
      return this.allDeputies.filter((i) => i.id != this.form.chairman)
    },
    getFilterDeputies() {
      const result = this.allDeputies.filter(
        (x) => !this.form.sub_chairman.some((y) => y == x.id)
      )
      return result.filter((i) => {
        return i.id != this.form.chairman
      })
    }
  },
  watch: {},
  // async created() {
  //   let deputiesList = await this.$store.dispatch(
  //     "committees/fetchDeputies"
  //   )
  //   this.deputiesList = deputiesList;
  //   console.log(this.deputiesList);
  // },
  async created() {
    this.allDeputies = await this.$store.dispatch(
      "committees/fetchAllDeputies",
      {
        deputies_committee_isnull: true
      }
    )
  },

  methods: {
    getMember(val) {
      return this.getFilterDeputies.find((i) => i.id == val)
    },
    //translitAction() {},
    async submitCommittee() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.$message.error(this.$t("PleaseForm"))

        return
      }
      let form = this.form
      // Object.keys(form).forEach((k) => {
      //   k == "title" &&
      //     Object.keys(form[k]).forEach((k2) => {
      //       form[k + "_" + k2] = form[k][k2]
      //     })
      // })
      // delete form.title
      // form.title = form.title_uz
      console.log(form)

      let f = new FormData()
      Object.keys(form).forEach((k) => {
        k != "image" &&
          k != "sub_chairman" &&
          k != "members" &&
          f.append(k, form[k])
        k == "image" && form[k] && f.append(k, form[k], form[k].name)
        k == "sub_chairman" &&
          form[k] &&
          form[k].length &&
          form[k].forEach((el) => {
            f.append(k, el)
          })
        k == "members" &&
          form[k] &&
          form[k].length &&
          form[k].forEach((el) => {
            f.append(k, el)
          })
      })
      const res = await this.$api.post("/structure/committee/create/", f)
      this.ISVALID(res, () => {
        this.$router.push({
          name: "committees"
        })
      })
    },
    handleFileUpload(e) {
      // this.form.photo = this.$refs.file.files[0]
      console.log(e.target.files[0])
      this.image_url = URL.createObjectURL(e.target.files[0])
      this.form.image = e.target.files[0]
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
input[type="file"] {
  margin-bottom: 15px;
}
.committee-image {
  overflow: hidden;
}
.committee-image > img {
  max-height: 200px;
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
