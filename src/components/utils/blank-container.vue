<template>
  <div class="content-fix ant-row">
    <div class="content-title ant-row-flex">
      <slot name="title">
        <h2>{{ title }}</h2>
      </slot>

      <slot name="action">
        <a-button
          v-if="!removeBtn"
          style="margin-left: auto"
          type="primary"
          :disabled="loading"
          @click="$emit('add-btn', $event)"
        >
          <a-icon type="plus" />{{ plusBtnText }}
        </a-button>
      </slot>
    </div>

    <a-col :class="wrapperClass">
      <slot />
    </a-col>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: () => false
    },
    title: {
      type: String,
      default: () => ""
    },

    plusBtnText: {
      type: String,
      default: () => "Добавить"
    },
    wrapperClass: {
      type: String,
      default: () => ""
    },
    removeBtn: {
      type: Boolean,
      dafault: () => false
    }
  }
}
</script>
