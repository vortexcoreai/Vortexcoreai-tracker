import { CollectionConfig } from 'payload/types'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    // DONE
    read: ({ req }) => {
      const user = req.user
      if (!user) return false

      // DONE
      if (user.role === 'employee') {
        return { id: { equals: user.id } }
      }

      // DONE
      if (user.role === 'team_leader') {
        const teamId =
          user.team && typeof user.team === 'object' ? user.team.id || user.team : user.team

        if (!teamId) {
          return { id: { equals: user.id } }
        }

        return {
          and: [
            { role: { not_in: ['admin', 'hr'] } },
            {
              or: [{ id: { equals: user.id } }, { team: { equals: teamId } }],
            },
          ],
        }
      }

      // DONE
      if (user.role === 'hr') {
        return { role: { not_equals: 'admin' } }
      }

      // DONE
      if (user.role === 'admin') {
        return true
      }

      return false
    },

    // DONE
    update: ({ req, doc, data }) => {
      const user = req.user
      if (!user) return false

      if (user.role === 'employee') return false
      if (user.role === 'team_leader') return false

      if (user.role === 'hr') {
        if (doc?.role === 'admin') return false
        if (data?.role === 'admin') return false
        return true
      }

      if (user.role === 'admin') return true

      return false
    },

    // DONE
    create: ({ req, data }) => {
      const user = req.user
      if (!user) return false

      if (user.role === 'admin') return true
      if (user.role === 'hr') return data?.role !== 'admin'

      return false
    },

    // DONE
    delete: ({ req }) => {
      const user = req.user
      if (!user) return false
      return ['admin', 'hr'].includes(user.role)
    },
  },

  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      options: ['admin', 'hr', 'team_leader', 'employee'],
      defaultValue: 'employee',
    },
    {
      name: 'team',
      type: 'relationship',
      relationTo: 'teams',
    },
    {
      name: 'firstName',
      type: 'text',
    },
    {
      name: 'lastName',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'password',
      type: 'password',
      required: true,
    },
  ],
}
