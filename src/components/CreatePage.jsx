import React from 'react'
import { Form, message, Modal, Button } from 'antd'
import { Mutation } from 'react-apollo'
import _ from 'lodash'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import CRUDContext from './CRUDContext'
import { withTranslation } from '../i18n'

@withTranslation()
class CreatePage extends React.Component {
  static propTypes = {
    createQuery: PropTypes.object.isRequired,
    refetchQueries: PropTypes.arrayOf(PropTypes.string.isRequired),
    idPath: PropTypes.string.isRequired,
    onCreateCompleted: PropTypes.func,
    onModalClosed: PropTypes.func,
    isModal: PropTypes.bool,
    visible: PropTypes.bool,
    beforeSubmit: PropTypes.func,
    defaultValues: PropTypes.object
  }
  static defaultProps = {
    refetchQueries: [],
    defaultValues: {}
  }
  render () {
    return (
      <CRUDContext.Consumer>
        {({ modelName, viewRoute, idParam }) => {
          const getFieldDecorator = this.props.form.getFieldDecorator
          return (
            <Mutation
              mutation={this.props.createQuery}
              onCompleted={(data) => {
                message.success(this.props.t('CreatePage.created', { model: modelName }))
                let shouldRedirect = true
                data.id = _.get(data, this.props.idPath)
                if (this.props.onCreateCompleted) {
                  if (this.props.onCreateCompleted(data) === false) {
                    shouldRedirect = false
                  }
                }
                if (shouldRedirect) {
                  const idRegex = new RegExp(`:${idParam}`, 'g')
                  this.props.history.push(viewRoute.replace(idRegex, data.id))
                }
                this.props.form.resetFields()
                if (this.props.onModalClosed) {
                  this.props.onModalClosed()
                }
              }}
              onError={(data) => {
                console.warn(data)
                message.error(_.get(data, 'graphQLErrors[0].message',
                  this.props.t('CreatePage.error', { model: modelName })))
              }}
              refetchQueries={this.props.refetchQueries}
            >
              {(create, { loading }) => {
                const form = this.props.children({
                  loading,
                  getFieldDecorator,
                  isModal: this.props.isModal,
                  form: this.props.form
                })
                const submit = (e) => {
                  if (e && e.preventDefault) {
                    e.preventDefault()
                  }
                  this.props.form.validateFields((err, values) => {
                    if (!err) {
                      let payload = {
                        variables: {
                          input: {
                            ...this.props.defaultValues,
                            ...values
                          }
                        }
                      }
                      if (this.props.beforeSubmit) {
                        payload = this.props.beforeSubmit(payload)
                      }
                      create(payload)
                    }
                  })
                }
                if (this.props.isModal) {
                  const onCancel = () => {
                    this.props.form.resetFields()
                    if (this.props.onModalClosed) {
                      this.props.onModalClosed()
                    }
                  }
                  return (
                    <Modal
                      visible={this.props.visible}
                      title={this.props.t('CreatePage.title', { model: modelName })}
                      onOk={submit}
                      onCancel={onCancel}
                      footer={[
                        <Button key={'cancel'} onClick={onCancel}>{this.props.t('CreatePage.cancel')}</Button>,
                        <Button key={'submit'} type={'primary'} loading={loading} onClick={submit} icon={'plus'}>
                          {this.props.t('CreatePage.submit', { model: modelName })}
                        </Button>
                      ]}
                    >
                      <Form onSubmit={submit}>
                        {form}
                      </Form>
                    </Modal>
                  )
                } else {
                  return (
                    <Form onSubmit={submit}>
                      {form}
                    </Form>
                  )
                }
              }}
            </Mutation>
          )
        }}
      </CRUDContext.Consumer>
    )
  }
}

export { CreatePage }
export default Form.create()(withRouter(CreatePage))
