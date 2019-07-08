# ViewPage

The `ViewPage` component is responsible for handling the fetching and error logic associated with
viewing a node.

It basically is a simpler wrapper around a `Query` component from Apollo. It exposes the loaded
node through a render function through the `node` object.

It also adds a title to the page with the node's name inside of it (using `namePath` configured inside
the CRUD context), and adds edit and delete buttons if the context is configured with those.

## Example

```jsx
import React from 'react'
import { ViewPage } from 'react-antd-addons'

export default class View extends React.Component {
  render () {
    return (
      <ViewPage>
        {({ node }) => (
          <React.Fragment>
            <p>{node.name}</p>
            <p>{node.description}</p>
          </React.Fragment>
        )}
      </ViewPage>
    )
  }
}
```
