# DynamicCrumb

Helper component for the [CrumbRoute](CrumbRoute.md) and [CRUDContext.](../crud/CRUDContext.md)
Given a fetch query, the path to the name, and an ID of the current model, queries for the
name and displays it.

## Properties

- `fetchQuery` - The GraphQL query to get the object, takes `id` as a variable.
- `namePath` - The lodash path to the name to render.
- `id` - The ID to pass to the `fetchQuery`
