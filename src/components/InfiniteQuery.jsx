import React from 'react'
import { Query } from '@apollo/client/react/components'
import PropTypes from 'prop-types'
import InfiniteList from './InfiniteList'
import ErrorIndicator from './ErrorIndicator'
import get from 'lodash/get'
import set from 'lodash/set'
import cloneDeep from 'lodash/cloneDeep'

const DEFAULT_TOTAL_COUNT = 1000
export default class InfiniteQuery extends React.Component {
  static propTypes = {
    query: PropTypes.object.isRequired,
    queryProps: PropTypes.object,
    variables: PropTypes.object,
    renderItem: PropTypes.func.isRequired,
    queryPath: PropTypes.string.isRequired,
    listProps: PropTypes.object,
    scrollProps: PropTypes.object,
    first: PropTypes.number,
    compact: PropTypes.bool,
    showNoMore: PropTypes.bool,
    useWindow: PropTypes.bool
  }

  static defaultProps = {
    first: 16,
    queryProps: {}
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (prevProps.variables !== this.props.variables) {
      this.refetch()
    }
  }

  renderItem = (edge) => {
    if (!edge.cursor) {
      const queryName = get(this, 'props.query.definitions[0].name.value', '(could not get name)')
      console.warn(`Edge does not contain a cursor! Infinite scrolling may not work in '${queryName}'`)
    }
    return this.props.renderItem(edge.node)
  }

  refetch = () => {
    if (this._refetch) {
      this._refetch()
    }
  }

  render () {
    return (
      <Query
        query={this.props.query}
        variables={{ ...this.props.variables, first: this.props.first }}
        notifyOnNetworkStatusChange
        {...this.props.queryProps}
      >
        {({ data, loading, error, fetchMore, refetch }) => {
          if (error) {
            console.error(error)
            return <ErrorIndicator compact={this.props.compact} />
          }
          this._refetch = refetch
          const query = get(data, this.props.queryPath, {})
          const edges = query.edges || []
          const totalRows = query.totalCount || DEFAULT_TOTAL_COUNT
          const list = <InfiniteList
            renderItem={this.renderItem}
            data={edges}
            loading={loading}
            listProps={this.props.listProps}
            scrollProps={this.props.scrollProps}
            hasMore={edges.length < totalRows}
            compact={this.props.compact}
            showNoMore={this.props.showNoMore}
            useWindow={this.props.useWindow}
            loadMore={() => {
              if (edges.length > 0) {
                return fetchMore({
                  variables: {
                    first: this.props.first,
                    after: edges[edges.length - 1].cursor,
                    ...this.props.variables
                  },
                  updateQuery: (previousResult, { fetchMoreResult }) => {
                    const connection = get(fetchMoreResult, this.props.queryPath)
                    const { edges: newEdges, pageInfo, totalCount } = connection
                    const result = cloneDeep(previousResult)
                    const previousResultQuery = get(previousResult, this.props.queryPath, {})
                    if (newEdges.length) {
                      set(result, this.props.queryPath, {
                        __typename: previousResultQuery.__typename,
                        edges: [...previousResultQuery.edges, ...newEdges],
                        pageInfo,
                        totalCount
                      })
                    } else {
                      set(result, this.props.queryPath, {
                        ...previousResultQuery,
                        totalCount: previousResultQuery.edges.length
                      })
                    }

                    return result
                  }
                })
              }
            }}
          />

          if (this.props.children) {
            return this.props.children({ data, loading, error, list })
          } else {
            return list
          }
        }}
      </Query>
    )
  }
}
