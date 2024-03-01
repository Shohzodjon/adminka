<template>
  <a-radio-group :value="value" @change="handleTabChange">
    <a-radio-button value="oz">
      <img
        width="14"
        class="flag-svg__tab"
        src="@/assets/img/svg/uzbekistan.svg"
        alt="oz"
      />
      Ўз
    </a-radio-button>
    <a-radio-button value="uz">
      <img
        width="14"
        class="flag-svg__tab"
        src="@/assets/img/svg/uzbekistan.svg"
        alt="uz"
      />
      O'z
    </a-radio-button>
    <a-radio-button value="qr">
      <img
        width="14"
        class="flag-svg__tab"
        src="@/assets/img/svg/uzbekistan.svg"
        alt="en"
      />
      Qr
    </a-radio-button>
    <a-radio-button value="ru">
      <img
        width="14"
        class="flag-svg__tab"
        src="@/assets/img/svg/russia.svg"
        alt="ru"
      />
      Ру
    </a-radio-button>
    <a-radio-button value="en">
      <img
        width="14"
        class="flag-svg__tab"
        src="@/assets/img/svg/united-kingdom.svg"
        alt="en"
      />
      En
    </a-radio-button>
  </a-radio-group>
</template>

<script>
export default {
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    value: {
      type: String,
      default: () => "oz"
    }
  },
  methods: {
    handleTabChange(arg) {
      this.$emit("change", arg.target.value)
    }
  }
}
</script>
