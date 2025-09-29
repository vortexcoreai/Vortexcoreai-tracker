import { RBACConfig } from '@nouance/payload-simple-rbac'

export const rbac: RBACConfig = {
  roles: ['admin', 'hr', 'team_leader', 'employee'],
  auth: ['users'],
  defaultRole: 'employee',

  collections: {
    users: {
      read: {
        employee: ({ user }) => {
          console.log('RBAC check for employee', user?.id)
          return { id: { equals: user.id } }
        },
        team_leader: ({ user }) => {
          if (!user.team) return { id: { equals: user.id } }
          return {
            or: [
              { id: { equals: user.id } }, // themselves
              {
                and: [{ role: { in: ['employee', 'team_leader'] } }, { team: { equals: user.team } }],
              },
            ],
          }
        },
        hr: () => ({ role: { not_equals: 'admin' } }),
        admin: true,
        // 🚨 explicitly deny everyone else
        $default: false,
      },
      create: {
        admin: true,
        hr: ({ data }) => data?.role !== 'admin',
        $default: false,
      },
      update: {
        admin: true,
        hr: ({ doc, data }) => doc?.role !== 'admin' && data?.role !== 'admin',
        $default: false,
      },
      delete: {
        admin: true,
        hr: true,
        $default: false,
      },
    },

    attendance: {
      read: {
        employee: ({ user }) => ({ user: { equals: user.id } }),
        team_leader: async ({ user, req }) => {
          if (!user.team) return false

          const employees = await req.payload.find({
            collection: 'users',
            where: {
              and: [{ team: { equals: user.team } }, { role: { equals: 'employee' } }],
            },
            limit: 1000,
          })

          return { user: { in: employees.docs.map((u: any) => u.id) } }
        },
        admin: true,
        $default: false,
      },
      create: {
        employee: true,
        admin: true,
        $default: false,
      },
      update: {
        admin: true,
        $default: false,
      },
      delete: {
        admin: true,
        $default: false,
      },
    },
  },
}
