<template>
  <div class="osgImage">
    <template>
      <div class="wrapper">
        <transition name="fade">
          <img
            v-show="loaded && imgSrcComputed"
            class="img"
            :alt="imgSrcComputed"
            :src="imgSrcComputed"
            @load="onLoaded"
          />
        </transition>
        <transition name="fade">
          <div
            v-show="!loaded || !imgSrcComputed"
            class="md-layout md-alignment-center-center avatar-acronim-wrapper"
          >
            <a-spin size="small" />
          </div>
        </transition>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    img: {
      loaded: false,
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    loaded: false
  }),
  computed: {
    imgSrcComputed() {
      return this.filesUrl + (this.img.thumbnail_url || this.img.url)
    }
  },
  methods: {
    onLoaded() {
      this.loaded = true
    }
  }
}
</script>

<style scoped lang="scss">
.osgImage {
  width: 136px;
  height: 136px;
  .img {
    display: block;
    width: 136px;
    height: 136px;
    object-fit: cover;
  }
  .image {
    &__wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 4px;

      &.loaded {
        .image {
          &__item {
            visibility: visible;
            opacity: 1;
            border: 0;
          }

          &__spinner {
            display: none;
            width: 100%;
          }
        }
      }
    }

    &__item {
      width: 100%;
      border-radius: 4px;
      transition: all 0.4s ease-in-out;
      opacity: 0;
      visibility: hidden;
    }
  }
}
</style>
