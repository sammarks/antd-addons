# Getting Started

To get started, first install the package using your favorite package
manager.

```sh
npm install react-antd-addons
yarn add react-antd-addons
```

Now, just start including whichever components you need in your project!
For example, if you wanted to use the `ErrorIndicator` component:

```jsx
import ErrorIndicator from 'react-antd-addons/ErrorIndicator'
import React from 'react'

export default class MyComponent extends React.Component {
  render () {
    return (<ErrorIndicator compact />)
  }
}
```
