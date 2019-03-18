# CrumbRoute

This is a route with breadcrumb support, and is very similar to the `react-router-dom`
Route component.

## Properties

- `component` - The component to render (or you can pass a `render` property).
- `title` - The title of the route to display in the breadcrumb. This can
  optionally be a function with the signature `(routeProps) => Component`
- `icon` - An optional icon to display with the breadcrumb.
- `render` - You can use this to render instead of passing a component.
- Any additional properties are forwarded to the `Route` component.

## Examples

### A regular CrumbRoute

```jsx
<CrumbRoute path={'/login'} title={'Login'} component={Login} />
```

### Use with DynamicCrumb

See the source code for the `ModelCRUD` component.
