import { CollectionConfig } from 'payload'

export const Departments: CollectionConfig = {
  slug: 'departments',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true, // anyone can read
    create: ({ req }) => ['admin', 'hr'].includes(req.user?.role),
    update: ({ req }) => ['admin', 'hr'].includes(req.user?.role),
    delete: ({ req }) => ['admin', 'hr'].includes(req.user?.role),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
}
