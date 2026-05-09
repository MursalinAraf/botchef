import '@testing-library/jest-dom'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../../public/locales/en.json'
import bn from '../../public/locales/bn.json'

// Initialise i18next once with real translations so all tests get actual text.
// initImmediate: false makes the init synchronous when resources are bundled.
i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: { translation: en },
    bn: { translation: bn },
  },
  interpolation: { escapeValue: false },
  initImmediate: false,
})
