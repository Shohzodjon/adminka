<template>
  <a-modal
    title="Вставка спойлера"
    :visible="true"
    ok-text="Добавить"
    @ok="$emit('ok')"
    @cancel="$emit('cancel')"
  >
    <a-col class="mb-2">
      <p>Заголовок</p>
      <p v-if="value.valid" class="spoiler__text">Заполните заголовок</p>
      <a-textarea v-model="value.title" class="font-16" />
    </a-col>

    <a-col class="mb-2">
      <p>Контент</p>
      <p v-if="value.valid" class="spoiler__text">Заполните контент</p>
      <spoilerEditor
        :key="$route.fullPath + '__' + !!value.modalVisibility"
        :api-key="tinymce.default.token"
        :value="value.content || ''"
        :initial-value="value.content || '<p></p>'"
        :init="{
          ...tinymce.default.props
        }"
        @input="
          $emit('change', {
            ...value,
            content: arguments[0]
          })
        "
      />
    </a-col>
  </a-modal>
</template>
<script>
export default {
  components: {
    spoilerEditor: () => import("@tinymce/tinymce-vue")
  },
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
<style lang="scss" scoped>
.spoiler__text {
  color: red;
  font-size: 13px;
  margin-bottom: 0;
  text-align: right;
}
</style>
