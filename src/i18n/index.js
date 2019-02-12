import i18n from 'i18next'
import { reactI18nextModule, withNamespaces as originalWithNamespaces } from 'react-i18next'

const resources = {
  en: { AntdAddons: require('./en.json') }
}

i18n
  .use(reactI18nextModule)
  .init({
    resources,
    ns: ['AntdAddons'],
    lng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
export const withNamespaces = originalWithNamespaces.bind(null, 'AntdAddons')
