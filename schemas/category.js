import PreviewRef from '../components/PreviewRef'

export default {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    // This is where the magic happens 👇
    {
      name: 'refNum',
      description: 'test Saskia',
      type: 'number',
      inputComponent: PreviewRef,
      // I dont think we even need this but I am not willing to delete it yet 🫥
      options: {
        documentQuerySelection: `
        "numReferenced": count(*[_type == "post" && references(^._id)])`,
        reduceQueryResult: (queryResult) => {
          return [queryResult.numReferenced]
        },
      },
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
  ],
}
