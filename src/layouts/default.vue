<template>
  <div class="default-class">
    <!-- #Custom SideBar -->
    <div :class="{ sidebar_toggle: collapsed }" class="sidebar-main">
      <div class="sidebar-control" @click="toggleSidebar">
        <i
          :class="[
            't-transition icons icon-chevron-left',
            { active: collapsed }
          ]"
        />
      </div>
      <div class="logo-main">
        <a :href="logoUrl" class="logo">
          <svg
            class="desktop__only nav__logo__svg"
            version="1.1"
            viewBox="0 0 576 566"
            xml:space="preserve"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              <path
                d="M337.7,268.4H484c0,0,4.1-0.5,5,1.2c1,1.7,1.7,2.7,1.7,7.5c0,0,2.2,20.4,0,33.1c0,0-1.4,13.3-3.1,20
                c-1.7,6.7-3.2,15-8.2,26.5c-5,11.5-11.4,27.5-17.8,36.9c-6.4,9.5-19.1,29-30.2,38.2c-11,9.2-26.8,23-40.5,30.1
                c-13.7,7.1-24.3,12.5-36.8,16.4c-12.5,3.9-22.7,6.6-32.6,8c-9.9,1.3-35.8,2.8-49.8,1.2c-14-1.6-35.5-6.9-45.5-10.6
                c-10.1-3.7-25.1-10.3-37.9-18.3c-17-10.5-25.9-19-35.8-28.1c-10.2-9.3-14.6-15.7-15.5-16.9c-0.9-1.2-2.1-2.8-0.7-4.2
                c1.4-1.3,13.3-12.3,13.3-12.3l11-10.4c0,0,1.5-1.5,2.6-1.7c1.1-0.2,2.6-1.1,4,0.7c1.5,1.8,10.7,14.8,22.1,23.7
                c11.4,8.8,23.8,18.8,40.8,25.7c16.9,6.9,23.6,10.3,39.1,11.7c15.6,1.3,27.9,2.2,45.5-0.1c17.7-2.3,35.8-7.2,54-18.2
                c18.2-10.9,38.5-24.9,50.7-43.7c12.1-18.8,15.1-24.1,21.4-39.3s7-22.3,8.1-27.1c1.1-4.7,1.5-8.2,1.5-8.2l-39.1,0.2
                c0,0-1.6,11.2-6.1,22.6c-4.5,11.4-11.4,24.8-19.6,33.8c-8.2,9-22.6,22.7-39.2,30.9c-16.8,8.3-28.6,11.3-37.8,12.2
                c-9.2,0.9-21.5,1-35.2-1.1c-13.7-2.1-36.2-10.7-45.3-17.2c-9.1-6.5-26-20.3-32.5-30.3c-6.5-10.1-11-17.1-15-27.5
                c-3.9-10.4-5.9-16.2-6.4-19.1c-0.5-2.9-0.9-4.1-0.9-4.1H98.2c0,0-1,0.3-2.7-1.7c-1.7-2-1.4-3.1-1.6-9.4c-0.1-6.3,0-15.8,0.9-25.5
                c0.8-8.9,2.3-24.4,4.9-33.2c2.6-8.8,6.4-23,12.1-34c5.8-11,11-21,16.7-29.3c5.6-8.3,16.3-22.1,21.6-26.9c5.3-4.8,14-13.5,20.6-18.2
                c6.6-4.7,14.9-11,24.2-16.1c9.3-5,25.8-13.1,42-17.5c16.2-4.4,25.2-6.3,43.2-7.2c18-1,27.9-0.6,46.2,2.6
                c18.3,3.2,31.3,7.6,46.1,13.9c14.9,6.3,27.2,14,38.5,22.5c11.3,8.5,23.8,20.4,28.4,25.6c4.5,5.3,5.6,6.6,5.6,7.5
                c0,0.9,0.5,1.7-1,3.1c-1.5,1.3-22,22.5-22,22.5s-1.2,1.4-2.1,2.1c-0.9,0.7-1.7,0.7-2.7,0.4c-1-0.3,0.1,0.6-4.2-4.3
                c-4.3-4.9-10.9-11.6-16.9-16.8c-6-5.2-11-9-16.3-12.4c-5.3-3.4-14.8-8.8-20.4-11.5c-5.5-2.7-7.6-3.7-14.7-6.1
                c-7.1-2.5-12-4.2-16.8-5.5c-4.8-1.2-10.2-2-17.6-2.5c-7.4-0.5-17.3-0.5-23-0.5c-5.7,0-11.7,0.3-18.7,1.2
                c-7.1,0.9-19.9,3.7-27.8,7.1c-7.9,3.4-21.9,9.3-29.8,14.2c-7.9,4.9-23.6,15.6-33.2,26.5c-9.6,10.9-18.2,21.5-24.7,34.4
                c-6.5,12.9-13.4,27.5-15.2,36.3c-1.8,8.8-2.8,14.5-2.8,15.2c0,0.7,0,0.7,0,0.7L173,268c0,0,3.2-11.9,6.9-21.8
                c3.7-9.9,14.4-29.5,22-36.8c7.6-7.4,19.3-18.3,27.7-23c8.5-4.7,19.9-10.3,28.5-12.6c8.6-2.3,18-4.5,31.1-4.8
                c13-0.3,26.1,1.3,35.7,4.3c9.6,2.9,23.2,8.5,32.9,14.7c9.7,6.3,21,16.8,26,22.7c5,5.9,6,7.2,6.3,8.2c0.2,1,0.2,2.6-0.9,3.6
                c-1.1,1-23.1,23.7-23.1,23.7s-0.9,1-2,1.5c-1.1,0.5-2.1,1.3-3.4-0.7c-1.3-2.1-9.8-13.4-16.4-18.7c-6.6-5.3-15.1-10.9-24.1-14.2
                c-9-3.3-28.4-4.1-33.4-4.1c-5,0-11.8,0.4-20.3,3.6c-8.5,3.2-20.4,8.4-30.3,19.3c0,0-8.3,7.1-12,14.2c-3.7,7.1-8.2,14.6-9.7,20.7
                c-1.5,6.1-2.6,12.9-2.3,24.2c0.2,11.3,2.1,19.6,3.3,22.8c1.2,3.2,6.1,15,13.4,24.2c7.2,9.2,10.2,11.5,17.8,16.7
                c7.6,5.2,10.9,6.7,17.2,9.7c6.3,2.9,6.9,3.1,15.1,4.3c11.5,1.6,22.1,0.8,28.7-0.4c6.6-1.2,18-5,26.8-10.9
                c8.7-5.9,17.7-13.8,23-20.9c5.3-7.1,6.8-11,9.2-16.4c2.5-5.4,3.6-10.4,3.6-10.4h-67.4c0,0-1.7,0.1-2.8-0.6
                c-1.1-0.7-1.6-1.5-1.6-2.6c0-1.1,0.1-1.1,3.3-4.3c3.2-3.2,30.9-32.2,30.9-32.2s1.1-1.2,2.4-2C336.1,268.2,337.7,268.4,337.7,268.4z
                "
              />
              <path
                d="M292.8,23.8C146,23.8,27,142.8,27,289.6c0,146.8,119,265.8,265.8,265.8c146.8,0,265.8-119,265.8-265.8
                C558.6,142.8,439.6,23.8,292.8,23.8z M292.8,515.8c-124.9,0-226.1-101.2-226.1-226.1c0-124.9,101.2-226.1,226.1-226.1
                c124.9,0,226.1,101.2,226.1,226.1C518.9,414.5,417.7,515.8,292.8,515.8z"
              />
            </g>
          </svg>
          <span
            :class="['logo-text hide__sidebar', { 'op-duration': !collapsed }]"
          >
            Online Service Group
            <br />
            <span class="logo-desc">CMS v1.0</span>
          </span>
        </a>
      </div>

      <!-- #Menu -->
      <!-- perfect-scrollbar -->
      <div id="sidebar-collapsable" class="menu-main">
        <ul class="side-routes">
          <div class="side-active-line" />
          <li
            v-for="route in c_sideBarRoutes"
            :key="route.path"
            :class="mClass(route)"
            :data-url="route.meta.dataUrl"
          >
            <ul class="sidebar-main__route">
              <component :is="'router-link'" :to="route.path" class="relative">
                <a-icon :type="route.meta.iconName" class="side-bar-icons" />
                <span
                  :class="[
                    'trans-0-3 hide__sidebar text-first-capital',
                    { 'op-duration': !collapsed }
                  ]"
                  >{{ route.meta.title[$i18n.locale] }}</span
                >
                <i
                  v-if="route.children"
                  class="t-transition icons icon-chevron-left base-route__arrow"
                />

                <span v-if="route.children" class="content sub-route">
                  <span class="sub-route__scroll__wrapper thin-scroll dark">
                    <router-link
                      v-for="(subRoute, index) in route.children"
                      :key="index + '_' + subRoute.path"
                      :to="subRoute.path"
                      class="sub-route-item"
                    >
                      <span class="trans-0-3 text-first-capital">{{
                        subRoute.meta.title[$i18n.locale]
                      }}</span>
                    </router-link>
                  </span>
                </span>
              </component>
            </ul>
          </li>
        </ul>
      </div>
    </div>

    <div :class="{ toggle_content: collapsed }" class="content-main">
      <!-- Header bar -->
      <a-layout-header class="main-header" style="background: #fff; padding: 0">
        <a-row align="middle" class="header-row" justify="end" type="flex">
          <language-switcher style="margin: 0 10px" />

          <a-popconfirm
            :cancel-text="$t('No')"
            :ok-text="$t('Yes')"
            placement="rightBottom"
            @confirm="$store.commit('setToken')"
          >
            <template slot="title"> {{ $t("ExitText") }} </template>
            <a-button icon="logout"> {{ $t("Exit") }} </a-button>
          </a-popconfirm>
        </a-row>
      </a-layout-header>

      <!-- Content -->
      <a-layout-content class="main-content">
        <div class="content custom_content">
          <router-view />
        </div>
      </a-layout-content>

      <!-- Footer -->
      <a-layout-footer class="footer-main" style="text-align: center">
        <footer>
          <div class="copy">
            <span>© 2006-2023. {{ $t("Reserved") }}</span>
          </div>
          <div class="development">
            <span>
              {{ $t("Site") }}:
              <a href="//www.osg.uz" target="blank">Online Service Group</a>
            </span>
          </div>
        </footer>
      </a-layout-footer>

      <!-- Custom toast -->
      <UtilsCustomToast
        v-if="$store.state.utils.showToast"
        :tags="$store.state.utils.tags"
        :messages="$store.state.utils.messages"
        :info="$store.state.utils.info"
        :danger="$store.state.utils.danger"
        :success="$store.state.utils.success"
      />
    </div>
  </div>
