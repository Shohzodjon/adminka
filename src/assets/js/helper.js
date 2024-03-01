import Vue from "vue"
import debounce from "lodash/debounce"
import router from "@/router"

const rus =
    "а б в г д е з и й к л м н о п р с т у ф х ь ў қ ғ ҳ ш ч ц ю я ё ж ъ".split(
        / +/g
    )
const eng =
    "a b v g d e z i y k l m n o p r s t u f x ` o' q g' h sh ch ts yu ya yo j '".split(
        / +/g
    )

const htmlTextParseRegex = /(<([^>]+)>)/gi

const slugRegex = /^[a-zA-Z\\-]*$/

window.$langPrefix = "oz"

export const tokenKey = "token"

export const APP_PREFIX =
    process.env.NODE_ENV === "production" ? process.env.VUE_APP_PREFIX : ""

export const modules = {
    filesUrl: (process.env.VUE_APP_BASE_URL || "https://iiv.uz") + "/file/",
    // filesUrl: 'https://iiv.uz/file/',
    resOK(arg) {
        return arg && arg.status && arg.status >= 200 && arg.status < 300
    },
    get isDev() {
        return process.env.NODE_ENV == "development"
    },
    get isProduction() {
        return process.env.NODE_ENV == "production"
    },
    get userGroups() {
        return [{
                id: 1,
                title: {
                    uz: "Administrator",
                    oz: "Администратор",
                    ru: "Администратор",
                    en: "Administrator"
                }
            }
            // {
            //   id: 2,
            //   title: {
            //     uz: "Moderator",
            //     oz: "Модератор",
            //     ru: "Модератор",
            //     en: "Moderator"
            //   }
            // }
        ]
    },
    get videoUploaadTypes() {
        return [{
                id: 3,
                title: {
                    uz: "Youtube",
                    oz: "Youtube",
                    ru: "Youtube",
                    en: "Youtube"
                },
                html(video_code) {
                    return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${video_code}" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
                },
                code: "https://www.youtube.com/embed/"
            },
            {
                id: 4,
                title: {
                    uz: "Mover",
                    oz: "Mover",
                    ru: "Mover",
                    en: "Mover"
                },
                html(video_code) {
                    return `<iframe width="640" height="360" src="https://mover.uz/video/embed/${video_code}/" frameborder="0" allowfullscreen></iframe>`
                },
                code: "https://mover.uz/video/embed/"
            },
            {
                id: 1,
                title: {
                    uz: "Serverga yuklash",
                    oz: "Серверга юклаш",
                    ru: "Загрузка на сервер",
                    en: "Upload to server"
                }
            }
        ]
    },
    get langKeys() {
        return {
            uz: "",
            oz: "",
            ru: "",
            en: ""
        }
    },

    get shortDayName() {
        return {
            1: {
                uz: "Du.",
                oz: "Ду.",
                ru: "Пн.",
                en: "Mo."
            },

            2: {
                uz: "Se.",
                oz: "Се.",
                ru: "Вт.",
                en: "Tu."
            },

            3: {
                uz: "Cho.",
                oz: "Чо.",
                ru: "Ср.",
                en: "We."
            },

            4: {
                uz: "Pa.",
                oz: "Па.",
                ru: "Чт.",
                en: "Th."
            },

            5: {
                uz: "Ju.",
                oz: "Жу.",
                ru: "Пт.",
                en: "Fr."
            },

            6: {
                uz: "Sha.",
                oz: "Ша.",
                ru: "Сб.",
                en: "Sa."
            },

            7: {
                uz: "Yak.",
                oz: "Як.",
                ru: "Вс.",
                en: "Su."
            }
        }
    },

    defaultTabPageSize: { defaultPageSize: 10 },
    dataToForm(fields) {
        let formData = new FormData()

        for (let key in fields) {
            if (fields[key] !== undefined) {
                formData.append(key, fields[key])
            }
        }

        return formData
    },
    tinyVueMceConf: {
        theme: "modern",
        fontsize_formats: "8px 10px 12px 14px 16px 18px 20px 22px 24px 26px 39px 34px 38px 42px 48px",
        plugins: "print preview fullpage powerpaste searchreplace autolink",
        toolbar1: "formatselect fontsizeselect | bold italic strikethrough forecolor backcolor link"
    },
    tinymce: {
        default: {
            props: {
                language_url: APP_PREFIX + "/_assets/tinymce/langs/ru.js",
                language: "ru",
                height: 450,
                skin: false,
                plugins: [
                    "preview advlist autolink lists link image charmap print preview",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code wordcount"
                ],

                fontsize_formats: "8px 10px 12px 14px 16px 18px 24px 36px 40px 72px",
                toolbar1: "undo redo | preview fullscreen | formatselect | fontsizeselect | bold italic underline forecolor",
                toolbar2: "storage-btn image link table spoiler-btn | insertfile code | hr alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat",

                contextmenu: "link table configurepermanentpen",
                content_css: false,
                // toolbar_mode: "sliding",
                // fixed_toolbar_container: "",
                // quickbars_insert_toolbar: false,

                menubar: false,
                // relative_urls: false,

                paste_as_text: false,
                branding: false,

                skin_url: APP_PREFIX + "/_assets/tinymce/skins/ui/oxide",
                skin: "silver",

                content_css: [
                    APP_PREFIX + "/_assets/tinymce/skins/ui/oxide/content.min.css",
                    APP_PREFIX + "/_assets/tinymce/skins/content/default/content.min.css"
                ],

                external_plugins: {
                    advlist: APP_PREFIX + "/_assets/tinymce/plugins/advlist/plugin.min.js",
                    autolink: APP_PREFIX + "/_assets/tinymce/plugins/autolink/plugin.min.js",
                    charmap: APP_PREFIX + "/_assets/tinymce/plugins/charmap/plugin.min.js",
                    code: APP_PREFIX + "/_assets/tinymce/plugins/code/plugin.min.js",
                    fullscreen: APP_PREFIX + "/_assets/tinymce/plugins/fullscreen/plugin.min.js",
                    image: APP_PREFIX + "/_assets/tinymce/plugins/image/plugin.min.js",
                    insertdatetime: APP_PREFIX +
                        "/_assets/tinymce/plugins/insertdatetime/plugin.min.js",
                    link: APP_PREFIX + "/_assets/tinymce/plugins/link/plugin.min.js",
                    lists: APP_PREFIX + "/_assets/tinymce/plugins/lists/plugin.min.js",
                    media: APP_PREFIX + "/_assets/tinymce/plugins/media/plugin.min.js",
                    paste: APP_PREFIX + "/_assets/tinymce/plugins/paste/plugin.min.js",
                    preview: APP_PREFIX + "/_assets/tinymce/plugins/preview/plugin.min.js",
                    print: APP_PREFIX + "/_assets/tinymce/plugins/print/plugin.min.js",
                    save: APP_PREFIX + "/_assets/tinymce/plugins/save/plugin.min.js",
                    searchreplace: APP_PREFIX + "/_assets/tinymce/plugins/searchreplace/plugin.min.js",
                    table: APP_PREFIX + "/_assets/tinymce/plugins/table/plugin.min.js",
                    template: APP_PREFIX + "/_assets/tinymce/plugins/template/plugin.min.js",
                    // textcolor:
                    //   APP_PREFIX + "/_assets/tinymce/plugins/textcolor/plugin.min.js",
                    visualblocks: APP_PREFIX + "/_assets/tinymce/plugins/visualblocks/plugin.min.js",
                    wordcount: APP_PREFIX + "/_assets/tinymce/plugins/wordcount/plugin.min.js"
                }
            },

            token: "3myux81vzip0v5yxik8wex3sk4vgt37xuna840e8nzco3rs5"
        }
    },

    // onSlugChange(e) {
    //   const text = (
    //     (e.target.value || "")
    //       .replace(/( )/gi, "-")
    //       .toLowerCase()
    //       .replace(/[^a-zA-Z0-9\-]/gi, "")
    //   )
    //
    //
    //   this.slugCheck({ table: 'post', slug: text })
    //
    //   return text
    // },

    slugCompute(e, langPostFix, checkKey, formKeys) {
        let slugText = ""
        if ([$langPrefix, "uz"].includes(langPostFix)) {
            slugText =
                formKeys && langPostFix == $langPrefix ?
                this.toLatin(formKeys[$langPrefix]) :
                (formKeys && formKeys.uz) || ""
        } else if (
            langPostFix == "ru" &&
            formKeys &&
            !formKeys.uz &&
            !formKeys.oz
        ) {
            slugText = this.toLatin(formKeys.ru)
        }

        if (slugText) {
            this.slugCheck({
                table: checkKey,
                slug: slugText
            })

            this.$emit("update:slug", {
                target: {
                    value: slugText || ""
                }
            })
        }
    },
    slugActionRegex(arg) {
        if (arg == "") {
            return true
        }
        return arg && slugRegex.test(arg) ? true : -1
    },
    slugCheck: debounce(async function(payload) {
        // https://iiv-api.mdg.uz/api/v1/news/post/check-slug?table=category&slug=mezhdunarodnoe-sotrudnichestvo
        const cres = await this.$api
            .get("/news/post/check-slug", {
                params: payload
            })
            .then((res) => {
                const r = res.status >= 200 && res.status < 300
                this.$emit("slug-check-result", r)

                return r
            })
            .catch((err) => {
                console.log(err)
                return false
            })

        if (this.errors) {
            this.errors.slug = !cres
        }

        // console.log('cres', cres);
        return cres
    }, 600),
    strToObj(str) {
        if (str && str.title) {
            const nStrObj = JSON.parse(str.title)
            return { oz: "", ...nStrObj }.ru
        }

        return ""
    },

    filterOption(input, option) {
        return (
            option.componentOptions.children[0].text
            .toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
        )
    },

    servertimeToDatepicker(timeStr) {
        if (timeStr) {
            const [year, month, day] = timeStr.slice(0, 10).split("-")
            return [day, month, year].join("-")
        }
    },

    reverseDate(timeStr) {
        if (timeStr) {
            const [year, month, day] = timeStr.slice(0, 10).split("-")
            return [year, month, day].join("-")
        }
    },

    get dragOptions() {
        return {
            animation: 1,
            group: "description",
            disabled: false,
            ghostClass: "ghost"
        }
    },

    formItemSpan() {
        return {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 }
        }
    },
    translit(str) {
        if (!str) return ""
        let space = "-"
        str = str.toLowerCase()
        let transl = {
            а: "a",
            б: "b",
            в: "v",
            г: "g",
            д: "d",
            е: "e",
            ё: "e",
            ж: "zh",
            з: "z",
            и: "i",
            й: "j",
            к: "k",
            л: "l",
            м: "m",
            н: "n",
            о: "o",
            п: "p",
            р: "r",
            с: "s",
            т: "t",
            у: "u",
            ф: "f",
            х: "h",
            ц: "c",
            ч: "ch",
            ш: "sh",
            щ: "sh",
            ъ: "~",
            ы: "y",
            ь: "~",
            э: "e",
            ю: "yu",
            я: "ya"
        }

        let link = ""

        for (let i = 0; i < str.length; i++) {
            if (/[а-яё]/.test(str.charAt(i))) {
                //если текущий символ - русская буква, то меняем его
                link += transl[str.charAt(i)]
            } else if (/[a-z0-9]/.test(str.charAt(i))) {
                link += str.charAt(i) //если текущий символ - английская буква или цифра, то оставляем как есть
            } else {
                if (link.slice(-1) !== space) link += space // если не то и не другое то вставляем space
            }
        }
        return link.replace(/~/g, "")
    },
    sortPostion(arr) {
        return (
                (arr.categories &&
                    arr.categories.slice(0).sort((a, b) => a.position - b.position)) || []
            )
            // return arr && arr.category.sort((a, b) => a.position - b.position)
    },
    linkDrag(arg) {
        const menuMain = document.querySelectorAll(".side-route")
        const sideActiveLine = document.querySelector(".side-active-line")

        // console.log('sideActiveLine', sideActiveLine)
        Array.from(menuMain).forEach((liItem) => {
            // console.log('iteration', liItem.dataset.url)
            if (
                arg.path.slice(1) == liItem.dataset.url ||
                (arg.meta && liItem.dataset.url == arg.meta.parent)
            ) {
                // const td = `transition-duration: ${((index + 0.3) / 60).toFixed(2)}s`;
                // console.log(td);
                sideActiveLine.style = `top: ${liItem.offsetTop + 1}px; height: ${
          liItem.offsetHeight
        }px; opacity: 1;`
            }
            // debugger
        })
    },
    get h_sideBarRoutes() {
        const r = router.options.routes[0].children
            .filter((item) => item.meta && item.meta.title)
            .map((item) => {
                // skip component key
                // eslint-disable-next-line no-unused-vars
                const { component, ...props } = item
                return {
                    ...props
                }
            })

        let newRoutes = {}

        Object.values(r).forEach((item) => (newRoutes[item.path.slice(1)] = item))
        return newRoutes
    },

    checkIsLetterMany(str) {
        if (str.length > 1) {
            return str[0].toUpperCase() + str.slice(1)
        }
        return str.toUpperCase()
    },

    transliterate(text, engToRus) {
        let x

        text = text.replace(/(э)/gi, "e")
        for (x = 0; x < rus.length; x++) {
            text = text
                .split(engToRus ? eng[x] : rus[x])
                .join(engToRus ? rus[x] : eng[x])
            text = text
                .split(
                    engToRus ?
                    this.checkIsLetterMany(eng[x]) :
                    this.checkIsLetterMany(rus[x])
                )
                .join(
                    engToRus ?
                    this.checkIsLetterMany(rus[x]) :
                    this.checkIsLetterMany(eng[x])
                )

            // debugger;
        }

        // console.log("text", text);

        return text
    },

    toLatin(args) {
        return this.transliterate(args)
    },
    toKirill(text) {
        if (!text) {
            return
        }

        let str = this.removeTags(text)
        str = t$.convert(str)
        return str
    },

    get wantedType() {
        return {
            wanted: {
                code: 1
            },
            missing: {
                code: 2
            }
        }
    },

    placeholders: {
        video_url: {
            uz: "Havolani kiriting, masalan https://www.youtube.com/watch?v=7kQlEdamRlAs",
            oz: "Ҳаволани киритинг, масалан https://www.youtube.com/watch?v=7kQlEdamRlAs",
            ru: "Введите ссылку, например https://www.youtube.com/watch?v=7kQlEdamRlAs",
            en: "Enter link, for example https://www.youtube.com/watch?v=7kQlEdamRlAs"
        }
    },

    removeTags(arg) {
        return (
            (arg &&
                arg
                .replace(htmlTextParseRegex, "")
                .replace(/(\\&.*?\\;)/gi, "")
                .replace(/&amp;nbsp;/gi, "")) ||
            ""
        )
    },

    isNumber(evt) {
        evt = evt ? evt : window.event
        let charCode = evt.which ? evt.which : evt.keyCode
            // console.log(charCode)
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            evt.preventDefault()
        } else {
            return true
        }
    },

    isTimeInput(evt) {
        evt = evt ? evt : window.event
        let charCode = evt.which ? evt.which : evt.keyCode
            // console.log(charCode);
        if (
            charCode > 31 &&
            (charCode < 48 || charCode > 57) &&
            charCode != 32 &&
            charCode != 58
        ) {
            evt.preventDefault()
        } else {
            return true
        }
    },

    $_toValidEmail(e) {
        // console.log('toValidEmail', e.target.value);
        return (
            e &&
            e.target &&
            e.target.value &&
            e.target.value.replace(/[^a-zA-Z0-9\\@\\.\\-]+/g, "")
        )
    },

    dataParse(arg) {
        const w = arg && JSON.parse(arg)

        if (w) {
            return {
                ...this.langKeys,
                ...w
            }
        }

        return {
            ...this.langKeys
        }
    },

    copyStringToClipboard(str) {
        // Create new element
        let el = document.createElement("textarea")
            // Set value (string to be copied)
        el.value = (str && str.toLowerCase()) || ""
            // Set non-editable to avoid focus and move outside of view
        el.setAttribute("readonly", "")
        el.style = { position: "absolute", left: "-9999px" }
        document.body.appendChild(el)
            // Select text inside element
        el.select()
            // Copy text to clipboard
        document.execCommand("copy")
            // Remove temporary element
        document.body.removeChild(el)
    },

    $_editorUpdloadHandler(arg, success, failure) {
        // console.log(arg)
        success(`data:${arg.blob().type};base64,${arg.base64()}`)

        failure()
    },

    urltoFile(url, filename, mimeType) {
        mimeType = mimeType || (url.match(/^data:([^;]+);/) || "")[1]
        return fetch(url)
            .then(function(res) {
                return res.arrayBuffer()
            })
            .then(function(buf) {
                return new File([buf], filename, { type: mimeType })
            })
    }
}

