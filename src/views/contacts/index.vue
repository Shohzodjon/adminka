<template>
  <div>
    <spinner v-if="loading" />
    <a-row>
      <a-col class="height100 flex-1">
        <a-tabs
          :key="$route.fullPath"
          v-model="tabPane"
          class="main-tabs contacts-form-content"
          type="card"
          @change="tabPaneChangeHandler"
        >
          <a-tab-pane key="content">
            <span slot="tab">
              <a-icon type="project" />
              {{ $route.meta.title[$i18n.locale] }}
            </span>
            <!-- lang tabs -->
            <a-row
              align="middle"
              class="flex-baseline"
              style="margin-bottom: 15px"
            >
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

            <!-- address -->
            <a-row align="middle" class="flex-baseline">
              <a-col :span="6" style="text-align: right; padding-right: 8px">
                {{ $t("Adress") }}:
              </a-col>
              <a-col :span="12" class="sm-mb">
                <a-input
                  v-model="form['address_' + getKey]"
                  :placeholder="$t('EnterAdress')"
                />
              </a-col>
            </a-row>

            <!-- office number -->
            <a-row align="middle" class="flex-baseline">
              <a-col :span="6" style="text-align: right; padding-right: 8px">
                {{ $t("Chancery") }}:
              </a-col>
              <a-col :span="12" class="sm-mb">
                <a-input
                  v-model="form.office"
                  :placeholder="$t('EnterChanceryNumb')"
                  @keypress="isNumber"
                />
              </a-col>
            </a-row>

            <!-- phone number -->
            <a-row align="middle" class="flex-baseline">
              <a-col :span="6" style="text-align: right; padding-right: 8px">
                {{ $t("FormPhone") }}:
              </a-col>
              <a-col :span="12" class="sm-mb">
                <a-input
                  v-model="form.phone"
                  :placeholder="$t('FormPhonePlace')"
                  @keypress="isNumber"
                />
              </a-col>
            </a-row>

            <!-- fax number -->
            <a-row align="middle" class="flex-baseline">
              <a-col :span="6" style="text-align: right; padding-right: 8px">
                {{ $t("Faks") }}:
              </a-col>
              <a-col :span="12" class="sm-mb">
                <a-input v-model="form.fax" :placeholder="$t('EnterFaks')" />
              </a-col>
            </a-row>

            <!-- email -->
            <a-row align="middle" class="flex-baseline">
              <a-col :span="6" style="text-align: right; padding-right: 8px">
                {{ $t("Email") }}:
              </a-col>
              <a-col :span="12" class="sm-mb">
                <a-input
                  v-model="form.email"
                  :placeholder="$t('EnterEmail')"
                  @change="form.email = $_toValidEmail($event)"
                />
              </a-col>
            </a-row>

            <!-- bus -->
            <a-row align="middle" class="flex-baseline">
              <a-col :span="6" style="text-align: right; padding-right: 8px">
                {{ $t("Bus") }}:
              </a-col>
              <a-col :span="12" class="sm-mb">
                <a-input v-model="form.bus" :placeholder="$t('EnterBuses')" />
              </a-col>
            </a-row>

            <!-- minibus -->
            <a-row align="middle" class="flex-baseline">
              <a-col :span="6" style="text-align: right; padding-right: 8px">
                {{ $t("MiniBus") }}:
              </a-col>
              <a-col :span="12" class="sm-mb">
                <a-input
                  v-model="form.mini_bus"
                  :placeholder="$t('EnterMinibuses')"
                />
              </a-col>
            </a-row>

            <!-- subway -->
            <a-row align="middle" class="flex-baseline">
              <a-col :span="6" style="text-align: right; padding-right: 8px">
                {{ $t("Metro") }}:
              </a-col>
              <a-col :span="12" class="sm-mb">
                <a-input
                  v-model="form['subway_' + getKey]"
                  :placeholder="$t('EnterMetro')"
                />
              </a-col>
            </a-row>

            <!-- reference point -->
            <a-row align="middle" class="flex-baseline">
              <a-col :span="6" style="text-align: right; padding-right: 8px">
                {{ $t("ReferencePoint") }}:
              </a-col>
              <a-col :span="12" class="sm-mb">
                <a-input
                  v-model="form['reference_point_' + getKey]"
                  :placeholder="$t('EnterLandmark')"
                />
              </a-col>
            </a-row>
            <!-- telegram link -->
            <a-row align="middle" class="flex-baseline">
              <a-col :span="6" style="text-align: right; padding-right: 8px">
                Telegram:
              </a-col>
              <a-col :span="12" class="sm-mb">
                <a-input
                  v-model="form.telegram_link"
                  placeholder="Введите ориентир"
                />
              </a-col>
            </a-row>
            <!-- instagram link -->
            <a-row align="middle" class="flex-baseline">
              <a-col :span="6" style="text-align: right; padding-right: 8px">
                Instagram:
              </a-col>
              <a-col :span="12" class="sm-mb">
                <a-input
                  v-model="form.instagram_link"
                  placeholder="Введите ориентир"
                />
              </a-col>
            </a-row>
            <!-- you tube link -->
            <a-row align="middle" class="flex-baseline">
              <a-col :span="6" style="text-align: right; padding-right: 8px">
                Youtube:
              </a-col>
              <a-col :span="12" class="sm-mb">
                <a-input
                  v-model="form.youtube_link"
                  placeholder="Введите ориентир"
                />
              </a-col>
            </a-row>
            <!-- facebook link -->
            <a-row align="middle" class="flex-baseline">
              <a-col :span="6" style="text-align: right; padding-right: 8px">
                Facebook:
              </a-col>
              <a-col :span="12" class="sm-mb">
                <a-input
                  v-model="form.facebook_link"
                  placeholder="Введите ориентир"
                />
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
                <div class="contact-image">
                  <img :src="image_url" />
                </div>
              </a-col>
            </a-row>

            <!-- work times -->
            <a-row align="middle" class="flex-baseline">
              <a-col :span="6" style="text-align: right; padding-right: 8px">
                {{ $t("WorkingTime") }}:
              </a-col>
              <a-col :span="8" class="sm-mb">
                <!-- Week days -->

                <a-row align="middle" class="mb-2" type="flex">
                  <span class="mr-1 gray-text short-day-names text-center">{{
                    shortDayName[1][$i18n.locale]
                  }}</span>

                  <a-input
                    v-model="form.monday"
                    class="time-picker-input__style"
                    placeholder="Введите время"
                    @keypress="isTimeInput"
                  />
                </a-row>

                <a-row align="middle" class="mb-2" type="flex">
                  <span class="mr-1 gray-text short-day-names text-center">{{
                    shortDayName[2][$i18n.locale]
                  }}</span>

                  <a-input
                    v-model="form.tuesday"
                    class="time-picker-input__style"
                    placeholder="Введите время"
                    @keypress="isTimeInput"
                  />
                </a-row>

                <a-row align="middle" class="mb-2" type="flex">
                  <span class="mr-1 gray-text short-day-names text-center">{{
                    shortDayName[3][$i18n.locale]
                  }}</span>

                  <a-input
                    v-model="form.wednesday"
                    class="time-picker-input__style"
                    placeholder="Введите время"
                    @keypress="isTimeInput"
                  />
                </a-row>

                <a-row align="middle" class="mb-2" type="flex">
                  <span class="mr-1 gray-text short-day-names text-center">{{
                    shortDayName[4][$i18n.locale]
                  }}</span>

                  <a-input
                    v-model="form.thursday"
                    class="time-picker-input__style"
                    placeholder="Введите время"
                    @keypress="isTimeInput"
                  />
                </a-row>

                <a-row align="middle" class="mb-2" type="flex">
                  <span class="mr-1 gray-text short-day-names text-center">{{
                    shortDayName[5][$i18n.locale]
                  }}</span>

                  <a-input
                    v-model="form.friday"
                    class="time-picker-input__style"
                    placeholder="Введите время"
                    @keypress="isTimeInput"
                  />
                </a-row>

                <a-row align="middle" class="mb-2" type="flex">
                  <span class="mr-1 gray-text short-day-names text-center">{{
                    shortDayName[6][$i18n.locale]
                  }}</span>

                  <a-input
                    v-model="form.saturday"
                    class="time-picker-input__style"
                    placeholder="Введите время"
                    @keypress="isTimeInput"
                  />
                </a-row>

                <a-row align="middle" class="mb-2" type="flex">
                  <span class="mr-1 gray-text short-day-names text-center">{{
                    shortDayName[7][$i18n.locale]
                  }}</span>

                  <a-input
                    v-model="form.sunday"
                    class="time-picker-input__style"
                    placeholder="Введите время"
                    @keypress="isTimeInput"
                  />
                </a-row>

                <!--            <a-row align="middle" class="mb-2" type="flex" v-for="(day, index) in 6">-->
                <!--              <span-->
                <!--                class="mr-1 gray-text short-day-names text-center">{{ shortDayName[index + 1][$i18n.locale] }}</span>-->
                <!--              <a-time-picker :defaultValue="moment('09:00', 'HH:mm')"-->
                <!--                             @change="onTimePick('fromTime', index, arguments)"-->
                <!--                             class="time-picker-input__style"-->
                <!--                             format="HH:mm"/>-->
                <!--              <span class="mx-1"></span>-->
                <!--              <a-time-picker :defaultValue="moment('18:00', 'HH:mm')"-->
                <!--                             @change="onTimePick('toTime', index, arguments)"-->
                <!--                             class="time-picker-input__style"-->
                <!--                             format="HH:mm"/>-->
                <!--            </a-row>-->
              </a-col>
            </a-row>
          </a-tab-pane>
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
              <a-icon type="check" />{{ textButton }}
            </a-button>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>
