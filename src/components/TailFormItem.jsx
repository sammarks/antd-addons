import React from 'react'
import { Form } from '@ant-design/compatible'

export default class TailFormItem extends React.Component {
  get tailFormItemLayout () {
    return {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 16, offset: 8 }
      }
    }
  }
  render () {
    return (<Form.Item {...this.tailFormItemLayout} {...this.props} />)
  }
}
