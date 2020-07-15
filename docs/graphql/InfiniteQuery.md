# InfiniteQuery

This component wraps the [InfiniteList component](InfiniteList.md) and provides
a simple interface for rendering an infinitely-scrollable list of results
from a GraphQL backend.

## Properties

- `query` - **required** - The GraphQL query to run.
- `variables` - An object of variables to pass to the query.
- `renderItem` - **required** - The function called to render each item.
- `queryPath` - **required** - The dot-separated path to the leaf containing
  the `edges`
- `listProps` - An object of properties to pass to the list.
- `first` - The number of items to fetch first. Defaults to 16.
- `compact` - See [InfiniteList](InfiniteList.md)
- `showNoMore` - See [InfiniteList](InfiniteList.md)
- `useWindow` - See [InfiniteList](InfiniteList.md)
- `scrollProps` - See [InfiniteList](InfiniteList.md)

## Notes

When providing the `query` parameter, it must have support for the following
variables, or the pagination will have no effect on your query:

- `first` - The _first_ number of results to collect. Based on GraphQL Relay.
- `after` - The cursor to fetch results after. Based on GraphQL Relay.

Any other variables you require in the query can be passed using the `variables`
property.

## Example

```jsx
import React from 'react'
import gql from 'graphql-tag'
import { List } from 'antd'
import InfiniteQuery from 'react-antd-addons/InfiniteQuery'

const FAQsQuery = gql`
  query FAQs ($first: Int = 10, $after: String) {
    faqs (first: $first, after: $after, orderBy: "weight", orderDirection: ASC) {
      edges {
        cursor
        node {
          name
          description
        }
      }
      totalCount
    }
  }
`

export default class FAQs extends React.Component {
  renderItem (item) {
    return (
      <List.Item>
        <h2>{item.name}</h2>
        <p>{item.description}</p>
      </List.Item>
    )
  }

  render () {
    return (
      <InfiniteQuery
        query={FAQsQuery}
        renderItem={this.renderItem}
        queryPath={'faqs'}
        showNoMore={false}
        listProps={{
          itemLayout: 'vertical',
          separated: false
        }}
      />
    )
  }
}
```
