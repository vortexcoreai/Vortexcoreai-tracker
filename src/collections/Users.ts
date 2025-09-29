import { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },

  access: {
    read: ({ req }) => {
      const user = req.user
      if (!user) return false

      if (user.role === 'employee') {
        return { id: { equals: user.id } }
      }

      if (user.role === 'team_leader') {
        const teamId = user.team && typeof user.team === 'object' ? user.team.id || user.team : user.team

        if (!teamId) return { id: { equals: user.id } }

        return {
          and: [
            { role: { not_in: ['admin', 'hr'] } },
            {
              or: [{ id: { equals: user.id } }, { team: { equals: teamId } }],
            },
          ],
        }
      }

      if (user.role === 'hr') {
        return { role: { not_equals: 'admin' } }
      }

      if (user.role === 'admin') return true

      return false
    },

    update: ({ req, doc, data }) => {
      const user = req.user
      if (!user) return false

      if (user.role === 'employee') return false
      if (user.role === 'team_leader') return false

      if (user.role === 'hr') {
        if (doc?.role === 'admin' || data?.role === 'admin') return false
        return true
      }

      if (user.role === 'admin') return true
      return false
    },

    create: ({ req, data }) => {
      const user = req.user
      if (!user) return false

      if (user.role === 'admin') return true
      if (user.role === 'hr') return data?.role !== 'admin'

      return false
    },

    delete: ({ req }) => {
      const user = req.user
      if (!user) return false
      return ['admin', 'hr'].includes(user.role)
    },
  },

  fields: [
    // ----- Core Role + Team -----
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
      admin: {
        condition: (data) => data.role === 'employee' || data.role === 'team_leader',
      },
    },

    // ----- Personal Info -----
    { name: 'firstName', type: 'text', required: true },
    { name: 'lastName', type: 'text', required: false },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    // { name: 'password', type: 'password', required: true },
    { name: 'phone', type: 'text' },
    { name: 'address', type: 'text' },

    // ----- Job Info -----
    { name: 'employeeId', type: 'text', unique: true },
    {
      name: 'designation',
      type: 'relationship',
      relationTo: 'designations',
      required: false,
    },
    {
      name: 'department',
      type: 'relationship',
      relationTo: 'departments',
      required: false,
    },
    {
      name: 'dateOfJoining',
      type: 'date',
      required: false,
    },
    {
      name: 'status',
      type: 'select',
      options: ['active', 'inactive', 'terminated'],
      defaultValue: 'active',
    },
  ],
}
