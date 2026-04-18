import i18n from 'i18next'
import {
    initReactI18next
} from 'react-i18next'
import HttpBackend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        supportedLngs: ['en', 'bn'],
        debug: import.meta.env.DEV,
        interpolation: {
            escapeValue: false, // React already handles XSS
        },
        backend: {
            loadPath: '/locales/{{lng}}.json',
        },
        detection: {
            order: ['localStorage', 'navigator'],
            cacheUserLanguage: true,
        },
    })

export default i18n