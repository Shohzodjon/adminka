<template>
  <a-col class="relative r-wanted search-input">
    <a-input
      v-model="text"
      :disabled="searching"
      class="search-input__input"
      :spell-check="false"
      v-bind="$attrs"
      @input="emitText($event, $props)"
    />

    <a-button class="search-input__icon z-index-0" type="primary">
      <a-icon :type="searching ? 'loading' : 'search'" />
    </a-button>
  </a-col>
</template>

<script>
import { debounce } from "lodash"

export default {
  props: {
    postClear: Boolean,
    searching: Boolean,
    delay: {
      type: Number,
      default: () => 800
    }
  },

  data: () => ({
    text: ""
  }),

  methods: {
    emitText: debounce(function (e) {
      if (this.postClear) {
        this.$emit("input", e.target.value)
        this.text = ""
        return
      }

      this.$emit("input", e.target.value)
      this.$emit("handler")
    }, 800)
  }
}
</script>

<style></style>
