import React from 'react'
import { Icon as LegacyIcon } from '@ant-design/compatible'
import { message, Button, Modal, Typography } from 'antd'
import { Mutation, Query } from '@apollo/client/react/components'
import _ from 'lodash'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import ButtonList from './ButtonList'
import CRUDContext from './CRUDContext'
import { withTranslation } from '../i18n'
import { Trans } from 'react-i18next'

@withTranslation()
class DeletePage extends React.Component {
  static propTypes = {
    additionalRefetchQueries: PropTypes.arrayOf(PropTypes.string.isRequired),
    idOverride: PropTypes.string,
    onDeleteCompleted: PropTypes.func,
    onModalClosed: PropTypes.func,
    isModal: PropTypes.bool,
    deleteQuery: PropTypes.object.isRequired,
    visible: PropTypes.bool
  }
  static defaultProps = {
    additionalRefetchQueries: []
  }
  render () {
    return (
      <CRUDContext.Consumer>
        {({ fetchQuery, modelName, namePath, listRoute, idParam }) => {
          const id = this.props.idOverride !== undefined ? this.props.idOverride : this.props.match.params[idParam]
          const refetchQueries = fetchQuery.definitions.map((def) => def.name.value)
          if (!id) return null
          return (
            <Query query={fetchQuery} variables={{ id: id }}>
              {({ data: { node = {} }, loading: fetchLoading }) => (
                <Mutation
                  mutation={this.props.deleteQuery}
                  onCompleted={(data) => {
                    message.success(
                      <Trans
                        i18nKey={'DeletePage.success'}
                        values={{
                          model: modelName,
                          name: _.get(node, namePath)
                        }}
                        t={this.props.t}
                      >
                        {modelName} <strong>{_.get(node, namePath)}</strong> deleted successfully.
                      </Trans>
                    )
                    let shouldRedirect = true
                    if (this.props.onDeleteCompleted && this.props.onDeleteCompleted(data) === false) {
                      shouldRedirect = false
                    }
                    if (shouldRedirect) {
                      this.props.history.push(listRoute)
                    }
                    if (this.props.onModalClosed) this.props.onModalClosed()
                  }}
                  onError={(data) => {
                    console.warn(data)
                    message.error(_.get(data, 'graphQLErrors[0].message',
                      this.props.t('DeletePage.error', { model: modelName })))
                  }}
                  refetchQueries={[...refetchQueries, ...this.props.additionalRefetchQueries]}
                >
                  {(deleteMutation, { loading }) => {
                    const nameInner = fetchLoading ? '...' : _.get(node, namePath)
                    const onCancel = (e) => {
                      if (e && e.preventDefault) {
                        e.preventDefault()
                      }
                      if (this.props.isModal) {
                        if (this.props.onModalClosed) this.props.onModalClosed()
                      } else {
                        this.props.history.push(listRoute)
                      }
                    }
                    const submit = () => {
                      deleteMutation({ variables: { id } })
                    }
                    if (this.props.isModal) {
                      return (
                        <Modal
                          visible={this.props.visible}
                          title={this.props.t('DeletePage.title', { model: modelName })}
                          onOk={submit}
                          onCancel={onCancel}
                          footer={[
                            <Button key={'cancel'} onClick={onCancel}>{this.props.t('DeletePage.cancel')}</Button>,
                            <Button key={'submit'} type={'danger'} loading={loading} onClick={submit} icon={<LegacyIcon type={'delete'} />}>
                              {this.props.t('DeletePage.delete')}
                            </Button>
                          ]}
                        >
                          <p>
                            <Trans i18nKey={'DeletePage.message'} t={this.props.t} values={{ name: nameInner, model: modelName }}>
                              Are you sure you want to delete the <strong>{nameInner}</strong> {modelName}?
                            </Trans>
                          </p>
                        </Modal>
                      )
                    } else {
                      return (
                        <React.Fragment>
                          <Typography.Title>{this.props.t('DeletePage.title', { model: modelName })}</Typography.Title>
                          <p>
                            <Trans i18nKey={'DeletePage.message'} t={this.props.t} values={{ name: nameInner, model: modelName }}>
                              Are you sure you want to delete the <strong>{nameInner}</strong> {modelName}?
                            </Trans>
                          </p>
                          <ButtonList>
                            <Button icon={<LegacyIcon type={'delete'} />} type={'danger'} loading={loading} onClick={submit}>
                              {this.props.t('DeletePage.delete')}
                            </Button>
                            <a onClick={onCancel}>{this.props.t('DeletePage.cancel')}</a>
                          </ButtonList>
                        </React.Fragment>
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

export { DeletePage }
export default withRouter(DeletePage)
