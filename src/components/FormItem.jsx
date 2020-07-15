import React from 'react'
import { Form } from '@ant-design/compatible'

export default class FormItem extends React.Component {
  get formItemLayout () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }
  }
  render () {
    return (<Form.Item {...this.formItemLayout} {...this.props} />)
  }
}
