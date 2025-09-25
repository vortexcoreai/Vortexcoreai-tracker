import { CollectionConfig } from 'payload/types'
import payload from 'payload'

export const Leaves: CollectionConfig = {
  slug: 'leaves',
  admin: {
    useAsTitle: 'status',
  },
  access: {
    read: ({ req }) => {
      const user = req.user
      if (!user) return false

      switch (user.role) {
        case 'employee':
          return { user: { equals: user.id } }
        case 'team_leader':
          return {
            or: [{ user: { equals: user.id } }, { user: { team: { equals: user.team } } }],
          }
        case 'hr':
        case 'admin':
          return true
      }
    },
    update: ({ req }) => {
      const user = req.user
      if (!user) return false

      if (user.role === 'employee') return { user: { equals: user.id }, status: { equals: 'pending' } }
      if (user.role === 'team_leader') return { user: { team: { equals: user.team } } }
      if (['hr', 'admin'].includes(user.role)) return true
      return false
    },
    create: ({ req }) => !!req.user,
    delete: ({ req }) => ['hr', 'admin'].includes(req.user?.role),
  },
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (!req.user) return data

        // Auto-assign next approver based on hierarchy
        if (data.status === 'pending' && req.user.role === 'employee') {
          const tl = await payload.findOne({
            collection: 'users',
            where: { team: { equals: req.user.team }, role: { equals: 'team_leader' } },
          })
          data.approvedBy = tl?.id
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'from',
      type: 'date',
      required: true,
    },
    {
      name: 'to',
      type: 'date',
      required: true,
    },
    {
      name: 'reason',
      type: 'textarea',
    },
    {
      name: 'status',
      type: 'select',
      options: ['pending', 'approved', 'rejected'],
      defaultValue: 'pending',
    },
    {
      name: 'approvedBy',
      type: 'relationship',
      relationTo: 'users',
    },
  ],
}
