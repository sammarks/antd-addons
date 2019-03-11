# Internationalization

`react-antd-addons` uses [i18next](https://www.npmjs.com/package/i18next)
and its respective React plugins for internationalization. The configuration
can be found in `/src/i18n/index.js` if you are curious what configuration we
use.

The translations are embedded within each of the generated components as their
filesize is currently relatively small. This may change in the future.

## Custom Internationalization

Since we package `i18next` as a peer dependency, you can override the
`react-antd-addons` translations by providing your own.

The namespace this package is expecting is called `AntdAddons`, and when
overriding you must provide the following **at a minimum:**

```js
i18next.init({
  partialBundledLanguages: true,
  resources: require('react-antd-addons/translation').default
})
```

So if you're using your own resources and embedding them directly within the
package, you can do this:

```js
i18next.init({
  partialBundledLanguages: true,
  resources: {
    ...require('react-antd-addons/translation').default,
    en: {
      namespace: {
        key: 'item'
      }
    }
  }
})
```

{% hint style='info' %}
Keep in mind, you only need to add the custom configuration above if you
are overriding custom `AntdAddons` translations. If you only have translations
for your own application, you don't need to do anything as we will load
our own translations automatically if we detect an existing instance.
{% endhint %}
