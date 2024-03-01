<template>
  <a-col class="directory-sub__item">
    <span class="flex-1">
      <slot />
    </span>
    <a-icon
      class="-link-"
      type="edit"
      style="margin-right: 10px"
      @click="$emit('edit', $event)"
    />
    <a-popconfirm
      title="Вы действительно хотите удалить?"
      placement="right"
      ok-text="Да"
      cancel-text="Нет"
      @confirm="$emit('delete', $event)"
    >
      <a-icon type="delete" class="action-btns" />
    </a-popconfirm>
  </a-col>
</template>

<script>
export default {}
</script>
