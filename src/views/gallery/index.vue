<template>
  <a-tabs
    :active-key="$route.query.tab || 'photo'"
    class="main-tabs"
    type="card"
    :default-active-key="
      ($route.query.tab &&
        ['photo', 'video'].includes($route.query.tab) &&
        $route.query.tab) ||
      'photo'
    "
    @change="tabPaneChangeHandler"
  >
    <a-tab-pane key="photo">
      <span slot="tab"> <a-icon type="picture" />{{ $t("TablePhoto") }} </span>

      <!--photo table-->
      <photo-tab-table />
    </a-tab-pane>

    <a-tab-pane key="video">
      <span slot="tab"> <a-icon type="video-camera" />{{ $t("Video") }} </span>

      <!--video table-->
      <video-tab-table />
    </a-tab-pane>

    <span slot="tabBarExtraContent">
      <a-button
        style="margin-right: 10px"
        type="primary"
        @click="
          $router.push({
            name: 'gallery-detail',
            params: { type: $route.query.tab || 'photo' },
            query: { type: $route.query.tab || 'photo' }
          })
        "
      >
        <a-icon type="plus" />{{ $t("Add") }}
      </a-button>
    </span>
  </a-tabs>
</template>

<script>
export default {
  components: {
    "photo-tab-table": () => import("@/views/gallery/photo-tab-table"),
    "video-tab-table": () => import("@/views/gallery/video-tab-table")
  },
  methods: {
    tabPaneChangeHandler(e) {
      this.$router.push({ query: { tab: e } }, () => {})
    }
  }
}
</script>
