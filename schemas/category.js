import ComputedField from 'sanity-plugin-computed-field'
import CreateReferenceNumber from '../components/CreateReferenceNumber'
import getReferences from '../components/getReferences'

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
    // CreateReferenceNumber('hello', 'h3'),
    {
      name: 'refNum',
      description: 'test Saskia',
      type: 'number',
      inputComponent: getReferences,
      options: {
        documentQuerySelection: `
        "numReferenced": count(*[_type == "post" && references(^._id)])`,
        reduceQueryResult: (queryResult) => {
          return [queryResult.numReferenced]
        },
      },
    },
    {
      name: 'numReferenced',
      title: 'Number of references',
      description: 'Computed by number of this categories referenced',
      type: 'number',
      inputComponent: ComputedField,
      options: {
        documentQuerySelection: `
        "numReferenced": count(*[_type == "post" && references(^._id)])`,
        reduceQueryResult: (queryResult) => {
          return queryResult.numReferenced
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