<script>
export default {
  components: {},
  data: () => ({
    langTab: $langPrefix,
    contacts: null,
    loading: false,
    tabPane: "content",
    pending: false,

    form: {
      address_ru: "",
      address_oz: "",
      address_en: "",
      address_uz: "",
      address_qr: "",
      subway_ru: "",
      subway_oz: "",
      subway_en: "",
      subway_uz: "",
      subway_qr: "",
      reference_point_ru: "",
      reference_point_oz: "",
      reference_point_en: "",
      reference_point_uz: "",
      reference_point_qr: "",
      phone: "",
      office: "",
      fax: "",
      email: "",
      bus: "",
      mini_bus: "",
      photo: null,
      facebook_link: "",
      instagram_link: "",
      telegram_link: "",
      youtube_link: "",

      lat_lng: {
        lat: 41.304656,
        lng: 69.264127
      },
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: ""
    },
    weekDays: {
      monday: {
        fromTime: "",
        toTime: ""
      },
      tuesday: {
        fromTime: "",
        toTime: ""
      },
      wednesday: {
        fromTime: "",
        toTime: ""
      },
      thursday: {
        fromTime: "",
        toTime: ""
      },
      friday: {
        fromTime: "",
        toTime: ""
      },
      saturday: {
        fromTime: "",
        toTime: ""
      },
      sunday: {
        fromTime: "",
        toTime: ""
      }
    },
    image_url: ""
  }),
  computed: {
    // dayNamesList() {
    //   return Object.keys(this.weekDays)
    // }
    getKey() {
      return this.langTab
    },
    textButton() {
      return this.contacts && this.contacts.id ? "Сохранить" : "Создать"
    }
  },
  async created() {
    this.contacts = await this.$store.dispatch("contacts/fetchContacts")
    console.log(this.contacts)
    if (this.contacts && Object.keys(this.contacts).length) {
      this.form = this.contacts
      this.image_url = this.form && this.form.photo
      this.form.photo = null
    }
    console.log(this.form)
  },
  mounted() {},
  methods: {
    translitAction() {
      try {
        const from = this.langTab,
          to = this.langTab == "uz" ? "oz" : "uz",
          methodName = this.langTab == "uz" ? "toKirill" : "toLatin"

        if (this.form.address[from]) {
          this.form.address[to] = this[methodName](this.form.address[from])
        }
      } catch (error) {
        this.$sentry.captureMessage(error)
      }
    },
    handleFileUpload(e) {
      // this.form.photo = this.$refs.file.files[0]
      console.log(e.target.files[0])
      this.image_url = URL.createObjectURL(e.target.files[0])
      this.form.photo = e.target.files[0]
    },
    tabPaneChangeHandler(arg) {
      this.tabPane = arg
    },
    async submit() {
      this.pending = true
      console.log(this.form)
      let f = new FormData()
      Object.keys(this.form).forEach((k) => {
        k != "photo" && f.append(k, this.form[k])
        k == "photo" &&
          this.form[k] &&
          f.append(k, this.form[k], this.form[k].name)
      })
      try {
        let res = await this.$api({
          method: this.contacts && this.contacts.id ? "patch" : "post",
          url:
            this.contacts && this.contacts.id
              ? "/cms/contact/1/update/"
              : "/cms/contact/create/",
          // data: { ...this.form }
          data: f
        })
        if (res.status === 200) {
          // this.$router.go()
        }
      } catch (e) {
        console.log(e)
      }

      // try {
      //   const r = await this.$api.post("/contact/create", {
      //     address: JSON.stringify(this.form.address),
      //     bus: JSON.stringify(this.form.bus),
      //     minibus: JSON.stringify(this.form.minibus),
      //     subway: JSON.stringify(this.form.subway),
      //     reference_point: JSON.stringify(this.form.reference_point)
      //   })
      //   if (r) {
      //     this.$message.success("Данные сохранены")
      //   }
      // } catch (e) {
      //   console.log(e)
      //   this.pending = false
      // }

      this.pending = false
    }
  }
}
</script>

<style class="">
input[type="file"] {
  margin-bottom: 15px;
}
.contact-image {
  height: 200px;
  overflow: hidden;
}
.contact-image > img {
  height: 100%;
}
</style>
