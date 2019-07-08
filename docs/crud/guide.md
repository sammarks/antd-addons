# CRUD Components

The CRUD components are designed to make it very easy to spin up a flexible, stable,
CRUD interface for nodes. After following the guide and viewing the associated documentation,
you will be able to list, create, read, update, and delete a node with a GraphQL backend.

{% hint style='warning' %}
The code in this set of components is _highly_ opinionated.
{% endhint %}

Start by creating the individual create, read, update, and delete pages. You can view the associated
documentation for those components to see an example.

- **Create** - [CreatePage](CreatePage.md)
- **Edit** - [EditPage](EditPage.md)
- **Delete** - [DeletePage](DeletePage.md)
- **View** - [ViewPage](ViewPage.md)

We tend to create a separate file for each of these components, and place them in the same directory
so all of the components associated with a specific node type are all in the same place.

Once you're finished creating those, move on to [create the List page.](DataTable.md)

Finally, you'll want to wrap things up with a [ModelCRUD component.](ModelCRUD.md) This component
will automatically create the associated routes (with optional breadcrumbs) for you.

Once that's complete, whenever you want a complete CRUD interface, all you have to do is just
include the root component that uses the `ModelCRUD` component, and everything should be there!
