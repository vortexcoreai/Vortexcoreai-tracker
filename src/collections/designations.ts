import { CollectionConfig } from 'payload/types'

export const Designations: CollectionConfig = {
  slug: 'designations',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true, // anyone can read (needed for dropdowns)
    create: ({ req }) => ['admin', 'hr'].includes(req.user?.role),
    update: ({ req }) => ['admin', 'hr'].includes(req.user?.role),
    delete: ({ req }) => ['admin', 'hr'].includes(req.user?.role),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
  ],
}
