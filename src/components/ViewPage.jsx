import React from 'react'
import { Query } from 'react-apollo'
import { Skeleton } from 'antd'
import ButtonList from './ButtonList'
import LinkButton from './LinkButton'
import _ from 'lodash'
import CRUDContext from './CRUDContext'
import { withRouter } from 'react-router-dom'
import { withNamespaces } from '../i18n'

@withRouter
@withNamespaces()
export default class ViewPage extends React.Component {
  render () {
    return (
      <CRUDContext.Consumer>
        {({ fetchQuery, modelName, deleteRoute, editRoute, namePath }) => {
          return (
            <Query query={fetchQuery} variables={{ id: this.props.match.params.id }}>
              {({ data: { node = {} } = {}, loading, error }) => {
                if (loading || error) {
                  if (error) {
                    console.warn(error)
                  }
                  return <Skeleton active />
                } else {
                  const name = _.get(node, namePath)
                  const content = this.props.children({ node })
                  const deletePath = deleteRoute.replace(/:id/g, this.props.match.params.id)
                  const editPath = editRoute.replace(/:id/g, this.props.match.params.id)
                  return (
                    <React.Fragment>
                      <ButtonList style={{ float: 'right' }}>
                        <LinkButton path={editPath}>{this.props.t('ViewPage.edit')}</LinkButton>
                        <LinkButton path={deletePath}>{this.props.t('ViewPage.delete')}</LinkButton>
                      </ButtonList>
                      <h1>{name}</h1>
                      {content}
                    </React.Fragment>
                  )
                }
              }}
            </Query>
          )
        }}
      </CRUDContext.Consumer>
    )
  }
}
