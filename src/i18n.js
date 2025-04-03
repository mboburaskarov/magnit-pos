import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
// import translationEN from '../constants/locales/en/translation.json'
import translationRU from '../constants/locales/ru/translation.json'
import translationUZ from '../constants/locales/uz/translation.json'
// import translationKA from '../constants/locales/ka/translation.json'
// import translationKK from '../constants/locales/kk/translation.json'
import detector from 'i18next-browser-languagedetector'

const resources = {
  // en: {
  //   translation: translationEN,
  // },
  uz: {
    translation: translationUZ,
  },
  ru: {
    translation: translationRU,
  },
  // ka: {
  //   translation: translationKA,
  // },
  // kk: {
  //   translation: translationKK,
  // },
}

i18n
  .use(detector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: ['ru', 'uz'],
    lng: 'ru',
    keySeparator: '.', // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export default i18n
