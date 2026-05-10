import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpBackend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        supportedLngs: ['en', 'bn'],
        load: 'languageOnly', // maps 'en-US' → 'en' so the locale file is always found
        debug: import.meta.env.DEV,
        interpolation: {
            escapeValue: false,
        },
        backend: {
            loadPath: '/locales/{{lng}}.json',
        },
        detection: {
            order: ['localStorage', 'navigator'],
            cacheUserLanguage: true,
        },
        react: {
            useSuspense: false, // HttpBackend is async; avoid requiring a <Suspense> boundary
        },
    })

export default i18n