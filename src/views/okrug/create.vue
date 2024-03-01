<template>
  <div class="fraction-create">
    <div class="fraction-create-header">
      <h2>Добавить</h2>
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
          {{ $t("TagsColTitle") }}:
        </a-col>
        <a-col :span="12">
          <a-input
            v-model="form['title_' + getKey]"
            :placeholder="$t('EnterTheTitle')"
          />
        </a-col>
      </a-row>
      <a-row align="middle" class="flex-baseline input-form__group">
        <a-col :span="6" style="text-align: right; padding-right: 8px">
          {{ $t("TagsColNumber") }}:
        </a-col>
        <a-col :span="12">
          <a-input
            v-model="form.okrug_number"
            type="number"
            :class="{ invalid: $v.form.okrug_number.$error }"
            min="1"
            placeholder="Введите номер"
          />
        </a-col>
      </a-row>
      <a-row align="top" class="input-form__group" type="flex">
        <a-col
          :span="6"
          style="text-align: right; padding-top: 5px; padding-right: 8px"
        >
          {{ $t("Region") }}:
        </a-col>
        <a-col :span="12">
          <a-select
            v-model="form.region"
            :filter-option="filterOption"
            :class="{ invalid: $v.form.region.$error }"
            show-search
            style="width: 100%"
            option-label-prop="label"
          >
            <a-select-option
              v-for="item in allRegions"
              :key="item.id"
              :value="item.id"
              :label="item.title"
            >
              {{ item.title }}
            </a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <!-- Область  -->

      <a-row align="top" class="input-form__group" type="flex">
        <a-col
          :span="6"
          style="text-align: right; padding-top: 5px; padding-right: 8px"
        >
          {{ $t("Region") }}:
        </a-col>
        <a-col :span="12">
          <a-select
            v-model="form.district"
            :class="{ invalid: $v.form.district.$error }"
            :filter-option="filterOption"
            show-search
            style="width: 100%"
            option-label-prop="label"
            mode="multiple"
          >
            <a-select-option
              v-for="item in allDistrict.districts"
              :key="item.id"
              :value="item.id"
              :label="item.title"
            >
              {{ item.title }}
            </a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <!-- Sub-district -->
      <a-row align="top" class="input-form__group" type="flex">
        <a-col
          :span="6"
          style="text-align: right; padding-top: 5px; padding-right: 8px"
        >
          {{ $t("Region") }}:
        </a-col>
        <a-col :span="12">
          <a-select
            v-model="form.sub_district"
            style="width: 100%"
            :class="{ invalid: $v.form.sub_district.$error }"
            option-label-prop="label"
            mode="multiple"
            :default-active-first-option="false"
            :show-arrow="false"
            :not-found-content="null"
            :filter-option="filterOption"
            show-search
            @search="handleSearch"
            @change="handleChange"
            @focus="handleChange"
          >
            <a-select-opt-group
              v-for="item in filteredSubdistrict"
              :key="item.id"
              :value="item.id"
              :label="item.title"
            >
              <span slot="label">{{ item.title }}</span>
              <a-select-option
                v-for="dis in item.sub_districts"
                :key="dis.id"
                :value="dis.id"
                :label="dis.title"
              >
                {{ dis.title }}
              </a-select-option>
            </a-select-opt-group>
          </a-select>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="6" />
        <a-col :span="12">
          <a-button
            style="margin-left: 10px"
            type="primary"
            :disabled="isFilled"
            @click="submitFraction"
          >
            <a-icon type="check" />
            {{ $t("Add") }}
          </a-button>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script>
import { required } from "vuelidate/lib/validators"
export default {
  name: "CommissionCreate",
  data() {
    return {
      langTab: $langPrefix,
      form: {
        title_uz: "",
        title_en: "",
        title_qr: "",
        title_oz: "",
        title_ru: "",
        okrug_number: null,
        region: null,
        district: [],
        sub_district: []
      },
      allRegions: [],
      allDistrict: [],
      allSubDistricts: [],
      searchText: null
    }
  },
  validations: {
    form: {
      district: {
        required
      },
      okrug_number: {
        required
      },
      region: {
        required
      },
      sub_district: {
        required
      }
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
    getKey() {
      return this.langTab
    },
    regionId() {
      return this.form.region
    },
    districtId() {
      return this.form.district
    },
    filteredSubdistrict() {
      return this.searchText && this.allSubDistricts.length
        ? this.allSubDistricts.map((i) => {
            return {
              ...i,
              sub_districts: i.sub_districts.length
                ? i.sub_districts.filter((i) => {
                    return i.title
                      .toLowerCase()
                      .includes(this.searchText.toLowerCase())
                  })
                : []
            }
          })
        : this.allSubDistricts
    }
  },
  watch: {
    regionId(val) {
      if (val) {
        this.form.district = []
        this.getRegionDistrict(val)
      }
    },
    districtId(val) {
      if (val.length) {
        this.getSubDistricts(val)
      }
    }
  },
  created() {
    this.getAllRegions()
  },
  methods: {
    translitAction() {},
    async getAllRegions() {
      this.allRegions = await this.$store.dispatch("okrug/fetchAllRegions")
      console.log(this.allRegions)
    },
    async getRegionDistrict(id) {
      this.allDistrict = await this.$store.dispatch(
        "okrug/fetchRegionDistricts",
        id
      )
    },
    async getSubDistricts(districts) {
      this.allSubDistricts = await this.$store.dispatch(
        "okrug/fetchSubDistrict",
        districts
      )
      console.log(districts)
    },
    async submitFraction() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.$message.error(this.$t("PleaseForm"))
        return
      }
      try {
        const res = await this.$api.post("/common/okrug/create/", this.form)
        this.ISVALID(res, () => {
          this.$router.go(-1)
        })
      } catch (e) {
        console.log(e)
      }
    },
    handleSearch(value) {
      this.searchText = value
    },
    handleChange() {
      this.searchText = null
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
</style>