</template>

<script>
import languageSwitcher from "@/components/utils/language-switcher"
export default {
  components: {
    languageSwitcher,
    UtilsCustomToast: () => import("@/components/utils/custom-toast")
  },
  data: () => ({
    collapsed: false,
    openKeys: [],
    sideBarRoutes: []
  }),
  computed: {
    logoUrl() {
      return process.env.NODE_ENV == "development" ? "/" : this.APP_PREFIX
    },
    c_sideBarRoutes() {
      return Object.values(this.sideBarRoutes)
    }
  },
  async mounted() {
    window.addEventListener("resize", this.resizeHandler)
    this.sideBarRoutes = this.h_sideBarRoutes
    this.sideBarRoutes = Object.values(this.sideBarRoutes).filter(
      (el) =>
        el &&
        el.meta &&
        el.meta.roles &&
        el.meta.roles.includes(this.$store.state.role)
    )
    console.log("sideBarRoutes: ", this.sideBarRoutes)
    this.calcSidebarWidth()
  },

  updated() {
    this.linkDrag(this.$route)
    this.calcSidebarWidth()
  },

  beforeMount() {
    const isCollapsed = localStorage.getItem("collapse")
    this.collapsed = isCollapsed ? JSON.parse(isCollapsed) : false
  },
  methods: {
    resizeHandler() {
      this.linkDrag(this.$route)
      const t = setTimeout(() => {
        this.calcSidebarWidth()
        clearTimeout(t)
      }, 320)
    },
    mClass(arg) {
      return [
        "side-route",
        {
          active:
            (this.$route.meta &&
              this.$route.meta.parent === arg.meta.dataUrl) ||
            this.$route.path == arg.path
        }
      ]
    },
    toggleSidebar() {
      this.collapsed = !this.collapsed
      this.$emit("toggle", this.collapsed)
      localStorage.setItem("collapse", this.collapsed)
      const t = setTimeout(() => {
        this.calcSidebarWidth()
        clearTimeout(t)
      }, 320)
    },
    calcSidebarWidth() {
      const sidebar = document.querySelector("#sidebar-collapsable")
      const sidebarRect = (sidebar && sidebar.getBoundingClientRect()) || null

      if (sidebarRect) {
        const w = Math.ceil(sidebarRect.width)
        document.documentElement.style.setProperty("--sidebar-width", w + "px")
      }
    },
    async fetchData() {
      const c = await this.$store.dispatch("category/fetch")

      if (c) {
        let r = c.map((item) => ({
          path: `/category/${item.id}/list`,
          meta: {
            dataUrl: `category_${item.id}`,
            title: {
              [this.$i18n.locale]: item.title
            },
            iconName: "layout"
          }
        }))

        this.sideBarRoutes.category.children = [
          {
            path: "/category",
            name: "category",
            meta: {
              dataUrl: "category",
              title: {
                uz: "Kategoriyalar",
                oz: "Категориялар",
                ru: "Все категории",
                en: "All category list"
              },
              iconName: "layout"
            }
          },
          ...r
        ]
      }
    }
  }
}
</script>

<style scoped>
.custom_content {
  overflow-y: auto;
}
</style>
