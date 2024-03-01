<template>
  <a-col>
    <a-col class="form-input-margin">
      <a-col class="form-input-title"> Язык </a-col>
      <lang-tabs v-model="langTab" />
    </a-col>

    <a-col class="form-input-margin">
      <a-col class="form-input-title"> Название тега </a-col>
      <a-input
        v-model="form.name[langTab]"
        placeholder="Введите название тега"
        :spell-check="false"
      />
    </a-col>

    <a-col class="form-input-margin">
      <a-col class="form-input-title"> Статус </a-col>
      <a-switch v-model="form.status" />
    </a-col>

    <a-row type="flex" justify="end">
      <a-button @click="$emit('cancel', $event)"> Отмена </a-button>
      <a-button type="primary" @click="emitForm"> ОК </a-button>
    </a-row>
  </a-col>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    form: {
      name: {
        uz: "",
        oz: "",
        ru: "",
        en: ""
      },
      status: true
    },
    langTab: $langPrefix
  }),
  mounted() {
    if (this.data) {
      // eslint-disable-next-line no-unused-vars
      const { created, updated, ...props } = this.data

      this.form = {
        ...props,
        name: {
          ...this.form.name,
          [this.$i18n.locale]: props.name
        }
      }
    }
  },
  methods: {
    emitForm() {
      this.$emit("submit", this.form)
    }
  }
}
</script>
