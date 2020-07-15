# ModelCRUD

This component is responsible for creating the routes for the node's individual CRUD components.
It also automatically creates the `CRUDContext` and wraps the children in it.

## Properties

- `fetchQuery` - **required** - The query used to load an individual instance of the node.
- `modelName` - **required** - The human name of the model, used when presenting buttons and titles to the user.
- `namePath` - **required** - The path inside the `fetchQuery` to the name of the node.
- `create` - The create component. If not provided, a create route will not be added.
- `edit` - The edit component. If not provided, an edit route will not be added.
- `view` - The view component. If not provided, a view route will not be added.
- `list` - The list component. If not provided, a list route will not be added.
- `delete` - The delete component. If not provided, a delete route will not be added.
- `idParam` - The name of the ID parameter, used inside the routes. Defaults to "id"
- `childRoutes` - A function called when you want to add additional child routes (for a specific node).
- `routes` - A function called when you want to add additional routes (for no specific node).
- `useBreadcrumbs` - Whether or not to enable breadcrumbs with the [DynamicCrumb](./DynamicCrumb.md) component.
- `switchComponent` - The component to use for the react-router switch (defaults to the react-router `Switch`)
- `switchProps` - An object of additional properties to pass to the switch component.

## Example

This example will generate routes and a context only edit listing and viewing a node, and overrides
the `:id` param to be `:version` instead.

```jsx
import React from 'react'
import gql from 'graphql-tag'
import { ModelCRUD } from 'react-antd-addons'
import List from './List'
import View from './View'

export const FetchQuery = gql`
  query version ($id: ID!) {
    node (id: $id) {
      ...on Version {
        __typename
        id
        name
        description
        createdAt
        updatedAt
      }
    }
  }
`

export const basicContext = {
  namePath: 'name',
  modelName: 'Version',
  fetchQuery: FetchQuery
}

export default class Versions extends React.Component {
  render () {
    return (
      <ModelCRUD
        list={List}
        view={View}
        idParam={'version'}
        {...basicContext}
      />
    )
  }
}
```

If you wanted to add routes for the create, edit, and delete components, you would just provide them
to the `ModelCRUD` component, like so:

```jsx
<ModelCRUD
  list={List}
  view={View}
  create={Create}
  edit={Edit}
  delete={Delete}
  idParam={'version'}
  {...basicContext}
/>
```
