import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import { Skeleton, Typography } from 'antd'
import ButtonList from './ButtonList'
import LinkButton from './LinkButton'
import _ from 'lodash'
import CRUDContext from './CRUDContext'
import { withRouter } from 'react-router-dom'
import { withNamespaces } from '../i18n'

@withRouter
@withNamespaces()
export default class ViewPage extends React.Component {
  static propTypes = {
    hideDelete: PropTypes.bool,
    hideEdit: PropTypes.bool,
    hideHeader: PropTypes.bool
  }

  render () {
    return (
      <CRUDContext.Consumer>
        {({ fetchQuery, modelName, deleteRoute, editRoute, namePath, idParam }) => {
          return (
            <Query query={fetchQuery} variables={{ id: this.props.match.params[idParam] }}>
              {({ data: { node = {} } = {}, loading, error }) => {
                if (loading || error) {
                  if (error) {
                    console.warn(error)
                  }
                  return <Skeleton active />
                } else {
                  const name = _.get(node, namePath)
                  const content = this.props.children({ node })
                  const idRegex = new RegExp(`:${idParam}`, 'g')
                  const deletePath = deleteRoute.replace(idRegex, this.props.match.params[idParam])
                  const editPath = editRoute.replace(idRegex, this.props.match.params[idParam])
                  return (
                    <React.Fragment>
                      {!this.props.hideHeader && (!this.props.hideDelete || !this.props.hideEdit) &&
                        <ButtonList style={{ float: 'right' }}>
                          <LinkButton path={editPath}>{this.props.t('ViewPage.edit')}</LinkButton>
                          <LinkButton path={deletePath}>{this.props.t('ViewPage.delete')}</LinkButton>
                        </ButtonList>
                      }
                      {!this.props.hideHeader && <Typography.Title>{name}</Typography.Title>}
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
