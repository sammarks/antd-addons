import React from 'react'
import { Query } from 'react-apollo'
import PropTypes from 'prop-types'
import _ from 'lodash'

export default class DynamicCrumb extends React.Component {
  static propTypes = {
    fetchQuery: PropTypes.object.isRequired,
    namePath: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
  }

  get name () {
    return this.props.fetchQuery.definitions[0].name.value
  }

  render () {
    return (
      <Query query={this.props.fetchQuery} variables={{ id: this.props.id }} key={this.name}>
        {({ data: { node = {} } = {}, loading }) => {
          if (loading) {
            return <span>...</span>
          } else {
            return <span>{_.get(node, this.props.namePath)}</span>
          }
        }}
      </Query>
    )
  }
}
