<template>
  <div class="deputy-create">
    <!-- lang tabs -->
    <a-row align="middle" class="flex-baseline" style="margin-bottom: 15px">
      <a-col :span="6" style="text-align: right; padding-right: 8px">
        {{ $t("Lang") }}:
      </a-col>
      <a-col :span="12">
        <!-- lang translit tabs -->
        <a-row align="middle" class="flex-baseline flex-wrap">
          <lang-tabs v-model="langTab" class="mb-1x" />
          <a-button
            v-if="langTab == 'uz' || langTab == 'oz'"
            @click.stop="translitAction"
          >
            <span v-if="$i18n.locale == 'ru'"
              >{{ $t("TranslateCopyTo") }}
              {{ langTab == "uz" ? $t("Cyrillic") : $t("Latin") }}</span
            >
            <span v-else>
              {{ langTab == "uz" ? $t("Cyrillic") : $t("Latin")
              }}{{ $t("TranslateCopyTo") }}</span
            >
          </a-button>
        </a-row>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="12">
        <div class="form_field">
          <div class="deputy_image">
            <img :src="image_url" />
          </div>
          <input
            type="file"
            accept="image/jpg, image/jpeg, image/png, image/svg"
            @change="handleFile"
          />
        </div>
        <div class="form_field">
          <label>{{ $t("FormFirstName") }}</label>
          <a-input
            v-model="form.first_name[langTab]"
            :placeholder="$t('FormFirstNamePlace')"
          />
        </div>
        <div class="form_field">
          <label>{{ $t("FormLastName") }}</label>
          <a-input
            v-model="form.last_name[langTab]"
            :placeholder="$t('FormLastNamePlace')"
          />
        </div>
        <div class="form_field">
          <label>{{ $t("FormMiddleName") }}</label>
          <a-input
            v-model="form.middle_name[langTab]"
            :placeholder="$t('FormMiddleNamePlace')"
          />
        </div>
        <div class="form_field">
          <label>{{ $t("FormBirthDate") }}</label>
          <!-- <a-date-picker
            :default-value="form.birth_date"
            @change="handleDate"
          /> -->
          <input v-model="form.birth_date" type="date" />
        </div>
        <div class="form_field">
          <label>{{ $t("FormBirthPlace") }}</label>
          <a-input
            v-model="form.birth_place[langTab]"
            :placeholder="$t('FormBirthPlacePlaceholder')"
          />
        </div>
        <div class="form_field">
          <label>{{ $t("FormWorkPlace") }}</label>
          <a-input
            v-model="form.work_place[langTab]"
            :placeholder="$t('FormWorkPlacePlaceholder')"
          />
        </div>
        <!-- <div class="form_field">
          <label>Position</label>
          <a-input
            v-model="form.position[langTab]"
            :placeholder="$t('InputText')"
          />
        </div> -->
        <div class="form_field">
          <label>{{ $t("FormNat") }}</label>
          <a-input
            v-model="form.nationality[langTab]"
            :placeholder="$t('FormNatPlace')"
          />
        </div>
        <div class="form_field">
          <label>{{ $t("FormEdu") }}</label>
          <a-select
            v-model="form.education"
            :placeholder="$t('FormAcademDegPlace')"
          >
            <a-select-option
              v-for="item of academic_degrees"
              :key="item.id"
              :value="item.id"
            >
              {{ item.title }}
            </a-select-option>
          </a-select>
        </div>
        <div class="form_field">
          <label>{{ $t("FormUni") }}</label>
          <a-auto-complete
            v-model="form.university[langTab]"
            :data-source="dataSource"
            :placeholder="$t('FormUniPlace')"
            @search="onSearch"
          />
        </div>
        <div class="form_field">
          <label>{{ $t("FormSpec") }}</label>
          <a-input
            v-model="form.speciality[langTab]"
            :placeholder="$t('FormSpec')"
          />
        </div>
        <div class="form_field">
          <label>{{ $t("FormAcademDeg") }}</label>
          <a-input
            v-model="form.academic_degree[langTab]"
            :placeholder="$t('InputText')"
          />
        </div>
        <div class="form_field">
          <label>{{ $t("FormAcademtit") }}</label>
          <a-input
            v-model="form.academic_title[langTab]"
            :placeholder="$t('FormAcademtitPlace')"
          />
        </div>
        <div class="form_field">
          <label>{{ $t("FormBodies") }}</label>
          <a-input
            v-model="form.elected_government_bodies[langTab]"
            placeholder=""
          />
        </div>
        <div class="form_field">
          <label>{{ $t("Lang") }}</label>
          <a-input
            v-model="form.languages[langTab]"
            :placeholder="$t('Lang')"
          />
        </div>
        <div class="form_field">
          <label>{{ $t("Email") }}</label>
          <a-input v-model="form.email" :placeholder="$t('Email')" />
        </div>
      </a-col>

      <a-col :span="12">
        <div class="form_field">
          <a-checkbox @change="checkChamber">
            {{ $t("isMemberCouncil") }}
          </a-checkbox>
        </div>
        <div class="form_field">
          <label>{{ $t("TelNumber") }}</label>
          <a-input
            v-model="form.phone_number_1"
            placeholder="+998(__) ___ __ __"
            type="number"
          />
        </div>
        <div class="form_field">
          <label>{{ $t("ExtraNumber") }}</label>
          <a-input
            v-model="form.phone_number_2"
            placeholder="+998(__) ___ __ __"
            type="number"
          />
        </div>
        <div class="form_field">
          <label>Facebook</label>
          <a-input v-model="form.fb_account" placeholder="Facebook" />
        </div>
        <div class="form_field">
          <label>Telegram</label>
          <a-input v-model="form.tg_account" placeholder="Telegram" />
        </div>
        <div class="form_field">
          <label>Twitter</label>
          <a-input v-model="form.tw_account" placeholder="Facebook" />
        </div>
        <div class="form_field">
          <label>Instagram</label>
          <a-input v-model="form.inst_account" placeholder="Instagram" />
        </div>
        <div class="form_field">
          <label>Tiktok</label>
          <a-input v-model="form.tiktok_account" placeholder="Tiktok" />
        </div>
        <div class="form_field">
          <label>youtube</label>
          <a-input v-model="form.youtube" placeholder="youtube" />
        </div>
        <div class="form_field">
          <label>{{ $t("WebSite") }}</label>
          <a-input v-model="form.web" :placeholder="$t('WebSite')" />
        </div>
        <!-- <div class="form_field">
          <label>Region</label>
          
          <a-select
            v-model="form.region"
            width="400px"
            @change="selectRegion()"
          >
            <a-select-option
              v-for="item in regionList"
              :key="item.id"
              :value="item.id"
            >
              {{ item.title }}
            </a-select-option>
          </a-select>
        </div>
        <div class="form_field">
          <label>District</label>
        
          <a-select v-model="form.district" width="400px">
            <a-select-option
              v-for="item in districtList"
              :key="item.id"
              :value="item.id"
            >
              {{ item.title }}
            </a-select-option>
          </a-select>
        </div> -->
        <div class="form_field">
          <label>{{ $t("FormOkrug") }}</label>

          <a-select
            v-model="form.okrug"
            :filter-option="filterOption"
            show-search
            width="400px"
          >
            <a-select-option
              v-for="item in okrugList"
              :key="item.id"
              :value="item.id"
            >
              {{ item.title }}
            </a-select-option>
          </a-select>
        </div>
        <!-- <div class="form_field">
          <label>Constituency</label>
          <a-input
            v-model="form.constituency[langTab]"
            :placeholder="$t('InputText')"
          />
        </div> -->
        <!-- <div class="form_field">
          <label>Party</label>
          <a-input
            v-model="form.party[langTab]"
            :placeholder="$t('InputText')"
          />
        </div> -->
        <div class="form_field">
          <label>{{ $t("FormState") }}</label>
          <a-input
            v-model="form.state_awards[langTab]"
            :placeholder="$t('InputText')"
          />
        </div>
        <div class="form_field">
          <label>{{ $t("FormFraction") }}</label>
          <a-select
            v-model="form.fraction"
            :filter-option="filterOption"
            show-search
            width="400px"
          >
            <a-select-option
              v-for="item in fractionList"
              :key="item.id"
              :value="item.id"
            >
              {{ item.title }}
            </a-select-option>
          </a-select>
        </div>
        <div class="form_field">
          <label>{{ $t("FormCommittee") }}</label>
          <a-select
            v-model="form.committee"
            :filter-option="filterOption"
            show-search
            width="400px"
          >
            <a-select-option
              v-for="item in committeeList"
              :key="item.id"
              :value="item.id"
            >
              {{ item.title }}
            </a-select-option>
          </a-select>
        </div>

        <div class="form_field">
          <label>{{ $t("DeputyType") }}</label>
          <a-select v-model="form.deputy_type">
            <a-select-option
              v-for="item of deputiesType"
              :key="item.value"
              :value="item.value"
            >
              {{ item.title }}
            </a-select-option>
          </a-select>
        </div>
        <div class="form_field_btn">
          <a-button
            style="margin-left: 10px"
            type="primary"
            :disabled="isFilled"
            @click="submitDeputy"
          >
            <a-icon type="check" />
            {{ "Добавить" }}
          </a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import validator from "@/mixins/validator"
