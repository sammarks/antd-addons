# InfiniteList

This component is a wrapper around [react-infinite-scroller.](https://www.npmjs.com/package/react-infinite-scroller)
It uses the [List](../ant-extensions/List.md) component to render content and
supports calling a `loadMore` method to load more content when it is requested.

{% hint style='info' %}
This is mostly an internal component, so it might seem confusing. Take a look
at the [InfiniteQuery component](InfiniteQuery.md) for a simpler example.
{% endhint %}

## Properties

- `data` - **required** - An array of objects to render in the list.
- `renderItem` - **required** - A function called to render a list item.
- `loadMore` - **required** - A function called whenever more items are requested.
- `loading` - A boolean indicating the current loading state of the Query.
- `hasMore` - A boolean indicating whether or not there are more results to load.
- `useWindow` - A boolean indicating if we should use the window for the scroll
  bounds, or the container.
- `listProps` - An object of properties to pass to the inner `<List>` component.
- `compact` - A boolean indicating if the list should be displayed compact.
- `showNoMore` - A boolean indicating if we should show a no more message.
