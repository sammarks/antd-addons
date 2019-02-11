import i18n from 'i18next'
import { initReactI18next, withTranslation as originalWithTranslation } from 'react-i18next'

const resources = {
  en: { AntdAddons: require('./en.json') }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    ns: ['AntdAddons'],
    lng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
export const withTranslation = originalWithTranslation.bind(null, 'AntdAddons')