const classObj = {
  first_name: {
    ru: "",
    uz: "",
    oz: "",
    en: "",
    qr: ""
  },
  last_name: {
    ru: "",
    uz: "",
    oz: "",
    en: "",
    qr: ""
  },
  middle_name: {
    ru: "",
    uz: "",
    oz: "",
    en: "",
    qr: ""
  },
  birth_place: {
    ru: "",
    uz: "",
    oz: "",
    en: "",
    qr: ""
  },
  work_place: {
    ru: "",
    uz: "",
    oz: "",
    en: "",
    qr: ""
  },
  position: {
    ru: "",
    uz: "",
    oz: "",
    en: "",
    qr: ""
  },
  nationality: {
    ru: "",
    uz: "",
    oz: "",
    en: "",
    qr: ""
  },
  academic_degree: {
    ru: "",
    uz: "",
    oz: "",
    en: "",
    qr: ""
  },
  university: {
    ru: "",
    uz: "",
    oz: "",
    en: "",
    qr: ""
  },
  speciality: {
    ru: "",
    uz: "",
    oz: "",
    en: "",
    qr: ""
  },
  education: null,
  academic_title: {
    ru: "",
    uz: "",
    oz: "",
    en: "",
    qr: ""
  },
  languages: {
    ru: "",
    uz: "",
    oz: "",
    en: "",
    qr: ""
  },
  email: "",
  phone_number_1: "",
  phone_number_2: "",
  fb_account: "",
  tg_account: "",
  tw_account: "",
  inst_account: "",
  tiktok_account: "",
  youtube: "",
  web: "",
  // region: null,
  // district: null,
  okrug: null,
  constituency: {
    ru: "",
    uz: "",
    oz: "",
    en: "",
    qr: ""
  },
  party: {
    ru: "",
    uz: "",
    oz: "",
    en: "",
    qr: ""
  },
  elected_government_bodies: {
    ru: "",
    uz: "",
    oz: "",
    en: "",
    qr: ""
  },
  state_awards: {
    ru: "",
    uz: "",
    oz: "",
    en: "",
    qr: ""
  },
  is_member_council_legislative_chamber: false,
  fraction: [],
  committee: [],
  birth_date: "",
  image: null,
  deputy_type: 0
}

