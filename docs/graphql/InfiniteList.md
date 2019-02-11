# InfiniteList

This component is a wrapper around [react-infinite-scroller.](https://www.npmjs.com/package/react-infinite-scroller)
It uses the [List](../ant-extensions/List.md) component to render content and
supports calling a `loadMore` method to load more content when it is requested.

## Properties

- `data` - **required** - An array of objects to render in the list.
- `renderItem` - **required** - A function called to render a list item.
- Implement other props... 
