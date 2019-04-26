import React from 'react'
import PropTypes from 'prop-types'
import { Query as ApolloQuery } from 'react-apollo'
import omit from 'lodash/omit'
import { Icon, Spin } from 'antd'
import ErrorIndicator from './ErrorIndicator'

export default class Query extends React.Component {
  static propTypes = {
    loadingProps: PropTypes.object,
    errorCompact: PropTypes.bool,
    children: PropTypes.func.isRequired,
    onError: PropTypes.func,
    loading: PropTypes.element,
    forwardLoading: PropTypes.bool,
    error: PropTypes.element
  }

  static defaultProps = {
    loadingProps: {},
    errorCompact: false
  }

  render () {
    return (
      <ApolloQuery {...omit(this.props, Object.keys(Query.propTypes))}>
        {(queryResult) => {
          if (queryResult.loading && !this.props.forwardLoading) {
            if (this.props.loading !== undefined) {
              return this.props.loading
            } else {
              const icon = <Icon
                type={'loading'}
                style={{ fontSize: 24, margin: 30 }}
                spin
                {...this.props.loadingProps}
              />
              return (<Spin indicator={icon} />)
            }
          } else if (queryResult.data || (queryResult.loading && this.props.forwardLoading)) {
            return this.props.children(queryResult)
          } else if (queryResult.error) {
            console.warn('Query error', queryResult.error)
            if (this.props.onError) {
              this.props.onError(queryResult.error)
            }
            if (this.props.error !== undefined) {
              return this.props.error
            } else {
              return (<ErrorIndicator compact={this.props.errorCompact} />)
            }
          }
        }}
      </ApolloQuery>
    )
  }
}
