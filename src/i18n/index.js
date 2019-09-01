import i18n from 'i18next'
import { initReactI18next, withTranslation as originalWithTranslation } from 'react-i18next'
import resources from '../components/translation'

if (i18n.isInitialized) {
  console.info('AntAddons is adding its i18n resource bundle because we ' +
    'detect an existing instance.')
  i18n.addResourceBundle('en', 'AntdAddons', resources.en.AntdAddons, true, true)
} else {
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
}

export default i18n
export const withTranslation = originalWithTranslation.bind(null, 'AntdAddons')
