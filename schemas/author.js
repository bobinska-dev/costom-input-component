import TwitterUrl from "../components/TwitterUrl";

export default {
  name: 'author',
  title: 'Author',
  type: 'document',
  initialValue: {
    cool: false
  },

  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'cool',
      title: 'Is this author cool?',
      type: 'boolean'
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    },
    {
      name: 'twitter',
      title: 'TwitterUrl',
      type: 'url',
      inputComponent: TwitterUrl,
      options: {
        prepend: 'https://twitter.com/'
      }
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [
        {
          title: 'Block',
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
}
