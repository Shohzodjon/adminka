<template>
  <component
    :is="link ? 'a' : 'span'"
    v-if="file"
    :href="link ? filesUrl + '/news/' + file.name : ''"
    class="file-field-cnt d-flex__center-items doc-link"
    target="_blank"
  >
    <a-row class="flex-1">
      <i
        aria-label="icon: paper-clip"
        class="anticon anticon-paper-clip"
        style="font-size: 16px; dislay: flex; align-items: center"
      >
        <svg
          aria-hidden="true"
          class
          data-icon="paper-clip"
          fill="currentColor"
          focusable="false"
          height="1em"
          viewBox="64 64 896 896"
          width="1em"
        >
          <path
            d="M779.3 196.6c-94.2-94.2-247.6-94.2-341.7 0l-261 260.8c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0 0 12.7 0l261-260.8c32.4-32.4 75.5-50.2 121.3-50.2s88.9 17.8 121.2 50.2c32.4 32.4 50.2 75.5 50.2 121.2 0 45.8-17.8 88.8-50.2 121.2l-266 265.9-43.1 43.1c-40.3 40.3-105.8 40.3-146.1 0-19.5-19.5-30.2-45.4-30.2-73s10.7-53.5 30.2-73l263.9-263.8c6.7-6.6 15.5-10.3 24.9-10.3h.1c9.4 0 18.1 3.7 24.7 10.3 6.7 6.7 10.3 15.5 10.3 24.9 0 9.3-3.7 18.1-10.3 24.7L372.4 653c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0 0 12.7 0l215.6-215.6c19.9-19.9 30.8-46.3 30.8-74.4s-11-54.6-30.8-74.4c-41.1-41.1-107.9-41-149 0L463 364 224.8 602.1A172.22 172.22 0 0 0 174 724.8c0 46.3 18.1 89.8 50.8 122.5 33.9 33.8 78.3 50.7 122.7 50.7 44.4 0 88.8-16.9 122.6-50.7l309.2-309C824.8 492.7 850 432 850 367.5c.1-64.6-25.1-125.3-70.7-170.9z"
          />
        </svg>
      </i>
      <span :title="file.name" style="margin-left: 8px; font-size: 16px">
        {{
          file.name ||
          (file && file.file && file.file.split("/")[5]) ||
          (file && file.video && file.video.split("/")[5])
        }}
        <slot />
      </span>

      <p
        v-if="file.updated || file.created"
        style="text-align: right; padding-right: 15px; color: #bbb"
      >
        {{
          moment(new Date(file.updated)).format("DD-MMM HH:mm") ||
          moment(new Date(file.created)).format("DD-MMM HH:mm")
        }}
      </p>
    </a-row>

    <a-popconfirm
      placement="bottomRight"
      title="Вы действительно хотите удалить данный файл?"
      @confirm="$emit('delete', file)"
    >
      <i
        aria-label="icon: close"
        class="-link- anticon anticon-close"
        tabindex="-1"
      >
        <svg
          aria-hidden="true"
          class
          data-icon="close"
          fill="currentColor"
          focusable="false"
          height="1em"
          viewBox="64 64 896 896"
          width="1em"
        >
          <path
            d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"
          />
        </svg>
      </i>
    </a-popconfirm>
  </component>
</template>

<script>
export default {
  props: {
    file: {
      type: [Object, String, File],
      required: true
    },
    link: {
      type: Boolean,
      default: () => false
    }
  }
}
</script>