export const $_editorCustomButtons = (editor) => {
    let toDateHtml = function(date) {
        return (
            '<time datetime="' +
            date.toString() +
            '">' +
            date.toDateString() +
            "</time>"
        )
    }
    let toGmtHtml = function(date) {
        return (
            '<time datetime="' +
            date.toString() +
            '">' +
            date.toGMTString() +
            "</time>"
        )
    }
    let toIsoHtml = function(date) {
        return (
            '<time datetime="' +
            date.toString() +
            '">' +
            date.toISOString() +
            "</time>"
        )
    }

    /* Basic button that just inserts the date */
    editor.ui.registry.addButton("basicDateButton", {
        text: "Insert Date",
        tooltip: "Insert Current Date",
        onAction: function(_) {
            editor.insertContent(toDateHtml(new Date()))
        }
    })

    /* Basic button that inserts the date, but only if the cursor isn't currently in a "time" element */
    editor.ui.registry.addButton("selectiveDateButton", {
        icon: "insert-time",
        tooltip: "Insert Current Date",
        disabled: true,
        onAction: function(_) {
            editor.insertContent(toDateHtml(new Date()))
        },
        onSetup: function(buttonApi) {
            var editorEventCallback = function(eventApi) {
                buttonApi.setDisabled(
                    eventApi.element.nodeName.toLowerCase() === "time"
                )
            }
            editor.on("NodeChange", editorEventCallback)
            return function(buttonApi) {
                editor.off("NodeChange", editorEventCallback)
            }
        }
    })

    /* Toggle button that inserts the date, but becomes inactive when the cursor is in a "time" element */
    /* so you can't insert a "time" element inside another one. Also gives visual feedback. */
    editor.ui.registry.addToggleButton("toggleDateButton", {
        icon: "insert-time",
        tooltip: "Insert Current Date",
        onAction: function(_) {
            editor.insertContent(toDateHtml(new Date()))
        },
        onSetup: function(buttonApi) {
            var editorEventCallback = function(eventApi) {
                buttonApi.setActive(eventApi.element.nodeName.toLowerCase() === "time")
            }
            editor.on("NodeChange", editorEventCallback)
            return function(buttonApi) {
                editor.off("NodeChange", editorEventCallback)
            }
        }
    })

    /* Split button that lists 3 formats, and inserts the date in the selected format when clicked */
    editor.ui.registry.addSplitButton("splitDateButton", {
        text: "Insert Date",
        onAction: function(_) {
            editor.insertContent("<p>Its Friday!</p>")
        },
        onItemAction: function(buttonApi, value) {
            editor.insertContent(value)
        },
        fetch: function(callback) {
            var items = [{
                    type: "choiceitem",
                    text: "Insert Date",
                    value: toDateHtml(new Date())
                },
                {
                    type: "choiceitem",
                    text: "Insert GMT Date",
                    value: toGmtHtml(new Date())
                },
                {
                    type: "choiceitem",
                    text: "Insert ISO Date",
                    value: toIsoHtml(new Date())
                }
            ]
            callback(items)
        }
    })

    /* Menu button that has a simple "insert date" menu item, and a submenu containing other formats. */
    /* Clicking the first menu item or one of the submenu items inserts the date in the selected format. */
    editor.ui.registry.addMenuButton("menuDateButton", {
        text: "Date",
        fetch: function(callback) {
            var items = [{
                    type: "menuitem",
                    text: "Insert Date",
                    onAction: function(_) {
                        editor.insertContent(toDateHtml(new Date()))
                    }
                },
                {
                    type: "nestedmenuitem",
                    text: "Other formats",
                    getSubmenuItems: function() {
                        return [{
                                type: "menuitem",
                                text: "GMT",
                                onAction: function(_) {
                                    editor.insertContent(toGmtHtml(new Date()))
                                }
                            },
                            {
                                type: "menuitem",
                                text: "ISO",
                                onAction: function(_) {
                                    editor.insertContent(toIsoHtml(new Date()))
                                }
                            }
                        ]
                    }
                }
            ]
            callback(items)
        }
    })
}

for (let key in modules) {
    if (modules.hasOwnProperty(key)) {
        Vue.prototype[key] = modules[key]
    }
}

// Object.keys(Vue.prototype).map( item => console.log('prototype', item));