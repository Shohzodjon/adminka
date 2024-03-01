export default {
  data() {
    return {
      warningText: {
        uz: "Toldirilmagan maydonlar",
        oz: "Тўлдирилмаган майдонлар",
        ru: "Незаполненные поля",
        en: "Not filled fields",
        qr: "Незаполненные поля"
      },
      langsText: {
        uz: "Tillar: ",
        oz: "Тиллар",
        en: "Languages",
        ru: "Языки",
        qr: "Языки"
      },
      linkCheckText: {
        uz: "To'g'ri formatda kiritilishi kerak",
        qr: "Необходимо ввести в правильном формате",
        oz: "Тўғри форматда киритилиши керак",
        ru: "Необходимо ввести в правильном формате",
        en: "Must be entered in correct format"
      }
    }
  },
  methods: {
    validator(form) {
      let notFilledFields = []
      Object.keys(form).forEach((key) => {
        let notFilledLocales = []
        if (!Array.isArray(form[key])) {
          this.isRequiredKey(key) &&
            this.hasLocaleKey(key) &&
            Object.keys(form[key]).forEach((el) => {
              let element = this.requireqKeys.find((k) => k.name == key)
              element &&
                element.locales.includes(el) &&
                !form[key][el] &&
                notFilledLocales.push(el)
            })
          notFilledLocales.length > 0 &&
            notFilledFields.push({
              title: this.defineTitleByKey(key),
              locales: notFilledLocales
            })
          this.isRequiredKey(key) &&
            !form[key] &&
            notFilledFields.push({ title: this.defineTitleByKey(key) })
        } else if (this.isRequiredKey(key) && Array.isArray(form[key])) {
          !form[key].length &&
            notFilledFields.push({ title: this.defineTitleByKey(key) })
        }
      })
      let tag = `<p><b>${this.warningText[this.$i18n.locale]}</b></p><br>`
      notFilledFields.forEach((el) => {
        tag += `${this.tagTextCreator(el)}`
      })
      notFilledFields &&
        notFilledFields.length &&
        this.$store.dispatch("utils/warning", { tags: [tag], danger: true })
      return notFilledFields && notFilledFields.length
    },
    isRequiredKey(key) {
      return !!this.requireqKeys.find((k) => k.name == key)
    },
    hasLocaleKey(key) {
      return !!this.localeKeys.find((el) => el == key)
    },
    defineTitleByKey(key) {
      let defineItem = this.requireqKeys.find((el) => el.name == key)
      console.log("key", key, "define", defineItem.title)
      return (
        (defineItem &&
          defineItem.title &&
          defineItem.title[this.$i18n.locale]) ||
        ""
      )
    },
    tagTextCreator(el) {
      let val = `<p>${el.title}${this.defineLocale(el)}</p><br>`
      return val
    },
    defineLocale(el) {
      let localeText = ""
      el &&
        el.locales &&
        el.locales.forEach((item) => {
          let text =
            item == "uz"
              ? "O'z"
              : item == "oz"
              ? "Ўз"
              : item == "ru"
              ? "Ру"
              : item == "en"
              ? "En"
              : "Qr"
          localeText += text + ","
        })
      return (
        (localeText &&
          `: ${this.langsText[this.$i18n.locale]} ${localeText.slice(
            0,
            localeText.length - 1
          )}`) ||
        ""
      )
    },
    // Link checker
    linksChecker(list) {
      let notRequired = []
      list.forEach((el) => {
        this.isRequiredKey(el.key) &&
          !el.link.includes(el.requireLink) &&
          notRequired.push({ title: el.title, example: el.example })
      })
      let tag = `<p>${this.linkCheckText[this.$i18n.locale]}</p><br>`
      notRequired &&
        notRequired.length &&
        notRequired.forEach((el) => {
          tag += `<p>${el.title}  (${this.linkCheckerTextGenerator()} ${
            el.example
          })</p><br>`
        })
      this.$store.dispatch("utils/warning", { tags: [tag], danger: true })
      return notRequired && notRequired.length
    },
    linkChecker(requireLink, link) {
      return link.includes(requireLink)
    },
    linkCheckerTextGenerator() {
      return this.$i18n.locale == "uz"
        ? "Masalan:"
        : this.$i18n.locale == "oz"
        ? "Масалан:"
        : this.$i18n.locale == "ru"
        ? "Например"
        : this.$i18n.locale == "en"
        ? "For example"
        : "Например"
    },

    // Phone number checker
    phoneNumberChecker(phone, message) {
      console.log(phone, typeof phone)
      if (
        phone &&
        phone[0] == "9" &&
        phone[1] == "9" &&
        phone[2] == "8" &&
        phone.length == 12
      ) {
        let nums = phone.slice(5, 13).split("")
        nums.forEach((e) => {
          console.log(e)
          if (!this.isNumber(e)) {
            console.log("e", e)
            return false
          }
        })
      } else {
        this.$store.dispatch("utils/warning", {
          messages: [
            `"${message}" to'g'ri formatda kiritishi kerak (Masalan: 998901234567)`
          ],
          danger: true
        })
        return false
      }
      return true
    },

    // number checker
    isNumber(el) {
      return (
        el == "1" ||
        el == "2" ||
        el == "3" ||
        el == "4" ||
        el == "5" ||
        el == "6" ||
        el == "7" ||
        el == "8" ||
        el == "9" ||
        el == "0"
      )
    }
  }
}
