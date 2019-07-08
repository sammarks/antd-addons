# DeletePage

The `DeletePage` component is responsible for handling the submission, loading, and error
handling logic associated with deleting a node.

## Properties

- `deleteQuery` - **required** - The query to call when deleting the node.
- `additionalRefetchQueries` - An array of queries to refetch once the delete is complete.
- `idOverride` - If you want to manually specify the ID instead of having it pulled from the URL, do that here.
- `onDeleteCompleted` - Callback when the deletion is completed. `onDeleteCompleted(data) -> Boolean`
  - If this returns false, we will not automatically redirect back to the list page.
- `isModal` - Boolean indicating if the delete page should be displayed in a modal.
  - `onModalClosed` - Callback called whenever the modal should close.
  - `visible` - Whether or not the modal is visible.

## Example

```jsx
import React from 'react'
import { DeletePage } from 'react-antd-addons'
import { gql } from 'apollo-boost'

const DeleteQuery = gql`
  mutation delete($id: ID!) {
    deleteNode(id: $id) {
      id
    }
  }
`

export default class Delete extends React.Component {
  render () {
    return (
      <DeletePage
        additionalRefetchQueries={['versions']}
        deleteQuery={DeleteQuery}
        {...this.props}
      />
    )
  }
}
```
