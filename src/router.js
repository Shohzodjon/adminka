import Vue from "vue"
import Router from "vue-router"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/",
      component: () =>
        import(/* webpackChunkName: "default" */ "./layouts/default"),

      children: [
        {
          path: "",
          component: () =>
            import(/* webpackChunkName: "index-page" */ "./views")
          // redirect: "/group"
        },

        // category create

        // {
        //   path: "/category/create",
        //   name: "category-create",
        //   component: () =>
        //     import(
        //       /* webpackChunkName: "category-create" */
        //       "./views/category/category-create"
        //     )
        // },

        // category edit
        // {
        //   path: "/category/:cat_id",
        //   name: "category-edit",
        //   component: () =>
        //     import(
        //       /* webpackChunkName: "category-edit" */
        //       "./views/category/category-create"
        //     ),
        //   meta: {
        //     parent: "news"
        //   }
        // },

        // category news list
        // {
        //   path: "/category/:cat_id/list",
        //   name: "category-news",
        //   component: () =>
        //     import(
        //       /* webpackChunkName: "category-news" */
        //       "./views/category/category-news"
        //     ),
        //   meta: {
        //     parent: "news"
        //   }
        // },

        // users
        {
          path: "/users",
          name: "users",
          component: () =>
            import(/* webpackChunkName: "users" */ "./views/users"),
          meta: {
            dataUrl: "users",
            parent: "users",
            title: {
              uz: "Foydalanuvchilar",
              oz: "Фойдаланувчилар",
              ru: "Пользователи",
              en: "Users"
            },
            iconName: "team",
            roles: ["Admin"]
          }
        },
        // news create
        {
          path: "/news-create/:cat_id",
          name: "news-create",
          component: () =>
            import(
              /* webpackChunkName: "news-create" */
              "./views/news/news-detail"
            ),
          meta: {
            parent: "news",
            roles: ["Admin", "Moderator"]
          }
        },

        // news detail
        {
          path: "/news/:id",
          name: "news-detail",
          component: () =>
            import(
              /* webpackChunkName: "news-detail" */
              "./views/news/news-detail"
            ),
          meta: {
            parent: "news",
            roles: ["Admin", "Moderator"]
          }
        },

        // user create
        {
          path: "/user/create",
          name: "user-create",
          component: () =>
            import(
              /* webpackChunkName: "user-create" */
              "./views/users/detail"
            ),
          meta: {
            parent: "users",
            roles: ["Admin"]
          }
        },

        // user detail
        {
          path: "/user/:id",
          name: "user-detail",
          component: () =>
            import(
              /* webpackChunkName: "user-detail" */
              "./views/users/detail"
            ),
          meta: {
            parent: "users",
            roles: ["Admin"]
          }
        },

        // posts
        {
          path: "/category/:id/posts",
          name: "posts",
          component: () => import("./views/posts"),
          meta: {
            roles: ["Admin", "Moderator"]
          }
        },
        // post update
        {
          path: "/category/posts/update/:id",
          name: "post-update",
          component: () => import("./views/posts/_id"),
          meta: {
            roles: ["Admin", "Moderator"]
          }
        },
        // post create
        {
          path: "/category/posts/create",
          name: "post-create",
          component: () => import("./views/posts/create"),
          meta: {
            roles: ["Admin", "Moderator"]
          }
        },

        // menu
        {
          path: "/menu",
          name: "menu",
          component: () =>
            import(/* webpackChunkName: "menu-list" */ "./views/menu"),
          meta: {
            dataUrl: "menu",
            title: {
              uz: "Menyu",
              oz: "Меню",
              ru: "Меню",
              en: "Menu"
            },
            iconName: "hdd",
            roles: ["Admin", "Moderator"]
          }
        },

        // menu detail
        {
          path: "/menu/create",
          name: "menu-create",
          component: () =>
            import(/* webpackChunkName: "menu-create" */ "./views/menu/detail"),
          meta: {
            parent: "menu",
            roles: ["Admin", "Moderator"]
          }
        },

        // menu detail
        {
          path: "/menu/:id",
          name: "menu-detail",
          component: () =>
            import(/* webpackChunkName: "menu-detail" */ "./views/menu/detail"),
          meta: {
            parent: "menu",
            roles: ["Admin", "Moderator"]
          }
        },

        // search
        {
          path: "/search",
          name: "search",
          component: () =>
            import(/* webpackChunkName: "search-list" */ "./views/search"),
          meta: {
            dataUrl: "search",
            title: {
              uz: "Qidirish",
              oz: "Кидириш",
              ru: "Поиск",
              en: "Search"
            },
            iconName: "search",
            roles: ["Admin", "Moderator"]
          }
        },

        // static pages
        {
          path: "/pages",
          name: "pages",
          component: () =>
            import(/* webpackChunkName: "pages" */ "./views/pages"),
          meta: {
            dataUrl: "pages",
            title: {
              uz: "Statik sahifalar",
              oz: "Статик саҳифалар",
              ru: "Статик Страницы",
              en: "Static Pages"
            },
            iconName: "book",
            roles: ["Admin", "Moderator"]
          }
        },

        // static page create
        {
          path: "/pages/create",
          name: "pages-create",
          component: () =>
            import(/* webpackChunkName: "pages" */ "./views/pages/detail"),
          meta: {
            parent: "pages",
            roles: ["Admin", "Moderator"]
          }
        },

        // static page detail
        {
          path: "/pages/:id",
          name: "pages-detail",
          component: () =>
            import(/* webpackChunkName: "pages" */ "./views/pages/detail"),
          meta: {
            parent: "pages",
            roles: ["Admin", "Moderator"]
          }
        },

        // news
        {
          path: "/category",
          name: "category",
          component: () =>
            import(/* webpackChunkName: "news-category" */ "./views/category"),
          meta: {
            dataUrl: "news",
            iconName: "read",
            parent: "news",
            title: {
              uz: "Yangiliklar",
              oz: "Янгиликлар",
              ru: "Новости",
              en: "News"
            },
            roles: ["Admin", "Moderator"]
          }
          // children: []
        },

        // {
        //   path: "/category",
        //   name: "category",
        //   component: () => import(/* webpackChunkName: "category" */ "./views/category"),
        //   meta: {
        //     parent: "news"
        //   }
        // },

        //virtual Reception
        // {
        //   path: "/virtual-reception",
        //   name: "virtual-reception",
        //   component: () =>
        //     import(/* webpackChunkName: "virtual-reception" */ "./views/virtual/index"),
        //   meta: {
        //     dataUrl: "virtual-reception",
        //     title: {
        //       uz: "Virtual qabulxona",
        //       oz: "Виртуал кабулхона",
        //       ru: "Виртуальная приёмная",
        //       en: "Virtual reception"
        //     },
        //     iconName: "layout",
        //     parent: "virtual-reception"
        //   }
        // },
        //
        // //pages
        // {
        //   path: "/pages",
        //   name: "pages",
        //   component: () =>
        //     import(/* webpackChunkName: "pages" */ "./views/pages/index"),
        //   meta: {
        //     dataUrl: "pages",
        //     title: {
        //       uz: "Saxifalar",
        //       oz: "Сахифалар",
        //       ru: "Страницы",
        //       en: "Pages"
        //     },
        //     iconName: "layout",
        //     parent: "pages"
        //   }
        // },
        //
        // //statistics
        //
        // {
        //   path: "/statistics",
        //   name: "statistics",
        //   component: () =>
        //     import(/* webpackChunkName: "statistics" */ "./views/statistics/index"),
        //   meta: {
        //     dataUrl: "statistics",
        //     title: {
        //       uz: "Statistika",
        //       oz: "Статистика",
        //       ru: "Статистика",
        //       en: "Statistics"
        //     },
        //     iconName: "layout",
        //     parent: "statistics"
        //   }
        // },
        //
        // //media
        // {
        //   path: "/media",
        //   name: "media",
        //   component: () =>
        //     import(/* webpackChunkName: "media" */ "./views/media/index"),
        //   meta: {
        //     dataUrl: "media",
        //     title: {
        //       uz: "Ommaviy axborot vositalari",
        //       oz: "Оммавий ахборот воситалари",
        //       ru: "Медиа",
        //       en: "Media"
        //     },
        //     iconName: "layout",
        //     parent: "media"
        //   }
        // },
        //
        // //settings
        // {
        //   path: "/settings",
        //   name: "settings",
        //   component: () =>
        //     import(/* webpackChunkName: "settings" */ "./views/settings/index"),
        //   meta: {
        //     dataUrl: "settings",
        //     title: {
        //       uz: "Sozlamalar",
        //       oz: "Созламалар",
        //       ru: "Настройки",
        //       en: "Settings"
        //     },
        //     iconName: "layout",
        //     parent: "settings"
        //   }
        // },
        //
        // //useful-links
        // {
        //   path: "/useful-links",
        //   name: "useful-links",
        //   component: () =>
        //     import(/* webpackChunkName: "useful-links" */ "./views/links/index"),
        //   meta: {
        //     dataUrl: "useful-links",
        //     title: {
        //       uz: "Foydali havolalar",
        //       oz: "Фойдали хаволалар",
        //       ru: "Полезные ссылки",
        //       en: "Useful links"
        //     },
        //     iconName: "layout",
        //     parent: "useful-links"
        //   }
        // },

        // tag list
        {
          path: "/tags",
          name: "tags",
          component: () =>
            import(/* webpackChunkName: "wanted-list" */ "./views/tags"),
          meta: {
            dataUrl: "tags",
            title: {
              uz: "Teglar",
              oz: "Теглар",
              ru: "Теги",
              en: "Tags"
            },
            iconName: "layout",
            roles: ["Admin", "Moderator"]
          }
        },
        // tags detail
        {
          path: "/tags/:id",
          name: "tags-detail",
          component: () =>
            import(/* webpackChunkName: "menu-detail" */ "./views/tags/_id"),
          meta: {
            parent: "tags",
            roles: ["Admin", "Moderator"]
          }
        },
        // tags create
        {
          path: "/tags/create",
          name: "tags-create",
          component: () =>
            import(/* webpackChunkName: "menu-detail" */ "./views/tags/create"),
          meta: {
            parent: "tags",
            roles: ["Admin", "Moderator"]
          }
        },

        // order-project list
        {
          path: "/order-project",
          name: "order-project",
          component: () =>
            import(
              /* webpackChunkName: "wanted-list" */
              "./views/order-project"
            ),
          meta: {
            dataUrl: "order-project",
            title: {
              uz: "Qonun loyihalari",
              oz: "Қонун лойиҳалари",
              ru: "Законопроекты",
              en: "order-project"
            },
            iconName: "layout",
            roles: ["Admin", "Moderator"]
          }
        },
        // order-project detail
        {
          path: "/order-project/:id",
          name: "order-project-detail",
          component: () =>
            import(
              /* webpackChunkName: "menu-detail" */
              "./views/order-project/_id"
            ),
          meta: {
            parent: "order-project",
            roles: ["Admin", "Moderator"]
          }
        },
        // order-project create
        {
          path: "/order-project/create",
          name: "order-project-create",
          component: () =>
            import(
              /* webpackChunkName: "menu-detail" */
              "./views/order-project/create"
            ),
          meta: {
            parent: "order-project",
            roles: ["Admin", "Moderator"]
          }
        },

        //  deputy-project pages
        {
          path: "/deputy-projects",
          name: "deputy-projects",
          component: () =>
            import(
              /* webpackChunkName: "wanted-list" */
              "./views/deputy-projects"
            ),
          meta: {
            dataUrl: "deputy-projects",
            title: {
              uz: "Deputat tashabbuskor qonun loyihalari",
              oz: "Депутат ташаъъускор конун лойиҳалари",
              ru: "Законопроекты, инициированные депутатом",
              en: "Law bills initiated by the deputy"
            },
            iconName: "layout",
            roles: ["Admin", "Moderator"]
          }
        },
        // detail
        {
          path: "/deputy-projects/:id",
          name: "deputy-projects-detail",
          component: () =>
            import(
              /* webpackChunkName: "menu-detail" */
              "./views/deputy-projects/_id"
            ),
          meta: {
            parent: "deputy-projects",
            roles: ["Admin", "Moderator"]
          }
        },
        //  create
        {
          path: "/deputy-projects/create",
          name: "deputy-projects-create",
          component: () =>
            import(
              /* webpackChunkName: "menu-detail" */
              "./views/deputy-projects/create"
            ),
          meta: {
            parent: "deputy-projects",
            roles: ["Admin", "Moderator"]
          }
        },
        // end of deputy-project page

        // begin deputy responsible
        {
          path: "/deputy-responsible",
          name: "deputy-responsible",
          component: () => import("./views/deputy-responsible"),
          meta: {
            dataUrl: "deputy-responsible",
            title: {
              uz: "Deputat masul bo'lgan qonun loyihalari",
              oz: "Депутат ташаъъускор конун лойиҳалари",
              ru: "Законопроекты, за которые отвечает депутат",
              en: "Bills for which the deputy is responsible"
            },
            iconName: "layout",
            roles: ["Admin", "Moderator"]
          }
        },
        // detail
        {
          path: "/deputy-responsible/:id",
          name: "deputy-responsible-detail",
          component: () =>
            import(
              /* webpackChunkName: "menu-detail" */
              "./views/deputy-responsible/_id"
            ),
          meta: {
            parent: "deputy-responsible",
            roles: ["Admin", "Moderator"]
          }
        },
        //  create
        {
          path: "/deputy-responsible/create",
          name: "deputy-responsible-create",
          component: () =>
            import(
              /* webpackChunkName: "menu-detail" */
              "./views/deputy-responsible/create"
            ),
          meta: {
            parent: "deputy-responsible",
            roles: ["Admin", "Moderator"]
          }
        },

        // end of deputy responsible
        // begin deputy requests
        {
          path: "/deputy-requests",
          name: "deputy-requests",
          component: () => import("./views/deputy-requests"),
          meta: {
            dataUrl: "deputy-requests",
            title: {
              uz: "Deputat so'rovlari",
              oz: "",
              ru: "Запросы депутатов",
              en: "Deputy requests"
            },
            iconName: "layout",
            roles: ["Admin", "Moderator"]
          }
        },
        // detail
        {
          path: "/deputy-requests/:id",
          name: "deputy-requests-detail",
          component: () => import("./views/deputy-requests/_id"),
          meta: {
            parent: "deputy-requests",
            roles: ["Admin", "Moderator"]
          }
        },
        //  create
        {
          path: "/deputy-requests/create",
          name: "deputy-requests-create",
          component: () => import("./views/deputy-requests/create"),
          meta: {
            parent: "deputy-requests",
            roles: ["Admin", "Moderator"]
          }
        },

        // end of deputy requests

        //   begin dailyroutine
        {
          path: "/daily-routine",
          name: "daily-routine",
          component: () => import("./views/daily-routine"),
          meta: {
            dataUrl: "daily-routine",
            title: {
              uz: "Kun tartibi",
              oz: "",
              ru: "Повседневные дела",
              en: "Daily routine"
            },
            iconName: "layout",
            roles: ["Admin", "Moderator"]
          }
        },
        // detail
        {
          path: "/daily-routine/:id",
          name: "daily-routine-detail",
          component: () => import("./views/daily-routine/_id"),
          meta: {
            parent: "daily-routine",
            roles: ["Admin", "Moderator"]
          }
        },
        //  create
        {
          path: "/daily-routine/create",
          name: "daily-routine-create",
          component: () => import("./views/daily-routine/create"),
          meta: {
            parent: "daily-routine",
            roles: ["Admin", "Moderator"]
          }
        },
        // end of dailyroutine

        // begin discussion law
        
        {
          path: "/discussion-law",
          name: "discussion-law",
          component: () =>
            import(
              "./views/discussion-law"
            ),
          meta: {
            dataUrl: "discussion-law",
            title: {
              uz: "Muhokamadagi qonun loyihalar",
              oz: "Мухокамадаги конун лойиҳалар",
              ru: "Законопроекты на обсуждении",
              en: "Bills under discussion"
            },
            iconName: "layout",
            roles: ["Admin", "Moderator"]
          }
        },
        // discussion-law detail
        {
          path: "/discussion-law/:id",
          name: "discussion-law-detail",
          component: () =>
            import(
              "./views/discussion-law/_id"
            ),
          meta: {
            parent: "discussion-law",
            roles: ["Admin", "Moderator"]
          }
        },
        // discussion-law create
        {
          path: "/discussion-law/create",
          name: "discussion-law-create",
          component: () =>
            import(
              "./views/discussion-law/create"
            ),
          meta: {
            parent: "discussion-law",
            roles: ["Admin", "Moderator"]
          }
        },
        //  end of discussion law
 //  KRAUDSORTING
        {
          path: "/crowdsorting",
          name: "crowdsorting",
          component: () =>
            import(
              "./views/crowdsorting"
            ),
          meta: {
            dataUrl: "crowdsorting",
            title: {
              uz: "Kraudsorting",
              oz: "Краудсортинг",
              ru: "Краудсортинг",
              en: "Crowdsorting"
            },
            iconName: "layout",
            roles: ["AppealsInspector"]
          }
        },
       
        // END OF KRAUDSORTING 
        // order-project-category list
        // {
        //   path: "/order-project-category",
        //   name: "order-project-category",
        //   component: () =>
        //     import(
        //       /* webpackChunkName: "wanted-list" */
        //       "./views/order-project-category"
        //     ),
        //   meta: {
        //     dataUrl: "order-project-category",
        //     title: {
        //       uz: "Qonun loyihalari bo'limlari",
        //       oz: "Qonun loyihalari bo'limlari",
        //       ru: "Категории счетов",
        //       en: "order-project categories"
        //     },
        //     iconName: "layout",
        //     roles: ["Admin", "Moderator"]
        //   }
        // },
        // order-project-category detail
        // {
        //   path: "/order-project-category/:id",
        //   name: "order-project-category-detail",
        //   component: () =>
        //     import(
        //       /* webpackChunkName: "menu-detail" */
        //       "./views/order-project-category/_id"
        //     ),
        //   meta: {
        //     parent: "order-project-category",
        //     roles: ["Admin", "Moderator"]
        //   }
        // },
        // order-project-category create
        // {
        //   path: "/order-project-category/create",
        //   name: "order-project-category-create",
        //   component: () =>
        //     import(
        //       /* webpackChunkName: "menu-detail" */
        //       "./views/order-project-category/create"
        //     ),
        //   meta: {
        //     parent: "order-project-category",
        //     roles: ["Admin", "Moderator"]
        //   }
        // },

        // order-project-type list
        // {
        //   path: "/order-project-type",
        //   name: "order-project-type",
        //   component: () =>
        //     import(
        //       /* webpackChunkName: "wanted-list" */
        //       "./views/order-project-type"
        //     ),
        //   meta: {
        //     dataUrl: "order-project-type",
        //     title: {
        //       uz: "Qonun loyihalari turlari",
        //       oz: "Qonun loyihalari turlari",
        //       ru: "Категории счетов types",
        //       en: "order-project categories types"
        //     },
        //     iconName: "layout",
        //     roles: ["Admin", "Moderator"]
        //   }
        // },
        // // order-project-type detail
        // {
        //   path: "/order-project-type/:id",
        //   name: "order-project-type-detail",
        //   component: () =>
        //     import(
        //       /* webpackChunkName: "menu-detail" */
        //       "./views/order-project-type/_id"
        //     ),
        //   meta: {
        //     parent: "order-project-type",
        //     roles: ["Admin", "Moderator"]
        //   }
        // },
        // // order-project-type create
        // {
        //   path: "/order-project-type/create",
        //   name: "order-project-type-create",
        //   component: () =>
        //     import(
        //       /* webpackChunkName: "menu-detail" */
        //       "./views/order-project-type/create"
        //     ),
        //   meta: {
        //     parent: "order-project-type",
        //     roles: ["Admin", "Moderator"]
        //   }
        // },

        // // order-project-initiator list
        // {
        //   path: "/order-project-initiator",
        //   name: "order-project-initiator",
        //   component: () =>
        //     import(
        //       /* webpackChunkName: "wanted-list" */
        //       "./views/order-project-initiator"
        //     ),
        //   meta: {
        //     dataUrl: "order-project-initiator",
        //     title: {
        //       uz: "Qonun loyihalari tashabbuskorlari",
        //       oz: "Qonun loyihalari tashabbuskorlari",
        //       ru: "Категории счетов initiator",
        //       en: "order-project categories initiator"
        //     },
        //     iconName: "layout",
        //     roles: ["Admin", "Moderator"]
        //   }
        // },
        // // order-project-type detail
        // {
        //   path: "/order-project-initiator/:id",
        //   name: "order-project-initiator-detail",
        //   component: () =>
        //     import(
        //       /* webpackChunkName: "menu-detail" */
        //       "./views/order-project-initiator/_id"
        //     ),
        //   meta: {
        //     parent: "order-project-initiator",
        //     roles: ["Admin", "Moderator"]
        //   }
        // },
        // // order-project-type create
        // {
        //   path: "/order-project-initiator/create",
        //   name: "order-project-initiator-create",
        //   component: () =>
        //     import(
        //       /* webpackChunkName: "menu-detail" */
        //       "./views/order-project-initiator/create"
        //     ),
        //   meta: {
        //     parent: "order-project-initiator",
        //     roles: ["Admin", "Moderator"]
        //   }
        // },

        // wanted list
        {
          path: "/wanted",
          name: "wanted",
          component: () =>
            import(/* webpackChunkName: "wanted-list" */ "./views/wanted"),
          meta: {
            dataUrl: "wanted",
            title: {
              uz: "Deputatlar",
              oz: "Депутатлар",
              ru: "Депутаты",
              en: "Deputies"
            },
            iconName: "layout",
            roles: ["Admin", "Moderator"]
          }
        },

        // wanted list
        // {
        //     path: "/missing",
        //     name: "missing",
        //     component: () =>
        //         import ( /* webpackChunkName: "missing-list" */ "./views/wanted"),
        //     meta: {
        //         dataUrl: "missing",
        //         title: {
        //             uz: "Bedarak yo'qolganlar",
        //             oz: "Бедарак йўқолганлар",
        //             ru: "Без вести пропавшие",
        //             en: "Missing"
        //         },
        //         iconName: "audit"
        //     }
        // },

        // wanted upload
        // {
        //     path: "/wanted/upload/:type",
        //     name: "wanted-upload",
        //     component: () =>
        //         import (
        //             /* webpackChunkName: "wanted-upload" */
        //             "./views/wanted/wanted-upload"
        //         )
        // },
        // wanted create
        {
          path: "/wanted/create",
          name: "wanted-create",
          component: () =>
            import(
              /* webpackChunkName: "wanted-upload" */
              "./views/wanted/create"
            ),
          meta: {
            roles: ["Admin", "Moderator"]
          }
        },

        // wanted update
        {
          path: "/wanted/:id",
          name: "wanted-update",
          component: () =>
            import(
              /* webpackChunkName: "wanted-upload" */
              "./views/wanted/_id"
            ),
          meta: {
            roles: ["Admin", "Moderator"]
          }
        },
        // deputy articles
        {
          path: "/deputy-articles",
          name: "deputy-articles",
          component: () =>
            import(
              /* webpackChunkName: "wanted-list" */
              "./views/deputy-articles"
            ),
          meta: {
            dataUrl: "deputy-articles",
            title: {
              uz: "Deputat maqolalari",
              oz: "Депутат мақолалари",
              ru: "Депутатские статьи",
              en: "Deputy articles"
            },
            iconName: "layout",
            roles: ["Admin", "Moderator"]
          }
        },
        // deputy articles create
        {
          path: "/deputy-articles/create",
          name: "deputy-articles-create",
          component: () =>
            import(
              /* webpackChunkName: "category-edit" */
              "./views/deputy-articles/create"
            ),
          meta: {
            parent: "deputy-articles",
            roles: ["Admin", "Moderator"]
          }
        },
        // deputy article detail
        {
          path: "/deputy-articles/:id",
          name: "deputy-articles-detail",
          component: () =>
            import(
              /* webpackChunkName: "category-edit" */
              "./views/deputy-articles/_id"
            ),
          meta: {
            parent: "deputy-articles",
            roles: ["Admin", "Moderator"]
          }
        },

        // {
        //     path: "/directory",
        //     name: "directory",
        //     component: () =>
        //         /* webpackChunkName: "wanted-upload" */
        //         import ("./views/directory"),
        //     meta: {
        //         title: {
        //             uz: "Ma'lumotnoma",
        //             oz: "Маълумотнома",
        //             ru: "Справочник",
        //             en: "Directory"
        //         },

        //         dataUrl: "directory",
        //         iconName: "folder"
        //     }
        // },
        // opendata
        // {
        //     path: "/open-data",
        //     name: "opendata",
        //     component: () =>
        //         /* webpackChunkName: "opendata" */
        //         import ("./views/opendata"),
        //     meta: {
        //         title: {
        //             uz: "Ochiq ma'lumotlar",
        //             oz: "Очиқ маълумотлар",
        //             ru: "Открытые данные",
        //             en: "Open data"
        //         },
        //         dataUrl: "open-data",
        //         iconName: "snippets"
        //     }
        // },
        // open-data create
        // {
        //     path: "/open-data/create",
        //     name: "open-data-create",
        //     component: () =>
        //         /* webpackChunkName: "open-data-create" */
        //         import ("./views/opendata/detail"),
        //     meta: {
        //         parent: "open-data"
        //     }
        // },

        // open-data detail
        // {
        //     path: "/open-data/:id",
        //     name: "open-data-detail",
        //     component: () =>
        //         /* webpackChunkName: "open-data-detail" */
        //         import ("./views/opendata/detail"),
        //     meta: {
        //         parent: "open-data"
        //     }
        // },

        // fractions
        {
          path: "/fractions",
          name: "fractions",
          component: () =>
            /* webpackChunkName: "fractions" */
            import("./views/fractions"),
          meta: {
            title: {
              uz: "Fraksiyalar",
              oz: "Фраксиялар",
              ru: "Фракции",
              en: "Fractions"
            },

            dataUrl: "fractions",
            iconName: "profile",
            roles: ["Admin", "Moderator"]
          }
        },

        // fractions create
        {
          path: "/fractions/create",
          name: "fraction-create",
          component: () =>
            /* webpackChunkName: "fractions-create" */
            import("./views/fractions/create"),
          meta: {
            parent: "fractions",
            roles: ["Admin", "Moderator"]
          }
        },

        // fractions detail
        {
          path: "/fractions/:id",
          name: "fraction-detail",
          component: () =>
            /* webpackChunkName: "fractions-detail" */
            import("./views/fractions/detail"),
          meta: {
            parent: "fractions",
            roles: ["Admin", "Moderator"]
          }
        },

        // committees
        {
          path: "/committees",
          name: "committees",
          component: () =>
            /* webpackChunkName: "committees" */
            import("./views/committees"),
          meta: {
            title: {
              uz: "Qo'mitalar",
              oz: "Қумиталари",
              ru: "Комитеты",
              en: "Committees"
            },

            dataUrl: "committees",
            iconName: "profile",
            roles: ["Admin", "Moderator"]
          }
        },

        // committees create
        {
          path: "/committees/create",
          name: "committee-create",
          component: () =>
            /* webpackChunkName: "committees-create" */
            import("./views/committees/create"),
          meta: {
            parent: "committees",
            roles: ["Admin", "Moderator"]
          }
        },

        // committees detail
        {
          path: "/committees/:id",
          name: "committee-detail",
          component: () =>
            /* webpackChunkName: "committees-detail" */
            import("./views/committees/detail"),
          meta: {
            parent: "committees",
            roles: ["Admin", "Moderator"]
          }
        },

        // commissions
        {
          path: "/commissions",
          name: "commissions",
          component: () =>
            /* webpackChunkName: "commissions" */
            import("./views/commissions"),
          meta: {
            title: {
              uz: "Komissiyalar",
              oz: "Комиссиялар",
              ru: "Комиссии",
              en: "Commissions"
            },

            dataUrl: "commissions",
            iconName: "profile",
            roles: ["Admin", "Moderator"]
          }
        },

        // commissions create
        {
          path: "/commissions/create",
          name: "commission-create",
          component: () =>
            /* webpackChunkName: "commissions-create" */
            import("./views/commissions/create"),
          meta: {
            parent: "commissions",
            roles: ["Admin", "Moderator"]
          }
        },

        // commissions detail
        {
          path: "/commissions/:id",
          name: "commission-detail",
          component: () =>
            /* webpackChunkName: "commissions-detail" */
            import("./views/commissions/detail"),
          meta: {
            parent: "commissions",
            roles: ["Admin", "Moderator"]
          }
        },

        // department
        // {
        //     path: "/department",
        //     name: "department",
        //     component: () =>
        //         /* webpackChunkName: "department" */
        //         import ("./views/department"),
        //     meta: {
        //         title: {
        //             uz: "Tuzulma",
        //             oz: "Тузулма",
        //             ru: "Подразделение",
        //             en: "Department"
        //         },

        //         dataUrl: "department",
        //         iconName: "cluster"
        //     }
        // },

        // department create
        // {
        //     path: "/department/create",
        //     name: "department-create",
        //     component: () =>
        //         /* webpackChunkName: "department-create" */
        //         import ("./views/department/detail"),
        //     meta: {
        //         parent: "department"
        //     }
        // },

        // department detail
        // {
        //     path: "/department/:id",
        //     name: "department-detail",
        //     component: () =>
        //         /* webpackChunkName: "department-detail" */
        //         import ("./views/department/detail"),
        //     meta: {
        //         parent: "department"
        //     }
        // },

        // galereya
        {
          path: "/gallery",
          name: "gallery",
          component: () =>
            /* webpackChunkName: "gallery" */
            import("./views/gallery"),
          meta: {
            title: {
              uz: "Galereya",
              oz: "Галерея",
              ru: "Галерея",
              en: "Gallery"
            },

            dataUrl: "gallery",
            iconName: "picture",
            roles: ["Admin", "Moderator"]
          }
        },

        // galereya create
        {
          path: "/gallery/create/:type",
          name: "gallery-create",
          component: () =>
            /* webpackChunkName: "gallery-type-create" */
            import("./views/gallery/detail"),
          meta: {
            parent: "gallery",
            roles: ["Admin", "Moderator"]
          }
        },

        // galereya detail
        {
          path: "/gallery/:id",
          name: "gallery-detail",
          component: () =>
            /* webpackChunkName: "gallery-detail" */
            import("./views/gallery/detail"),
          meta: {
            parent: "gallery",
            roles: ["Admin", "Moderator"]
          }
        },

        // contacts
        {
          path: "/contacts",
          name: "contacts",
          component: () =>
            /* webpackChunkName: "contacts" */
            import("./views/contacts"),
          meta: {
            title: {
              uz: "Bog'lanish",
              oz: "Боғланиш",
              ru: "Контакты",
              en: "Contacts"
            },

            dataUrl: "contacts",
            iconName: "contacts",
            roles: ["Admin", "Moderator"]
          }
        },

        // faq
        // {
        //   path: "/faq",
        //   name: "faq",
        //   component: () => /* webpackChunkName: "faq" */ import("./views/faq"),
        //   meta: {
        //     title: {
        //       uz: "Savol va javoblar",
        //       oz: "Савол ва жавоблар",
        //       ru: "Вопросы и ответы",
        //       en: "Questions and answers"
        //     },

        //     dataUrl: "faq",
        //     iconName: "question-circle"
        //   }
        // },

        // faq create
        {
          path: "/faq/create",
          name: "faq-create",
          component: () =>
            /* webpackChunkName: "faq" */
            import("./views/faq/detail"),
          meta: {
            parent: "faq",
            roles: ["Admin", "Moderator"]
          }
        },

        // faq detail
        {
          path: "/faq/:id",
          name: "faq-detail",
          component: () =>
            /* webpackChunkName: "faq" */
            import("./views/faq/detail"),
          meta: {
            parent: "faq",
            roles: ["Admin", "Moderator"]
          }
        },
        // image-storage
        // {
        //   path: "/image-storage",
        //   name: "image-storage",
        //   component: () =>
        //     /* webpackChunkName: "image-storage" */
        //     import("./views/image-storage"),
        //   meta: {
        //     title: {
        //       uz: "Rasmni saqlash",
        //       oz: "Расмни саклаш",
        //       ru: "Хранилище изображений",
        //       en: "Image store"
        //     },

        //     dataUrl: "image-storage",
        //     iconName: "file-image"
        //   }
        // },

        // interactive-services list
        {
          path: "/interactive-services",
          name: "interactiveServices",
          component: () =>
            /* webpackChunkName: "interactive-services" */
            import("./views/interactive-services"),
          meta: {
            title: {
              oz: "Интерактив хизматлар",
              uz: "Interaktiv xizmatlar",
              ru: "Интерактивные услуги",
              en: "Interactive services"
            },
            dataUrl: "interactive-services",
            iconName: "link",
            roles: ["Admin", "Moderator"]
          }
        },

        // interactive-services
        {
          path: "/interactive-services/:id",
          name: "interactiveServices-detail",
          component: () =>
            /* webpackChunkName: "interactive-services" */
            import("./views/interactive-services/interactive-services-detail"),
          meta: {
            parent: "interactiveServices",
            roles: ["Admin", "Moderator"]
          }
        },

        // interactive-services
        {
          path: "/interactive-services-create",
          name: "interactiveServices-create",
          component: () =>
            /* webpackChunkName: "interactive-services" */
            import("./views/interactive-services/interactive-services-create"),
          meta: {
            parent: "interactiveServices",
            roles: ["Admin", "Moderator"]
          }
        },

        // quiz
        {
          path: "/quiz",
          name: "quiz",
          component: () =>
            /* webpackChunkName: "quiz" */
            import("./views/quiz"),
          meta: {
            title: {
              uz: "So'rovnoma",
              oz: "Сўровнома",
              ru: "Опрос",
              en: "Survey"
            },
            dataUrl: "quiz",
            iconName: "check-circle",
            roles: ["Admin", "Moderator"]
          }
        },

        // quiz
        {
          path: "/quiz/:id",
          name: "quiz-detail",
          component: () =>
            /* webpackChunkName: "quiz" */
            import("./views/quiz/_id"),
          meta: {
            parent: "quiz",
            roles: ["Admin", "Moderator"]
          }
        },

        // quiz
        {
          path: "/quiz/create",
          name: "quiz-create",
          component: () => import("./views/quiz/create"),
          /* webpackChunkName: "quiz" */
          meta: {
            parent: "quiz",
            roles: ["Admin", "Moderator"]
          }
        },

        // usefull-links list
        {
          path: "/usefull-links",
          name: "usefullLinks",
          component: () =>
            /* webpackChunkName: "usefull-link" */
            import("./views/usefull-links"),
          meta: {
            title: {
              uz: "Foydali havolalar",
              oz: "Фойдали ҳаволалар",
              ru: "Полезные ссылки",
              en: "Useful links"
            },
            dataUrl: "usefull-links",
            iconName: "link",
            roles: ["Admin", "Moderator"]
          }
        },

        // usefull-link detail
        {
          path: "/usefull-links/:id",
          name: "usefullLinks-detail",
          component: () =>
            /* webpackChunkName: "usefull-link-detail" */
            import("./views/usefull-links/usefull-links-detail"),
          meta: {
            parent: "usefullLinks",
            roles: ["Admin", "Moderator"]
          }
        },

        // usefull-link create
        {
          path: "/usefull-links/create",
          name: "usefullLinks-create",
          component: () =>
            /* webpackChunkName: "usefull-link-create" */
            import("./views/usefull-links/usefull-links-create"),
          meta: {
            parent: "usefullLinks",
            roles: ["Admin", "Moderator"]
          }
        },
        {
          path: "/appeals",
          name: "appeals",
          component: () =>
            /* webpackChunkName: "fractions" */
            import("./views/appeals"),
          meta: {
            title: {
              uz: "Murojatlar",
              oz: "Мурожатлар",
              ru: "Обращения",
              en: "appeals"
            },

            dataUrl: "appeals",
            iconName: "profile",
            roles: ["AppealsInspector"]
          }
        },
        {
          path: "/appeals/:id",
          name: "appeals-detail",
          component: () =>
            /* webpackChunkName: "usefull-link-detail" */
            import("./views/appeals/appeals-detail"),
          meta: {
            parent: "appeals",
            roles: ["AppealsInspector"]
          }
        },
        {
          path: "/appeals/response/:id",
          name: "appeals-response",
          component: () =>
            /* webpackChunkName: "usefull-link-detail" */
            import("./views/appeals/appeals-response"),
          meta: {
            parent: "appeals",
            roles: ["AppealsInspector"]
          }
        },
        {
          path: "/okrug",
          name: "okrug",
          component: () =>
            /* webpackChunkName: "fractions" */
            import("./views/okrug"),
          meta: {
            title: {
              uz: "Okruglar",
              oz: "Округлар",
              ru: "Округ",
              en: "district"
            },

            dataUrl: "okrug",
            iconName: "profile",
            roles: ["Admin", "Moderator"]
          }
        },
        {
          path: "/okrug/create",
          name: "okrug-create",
          component: () =>
            import(
              /* webpackChunkName: "user-create" */
              "./views/okrug/create.vue"
            ),
          meta: {
            parent: "okrug",
            roles: ["Admin", "Moderator"]
          }
        },
        {
          path: "/okrug/:id",
          name: "okrug-detail",
          component: () =>
            import(
              /* webpackChunkName: "news-detail" */
              "./views/okrug/detail.vue"
            ),
          meta: {
            parent: "okrug",
            roles: ["Admin", "Moderator"]
          }
        },
        // SUBDIstricts

        {
          path: "/subdistrict",
          name: "subdistrict",
          component: () =>
            /* webpackChunkName: "fractions" */
            import("./views/subdistrict"),
          meta: {
            title: {
              uz: "Mahallalar",
              oz: "Махаллалар",
              ru: "Район",
              en: "Neighborhood"
            },

            dataUrl: "subdistrict",
            iconName: "profile",
            roles: ["Admin", "Moderator"]
          }
        },
        {
          path: "/subdistrict/create",
          name: "subdistrict-create",
          component: () =>
            import(
              /* webpackChunkName: "user-create" */
              "./views/subdistrict/create.vue"
            ),
          meta: {
            parent: "subdistrict",
            roles: ["Admin", "Moderator"]
          }
        },
        {
          path: "/subdistrict/:id",
          name: "subdistrict-detail",
          component: () =>
            import(
              /* webpackChunkName: "news-detail" */
              "./views/subdistrict/detail.vue"
            ),
          meta: {
            parent: "subdistrict",
            roles: ["Admin", "Moderator"]
          }
        },
        // Laws

        {
          path: "/laws",
          name: "laws",
          component: () =>
            /* webpackChunkName: "fractions" */
            import("./views/laws"),
          meta: {
            title: {
              uz: "Qonunlar",
              oz: "Конунлар",
              ru: "Законы",
              en: "Laws"
            },

            dataUrl: "laws",
            iconName: "profile",
            roles: ["Admin", "Moderator"]
          }
        },
        {
          path: "/laws/create",
          name: "laws-create",
          component: () =>
            import(
              /* webpackChunkName: "user-create" */
              "./views/laws/create.vue"
            ),
          meta: {
            parent: "laws",
            roles: ["Admin", "Moderator"]
          }
        },
        {
          path: "/laws/:id",
          name: "laws-detail",
          component: () =>
            import(
              /* webpackChunkName: "news-detail" */
              "./views/laws/detail.vue"
            ),
          meta: {
            parent: "laws",
            roles: ["Admin", "Moderator"]
          }
        },

        // liveStream
        {
          path: "/livestream",
          name: "livestream",
          component: () =>
            /* webpackChunkName: "usefull-link" */
            import("./views/livestream"),
          meta: {
            title: {
              uz: "Jonli efir",
              oz: "Жонли ефир",
              ru: "Прямой эфир",
              en: "Live broadcast"
            },
            dataUrl: "livestream",
            iconName: "link",
            roles: ["Admin", "Moderator"]
          }
        },

        // liveStream detail
        {
          path: "/livestream/:id",
          name: "livestream-detail",
          component: () =>
            /* webpackChunkName: "usefull-link-detail" */
            import("./views/livestream/detail"),
          meta: {
            parent: "livestream",
            roles: ["Admin", "Moderator"]
          }
        },

        // liveStream create
        {
          path: "/livestream/create",
          name: "livestream-create",
          component: () =>
            import(
              /* webpackChunkName: "user-create" */
              "./views/livestream/create.vue"
            ),
          meta: {
            parent: "livestream",
            roles: ["Admin", "Moderator"]
          }
        },
        // Comments
        {
          path: "/comments-posts",
          name: "comments-posts",
          component: () =>
            /* webpackChunkName: "usefull-link" */
            import("./views/comments-posts"),
          meta: {
            title: {
              uz: "Xabarlar uchun izohlar",
              oz: "Хабарлар учун изоҳлар",
              ru: "Комментарии постов",
              en: "Comments on posts"
            },
            dataUrl: "comments-posts",
            iconName: "message",
            roles: ["Admin", "Moderator"]
          }
        },
        // Comments
        {
          path: "/comments-laws",
          name: "comments-laws",
          component: () =>
            /* webpackChunkName: "usefull-link" */
            import("./views/comments-laws"),
          meta: {
            title: {
              uz: "Qonunlar Sharhlari",
              oz: "Қонунларга шарҳлар",
              ru: "Комментарии Законов",
              en: "Comments on Laws"
            },
            dataUrl: "comments-laws",
            iconName: "message",
            roles: ["Admin", "Moderator"]
          }
        },

        // friendship group
        {
          path: "/friendship",
          name: "friendship",
          component: () =>
            /* webpackChunkName: "commissions" */
            import("./views/friendship"),
          meta: {
            title: {
              uz: "Do'stlik guruxlari",
              oz: "Дўстлик гурухлари",
              ru: "Дружественные группы",
              en: "Friendly groups"
            },

            dataUrl: "friendship",
            iconName: "profile",
            roles: ["Admin", "Moderator"]
          }
        },

        // friendship group create
        {
          path: "/friendship/create",
          name: "friendship-create",
          component: () =>
            /* webpackChunkName: "commissions-create" */
            import("./views/friendship/create"),
          meta: {
            parent: "friendship",
            roles: ["Admin", "Moderator"]
          }
        },

        // friendship group detail
        {
          path: "/friendship/:id",
          name: "friendship-detail",
          component: () =>
            /* webpackChunkName: "commissions-detail" */
            import("./views/friendship/detail"),
          meta: {
            parent: "friendship",
            roles: ["Admin", "Moderator"]
          }
        },
        {
          path: "/mistakes",
          name: "mistakes",
          component: () =>
            /* webpackChunkName: "commissions" */
            import("./views/mistakes"),
          meta: {
            title: {
              uz: "Orfografik xato",
              oz: "Орфографик Хато",
              ru: "Орфографические ошибки",
              en: "mistakes"
            },
            roles: ["Admin", "Moderator"],
            dataUrl: "mistakes",
            iconName: "exclamation-circle"
          }
        },
        {
          path: "/podcasts",
          name: "podcasts",
          component: () =>
            /* webpackChunkName: "commissions" */
            import("./views/podcasts"),
          meta: {
            title: {
              uz: "podkastlar",
              oz: "Подкастлар",
              ru: "Подкасты",
              en: "podcasts"
            },
            roles: ["Admin", "Moderator"],

            dataUrl: "podcasts",
            iconName: "play-circle"
          }
        },
        {
          path: "/podcasts/create",
          name: "podcasts-create",
          component: () =>
            /* webpackChunkName: "commissions-create" */
            import("./views/podcasts/create"),
          meta: {
            parent: "podcasts",
            roles: ["Admin", "Moderator"]
          }
        },

        // friendship group detail
        {
          path: "/podcasts/:id",
          name: "podcasts-detail",
          component: () =>
            /* webpackChunkName: "commissions-detail" */
            import("./views/podcasts/detail"),
          meta: {
            parent: "podcasts",
            roles: ["Admin", "Moderator"]
          }
        },
        // friendship group
        {
          path: "/Legislative",
          name: "Legislative",
          component: () =>
            /* webpackChunkName: "commissions" */
            import("./views/Legislative"),
          meta: {
            title: {
              uz: "Qonunchilik Palatasi Devoni",
              oz: "Қонунчилик Палатаси Девони",
              ru: "Қонунчилик Палатаси Девони",
              en: "Office of the Legislative Chamber"
            },

            dataUrl: "Legislative",
            iconName: "file",
            roles: ["Admin", "Moderator"]
          }
        },

        // friendship group create
        {
          path: "/Legislative/create",
          name: "Legislative-create",
          component: () =>
            /* webpackChunkName: "commissions-create" */
            import("./views/Legislative/create"),
          meta: {
            parent: "Legislative",
            roles: ["Admin", "Moderator"]
          }
        },

        // friendship group detail
        {
          path: "/Legislative/:id",
          name: "Legislative-detail",
          component: () =>
            /* webpackChunkName: "commissions-detail" */
            import("./views/Legislative/detail"),
          meta: {
            parent: "Legislative",
            roles: ["Admin", "Moderator"]
          }
        },
        {
          path: "/Legislative/:id/persons",
          name: "Legislative-persons",
          component: () =>
            /* webpackChunkName: "commissions-detail" */
            import("./views/Legislative/persons"),
          meta: {
            parent: "Legislative",
            roles: ["Admin", "Moderator"]
          }
        },
        {
          path: "/Legislative/persons/create",
          name: "Legislative-persons-create",
          component: () =>
            /* webpackChunkName: "commissions-detail" */
            import("./views/Legislative/persons-create"),
          meta: {
            parent: "Legislative-persons",
            roles: ["Admin", "Moderator"]
          }
        },
        {
          path: "/Legislative/persons/detail:id",
          name: "Legislative-persons-detail",
          component: () =>
            /* webpackChunkName: "commissions-detail" */
            import("./views/Legislative/persons-detail"),
          meta: {
            parent: "Legislative-persons",
            roles: ["Admin", "Moderator"]
          }
        },
        {
          path: "/leadership",
          name: "leadership",
          component: () =>
            /* webpackChunkName: "commissions" */
            import("./views/leadership"),
          meta: {
            title: {
              oz: "Қонунчилик палатаси раҳбарияти",
              uz: "Qonunchilik palatasi rahbariyati",
              ru: "Законодательное руководство палаты",
              en: "Legislative palatasi leadership"
            },

            dataUrl: "leadership",
            iconName: "team",
            roles: ["Admin", "Moderator"]
          }
        },
        {
          path: "/Council",
          name: "Council",
          component: () =>
            /* webpackChunkName: "commissions" */
            import("./views/Council"),
          meta: {
            title: {
              oz: "Қонунчилик палатаси Kенгаши таркиби",
              uz: "Qonunchilik palatasi Kengashi tarkibi",
              ru: "Структура законодательного совета палаты",
              en: "Structure of the legislative palatasi Council"
            },

            dataUrl: "Council",
            iconName: "team",
            roles: ["Admin", "Moderator"]
          }
        }
      ]
    },
    {
      path: "/login",
      component: () =>
        import(/* webpackChunkName: "login" */ "./layouts/loginWindow")
    },
    {
      // Not Found
      path: "*",
      // redirect: '/',
      component: () =>
        import(/* webpackChunkName: "anypage" */ "./layouts/notFound")
    }
  ]
  // mode: 'history'
})
