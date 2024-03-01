import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from '@/lang/index.js'

Vue.use(VueI18n)

export const i18n = new VueI18n({
    locale: 'uz', // set locale
    fallbackLocale: 'oz',
    messages // set locale messages
})

const loadedLanguages = ['ru'] // our default language that is preloaded

function setI18nLanguage(lang) {
    i18n.locale = lang
    document.querySelector('html').setAttribute('lang', lang)
    return lang
}

export function loadLanguageAsync(lang) {
    return new Promise(resolve => {
        // If the same language
        if (i18n.locale === lang) {
            return resolve(setI18nLanguage(lang))
        }

        // If the language was already loaded
        if (loadedLanguages.includes(lang)) {
            return resolve(setI18nLanguage(lang))
        }
    })

    // If the language hasn't been loaded yet
    // return import(/* webpackChunkName: "lang-[request]" */ `@/i18n/messages/${lang}.js`).then(
    //     messages => {
    //         i18n.setLocaleMessage(lang, messages.default)
    //         loadedLanguages.push(lang)
    //         return setI18nLanguage(lang)
    //     }
    // )
}
// router.beforeEach((to, from, next) => {
//     const lang = to.params.lang
//     loadLanguageAsync(lang).then(() => next())
// })