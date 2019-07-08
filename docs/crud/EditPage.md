# CreatePage

The `EditPage` component is responsible for handling the submission, loading, and error
handling logic associated with editing a node.

## Properties

- `editQuery` - **required** - The query called whenever creating the resource. It is passed an `$input` variable.
- `additionalRefetchQueries` - An array of additional queries to refetch.
- `idPath` - **required** - The path in the `createQuery` to the resulting created node `id`
- `idOverride` - If you want to manually specify the ID instead of having it pulled from the URL, do that here.
- `onEditCompleted` - Called whenever the edit is completed. `onEditCompleted(mutationData) -> Boolean`
  - If this returns false, the user will not be redirected to the `View` page for the node.
- `beforeSubmit` - Callback allowing you to modify the payload before it is sent to the query. `beforeSubmit(payload) -> Object`
- `isModal` - Whether or not to render inside a modal instead of as its own page.
  - `onModalClosed` - Callback whenever the modal needs to be closed (if rendering as a modal)
  - `visible` - If `isModal` is true, whether or not the modal is visible.
    - See below for an example of what payload looks like.

### Payload Object

```json
{
  "variables": {
    "input": {
      "id": "node-id",
      "patch": {
        "fieldA": "value",
        "fieldB": "value"
      }
    }
  }
}
```

### `getFieldDecorator` modifications

You'll notice in the example at the bottom of this screen that we are not providing the
`initialValue` field to `getFieldDecorator`. This is because if the field is _simple,_
the `EditPage` component will provide it automatically.

If the field is more complicated (for example, you might be pulling a name from a nested
entity, like editing a category name on a version), you can always override `initialValue`
yourself, just as you normally would, using the `node` variable provided inside the
render function.

## Example

```jsx
import React from 'react'
import { Button, Row, Col, Typography, Input } from 'antd'
import { gql } from 'apollo-boost'
import { EditPage, FormItem, TailFormItem } from 'react-antd-addons'
import PropTypes from 'prop-types'

export const EditQuery = gql`
  mutation updateVersion ($input: UpdateVersionInput!) {
    updateVersion (input: $input) {
      version {
        id
      }
    }
  }
`

export default class Edit extends React.Component {
  static propTypes = {
    id: PropTypes.string
  }

  render () {
    return (
      <EditPage
        additionalRefetchQueries={['versions']}
        editQuery={EditQuery}
        idPath={'updateVersion.version.id'}
        idOverride={this.props.id}
        {...this.props}
      >
        {({ formLoading, submitLoading, getFieldDecorator, isModal }) => (
          <React.Fragment>
            {isModal ? null : <Typography.Title>Edit Version</Typography.Title>}
            <Row>
              <Col xs={24} md={isModal ? 24 : 16} lg={isModal ? 24 : 8}>
                <FormItem label={'Name'}>
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: 'Name is required.' }]
                  })(<Input disabled={formLoading} placeholder={'Version Name'} />)}
                </FormItem>
                <FormItem label={'Description'}>
                  {getFieldDecorator('description', {
                    rules: [{ required: true, message: 'Description is required.' }]
                  })(<Input disabled={formLoading} placeholder={'Description!'} />)}
                </FormItem>
                {isModal ? null : <TailFormItem>
                  <Button type={'primary'} htmlType={'submit'} icon={'plus'} loading={submitLoading}>
                    Update Version
                  </Button>
                </TailFormItem>}
              </Col>
            </Row>
          </React.Fragment>
        )}
      </EditPage>
    )
  }
}
```
