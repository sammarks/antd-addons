import React from 'react'
import { Form, message, Modal, Button } from 'antd'
import { Mutation, Query } from '@apollo/client/react/components'
import _ from 'lodash'
import { withRouter } from 'react-router-dom'
import CRUDContext from './CRUDContext'
import PropTypes from 'prop-types'
import { withTranslation } from '../i18n'

@withTranslation()
class EditPage extends React.Component {
  static propTypes = {
    editQuery: PropTypes.object.isRequired,
    additionalRefetchQueries: PropTypes.arrayOf(PropTypes.string.isRequired),
    idPath: PropTypes.string.isRequired,
    idOverride: PropTypes.string,
    onEditCompleted: PropTypes.func,
    onModalClosed: PropTypes.func,
    beforeSubmit: PropTypes.func,
    isModal: PropTypes.bool,
    visible: PropTypes.bool
  }
  static defaultProps = {
    additionalRefetchQueries: []
  }
  render () {
    return (
      <CRUDContext.Consumer>
        {(context) => {
          const { fetchQuery, modelName, viewRoute, idParam } = context
          const id = this.props.idOverride !== undefined ? this.props.idOverride : this.props.match.params[idParam]
          const refetchQueries = fetchQuery.definitions.map((def) => def.name.value)
          if (!id) return null
          return (
            <Query query={fetchQuery} variables={{ id }}>
              {({ data: { node = {} } = {}, loading: fetchLoading }) => (
                <Mutation
                  mutation={this.props.editQuery}
                  onCompleted={(data) => {
                    message.success(this.props.t('EditPage.edited', { model: modelName }))
                    let shouldRedirect = true
                    data.id = _.get(data, this.props.idPath)
                    if (this.props.onEditCompleted) {
                      if (this.props.onEditCompleted(data) === false) {
                        shouldRedirect = false
                      }
                    }
                    if (shouldRedirect) {
                      const idRegex = new RegExp(`:${idParam}`, 'g')
                      this.props.history.push(viewRoute.replace(idRegex, data.id))
                    }
                    this.props.form.resetFields()
                    if (this.props.onModalClosed) this.props.onModalClosed()
                  }}
                  onError={(data) => {
                    console.warn(data)
                    message.error(_.get(data, 'graphQLErrors[0].message',
                      this.props.t('EditPage.error', { model: modelName })))
                  }}
                  refetchQueries={[...refetchQueries, ...this.props.additionalRefetchQueries]}
                >
                  {(edit, { loading }) => {
                    const formLoading = fetchLoading
                    const submitLoading = loading || fetchLoading
                    const getFieldDecorator = (field, opts, ...params) => {
                      return this.props.form.getFieldDecorator(field, {
                        initialValue: node[field],
                        ...opts
                      }, ...params)
                    }
                    const form = this.props.children({
                      formLoading,
                      submitLoading,
                      getFieldDecorator,
                      node,
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
                                id,
                                patch: _.pickBy(values, (value, key) => node[key] !== value)
                              }
                            }
                          }
                          if (this.props.beforeSubmit) {
                            payload = this.props.beforeSubmit(payload)
                          }
                          edit(payload)
                        }
                      })
                    }
                    if (this.props.isModal) {
                      const onCancel = () => {
                        this.props.form.resetFields()
                        if (this.props.onModalClosed) this.props.onModalClosed()
                      }
                      return (
                        <Modal
                          visible={this.props.visible}
                          title={this.props.t('EditPage.title', { model: modelName })}
                          onOk={submit}
                          onCancel={onCancel}
                          footer={[
                            <Button key={'cancel'} onClick={onCancel}>{this.props.t('EditPage.cancel')}</Button>,
                            <Button key={'submit'} type={'primary'} loading={loading} onClick={submit} icon={'check'}>
                              {this.props.t('EditPage.submit', { model: modelName })}
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
              )}
            </Query>
          )
        }}
      </CRUDContext.Consumer>
    )
  }
}

export { EditPage }
export default Form.create()(withRouter(EditPage))
