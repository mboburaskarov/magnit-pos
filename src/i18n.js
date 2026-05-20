import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import translationEN from '../constants/locales/en/translation.json'
import translationRU from '../constants/locales/ru/translation.json'
import translationUZ from '../constants/locales/uz/translation.json'
import detector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: translationEN,
  },
  uz: {
    translation: translationUZ,
  },
  ru: {
    translation: translationRU,
  },
}

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: ['ru', 'uz'],
    keySeparator: '.',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
