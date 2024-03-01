<template>
  <div class="d-flex flex-column" style="height: 100%">
    <a-row style="margin-top: 20px">
      <h1>{{ $route.meta.title[$i18n.locale] }}</h1>
    </a-row>
    <imageStore />
  </div>
</template>

<script>
export default {
  components: {
    imageStore: () => import("@/components/imageStorage/imageStorage")
  }
}
</script>
<style>
.scroll-container {
  overflow: auto;
  max-height: 55vh;
  padding: 20px 10px;
}
</style>