export default {
  name: "WantedCreate",
  mixins: [validator],
  data() {
    return {
      deputiesType: [
        { value: 0, title: this.$t("simpleDeputy") },
        { value: 1, title: this.$t("speakerDeputy") },
        { value: 2, title: this.$t("subSpeakerDeputy") }
      ],
      langTab: $langPrefix,
      university: [],
      dataSource: [],
      academic_degrees: [
        { title: this.$t("higherEducation"), id: 0 },
        { title: this.$t("mediumEducation"), id: 1 }
      ],
      form: classObj,
      committeeList: [],
      fractionList: [],
      image_url: require("../../assets/img/bg.jpg"),
      regionList: [],
      districtList: [],
      okrugList: null,
      requireqKeys: [
        {
          name: "first_name",
          locales: ["ru", "en", "oz", "uz"],
          title: {
            uz: "Ismi",
            en: "First name",
            qr: "Имя",
            oz: "Исм",
            ru: "Имя"
          }
        },
        {
          name: "last_name",
          locales: ["ru", "en", "oz", "uz"],
          title: {
            uz: "Familiyasi",
            en: "Last name",
            qr: "Фамилия",
            oz: "Фамилия",
            ru: "Фамилия"
          }
        },
        {
          name: "middle_name",
          locales: ["ru", "en", "oz", "uz"],
          title: {
            uz: "Otasini ismi",
            en: "Middle name",
            qr: "Отечество",
            oz: "Шариф",
            ru: "Отечество"
          }
        },
        {
          name: "okrug",
          title: {
            uz: "Okrug",
            en: "Okrug",
            qr: "Okrug",
            oz: "Okrug",
            ru: "Okrug"
          }
        }
        // {
        //   name: "image",
        //   title: {
        //     uz: "Image",
        //     en: "Image",
        //     qr: "Image",
        //     oz: "Image",
        //     ru: "Image"
        //   }
        // }
        // fb_account
      ],
      localeKeys: ["first_name", "last_name", "middle_name"]

      // isFilled: false
    }
  },
  computed: {
    isFilled() {
      return this.form.birth_date == ""
    }
  },
  async created() {
    this.okrugList = await this.$store.dispatch("wanted/fetchOkrugList")
    this.university = await this.$store.dispatch("wanted/fetchUniversity")
  },
  mounted() {
    this.fetchRegionList()
    this.fetchData()
    this.fetchDetail()
  },
  methods: {
    onSearch(searchText) {
      this.dataSource = this.university.filter((i) =>
        i.name.toLowerCase().includes(searchText.toLowerCase())
      )
      this.dataSource = this.dataSource.map((i) => i.name)
      console.log(this.dataSource)
    },
    translitAction() {
      //   try {
      // const from = this.langTab,
      //   to = this.langTab == "uz" ? "oz" : "uz",
      //   methodName = this.langTab == "uz" ? "toKirill" : "toLatin"
      // if (this.form.title[from]) {
      //   this.form.title[to] = this[methodName](this.form.title[from])
      // }
      // if (this.form.content[from]) {
      //   this.form.content[to] = this[methodName](this.form.content[from])
      // }
      // turn on translit target language_support
      // this.$set(this.form.language_support, to, true);
      // this.form.language_support[to] = true
      //   } catch (error) {
      //     this.$sentry.captureMessage(error)
      //   }
    },
    async fetchData() {
      let res1 = await this.$api.get("/structure/faction/list/")
      let res2 = await this.$api.get("/structure/committee/list/")
      this.fractionList = res1.data
      this.committeeList = res2.data
    },
    async submitDeputy() {
      let form = { ...this.form }
      console.log("form", form)
      delete form.odnkl_account
      // console.log(form)
      // console.log("validator", this.validator(form))

      // let linkList = [
      //   {
      //     title: "Tik tok",
      //     example: "https://tiktok.com/username",
      //     link: this.form.tiktok_account,
      //     requireLink: "https://tiktok.com",
      //     key: "tiktok_account"
      //   },
      //   {
      //     title: "Facebook",
      //     example: "https://facebook.com/username",
      //     link: this.form.fb_account,
      //     requireLink: "https://facebook.com",
      //     key: "fb_account"
      //   },
      //   {
      //     title: "Odnaklasniki",
      //     example: "https://ok.ru/username",
      //     link: this.form.odnkl_account,
      //     requireLink: "https://ok.ru",
      //     key: "odnkl_account"
      //   },
      //   // {
      //   //   title: 'Telegram',
      //   //   example: 'https://tiktok.com/username',
      //   //   link: this.form.tg_account,
      //   //   requireLink: 'https://tiktok.com'
      //   //   key: 'tg_account'
      //   // },
      //   {
      //     title: "Twitter",
      //     example: "https://twitter.com/username",
      //     link: this.form.tw_account,
      //     requireLink: "https://twitter.com",
      //     key: "tw_account"
      //   },
      //   {
      //     title: "Instagram",
      //     example: "https://instagram.com/username",
      //     link: this.form.inst_account,
      //     requireLink: "https://instagram.com",
      //     key: "inst_account"
      //   }
      // ]
      // if (!this.phoneNumberChecker(this.form.phone_number_1)) {
      //   return
      // }

      // if (this.linksChecker(linkList)) {
      //   return
      // }

      if (this.validator(form)) {
        return
      }
      // if (
      //   this.form.phone_number_1 &&
      //   !this.phoneNumberChecker(this.form.phone_number_1, "Telephone number")
      // ) {
      //   return
      // }
      // if (
      //   this.form.phone_number_2 &&
      //   !this.phoneNumberChecker(this.form.phone_number_2, "Extra phone")
      // ) {
      //   return
      // }

      let phone_number_1 = form.phone_number_1
      let phone_number_2 = form.phone_number_2
      delete form.phone_number_1
      delete form.phone_number_2
      // console.log(form)
      Object.keys(form).forEach((k) => {
        typeof form[k] === "object" &&
          k != "image" &&
          form[k] != null &&
          Object.keys(form[k]).forEach((k2) => {
            form[k + "_" + k2] = form[k][k2]
          })
        typeof form[k] === "object" &&
          k != "image" &&
          form[k] != null &&
          delete form[k]
      })
      let f = new FormData()
      Object.keys(form).forEach((k) => {
        k == "deputy_type" && f.append(k, form[k])
        if (k != "image") {
          form[k] ? f.append(k, form[k]) : f.append(k, "")
        }
        k == "image" &&
          form[k] &&
          typeof form[k] === "object" &&
          console.log("f", form[k], typeof form[k])
        k == "education" && form[k] != null && f.append(k, form[k])
        k == "image" &&
          form[k] &&
          typeof form[k] === "object" &&
          f.append(k, form[k], form[k].name)
      })
      // phone_number_1 && f.append("phone_number_1", phone_number_1)
      // phone_number_2 && f.append("phone_number_2", phone_number_2)
      f.append("phone_number_2", phone_number_2)
      f.append("phone_number_1", phone_number_1)
      const res = await this.$api.patch(
        "/structure/deputy/update/" + this.form.id + "/",
        f
      )
      this.ISVALID(res, () => {
        this.$router.push({
          path: "/wanted"
        })
      })
    },
    checkChamber(e) {
      this.form.is_member_council_legislative_chamber = e.target.checked
    },
    handleDate(date) {
      this.form.birth_date = date
      // console.log(date)
    },
    handleFile(e) {
      // console.log(e.target.files[0])
      this.image_url = URL.createObjectURL(e.target.files[0])
      this.form.image = e.target.files[0]
    },
    async fetchDetail() {
      let { data } = await this.$api.get(
        "/structure/deputy/update/" +
          (this.$route.params && this.$route.params.id) +
          "/"
      )
      let form = {}
      console.log(data)
      Object.keys(data).forEach((k) => {
        let splitKey = k.split("_")
        // console.log(splitKey[splitKey.length - 1])
        if (
          splitKey.length > 1 &&
          (splitKey[splitKey.length - 1] == "uz" ||
            splitKey[splitKey.length - 1] == "qr" ||
            splitKey[splitKey.length - 1] == "oz" ||
            splitKey[splitKey.length - 1] == "en" ||
            splitKey[splitKey.length - 1] == "ru")
        ) {
          // console.log(k)
          let key = splitKey.slice(0, splitKey.length - 1).join("_")
          form[key] = { ...form[key] }
          form[key][splitKey[splitKey.length - 1]] = data[k]
        } else {
          form[k] = data[k]
        }
      })
      this.form = form
      this.image_url = this.form.image
      this.$set(this.form, "image", null)
      // this.form.birth_date = this.moment.utc(
      //   new Date(this.form.birth_date),
      //   "YYYY-MM-DD"
      // )
      // this.form.birth_date = new Date(this.form.birth_date)
      this.form && this.form.region && this.selectRegion()
      console.log(this.form, data)
    },
    async fetchRegionList() {
      let res = await this.$api.get("/common/region/list/")
      if (res && res.data) {
        this.regionList = res.data.map((el) => {
          return { ...el }
        })
      }
    },
    async selectRegion() {
      // let region = this.regionList.find((r) => r.id == this.form.region)
      let res = await this.$api.get(
        "/common/region/detail/" + this.form.region + "/"
      )
      console.log(res)
      this.districtList = res && res.data && res.data.districts
    }
  }
}
</script>

<style>
.deputy-create {
  padding: 15px 0;
}
.form_field {
  margin: 10px 0;
  height: 70px;
  padding: 0 30px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.form_field > .deputy_image {
  width: 70px;
  height: 70px;
  border: 1px solid grey;
  border-radius: 40px;
  overflow: hidden;
  display: inline;
  margin-right: 30px;
}
.form_field > .deputy_image > img {
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
input[type="date"] {
  border-radius: 2px;
  padding: 4px;
  border: 1px solid #c7c7c7;
  width: 100%;
}
</style>
