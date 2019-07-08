# CreatePage

The `CreatePage` component is responsible for handling the submission, loading, and error
handling logic associated with creating a node.

## Properties

- `createQuery` - **required** - The query called whenever creating the resource. It is passed an `$input` variable.
- `refetchQueries` - An array of additional queries to refetch.
- `idPath` - **required** - The path in the `createQuery` to the resulting created node `id`
- `onCreateCompleted` - Called whenever the creation is completed. `onCreateCompleted(mutationData) -> Boolean`
  - If this returns false, the user will not be redirected to the `View` page for the node.
- `onModalClosed` - Callback whenever the modal needs to be closed (if rendering as a modal)
- `isModal` - Whether or not to render inside a modal instead of as its own page.
- `visible` - If `isModal` is true, whether or not the modal is visible.
- `beforeSubmit` - Callback allowing you to modify the payload before it is sent to the query. `beforeSubmit(payload) -> Object`
  - See below for an example of what payload looks like.
- `defaultValues` - Additional values you would like to add to the `input` object inside the payload.

### Payload Object

```json
{
  "variables": {
    "input": {
      "fieldA": "value",
      "fieldB": "value"
    }
  }
}
```

## Example

```jsx
import React from 'react'
import { Button, Row, Col, Typography, Input } from 'antd'
import { gql } from 'apollo-boost'
import { CreatePage, FormItem, TailFormItem } from 'react-antd-addons'

export const CreateQuery = gql`
  mutation createVersion ($input: VersionInput!) {
    createVersion (input: $input) {
      version {
        id
      }
    }
  }
`

export default class Create extends React.Component {
  render () {
    return (
      <CreatePage
        refetchQueries={['versions']}
        createQuery={CreateQuery}
        idPath={'createVersion.version.id'}
        {...this.props}
      >
        {({ loading, getFieldDecorator, isModal }) => (
          <React.Fragment>
            {isModal ? null : <Typography.Title>Create a Version</Typography.Title>}
            <Row>
              <Col xs={24} md={isModal ? 24 : 16} lg={isModal ? 24 : 8}>
                <FormItem label={'Name'}>
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: 'A name is required.' }]
                  })(<Input placeholder={'Test Version'} />)}
                </FormItem>
                <FormItem label={'Description'}>
                  {getFieldDecorator('description', {
                    rules: [{ required: true, message: 'A description is required.' }]
                  })(<Input placeholder={'Version Description'} />)}
                </FormItem>
                {isModal ? null : <TailFormItem>
                  <Button type={'primary'} htmlType={'submit'} icon={'plus'} loading={loading}>
                    Create Version
                  </Button>
                </TailFormItem>}
              </Col>
            </Row>
          </React.Fragment>
        )}
      </CreatePage>
    )
  }
}
```
