// import { payloadRBAC } from '@teunmooij/payload-tools'
import { payloadRBAC } from 'payload-rbac'

export const RBAC = payloadRBAC({
  roles: ['admin', 'hr', 'team_leader', 'employee'],
  users: ['users'],
  defaultRole: 'employee',

  collections: [
    {
      slug: 'users',
      permissions: {
        read: {
          employee: ({ req }) => ({ id: { equals: req.user.id } }),

          team_leader: ({ req }) => {
            const teamId =
              req.user.team && typeof req.user.team === 'object'
                ? req.user.team.id || req.user.team
                : req.user.team

            if (!teamId) return { id: { equals: req.user.id } }

            return {
              and: [
                { role: { not_in: ['admin', 'hr'] } },
                {
                  or: [
                    { id: { equals: req.user.id } },
                    { team: { equals: teamId } },
                  ],
                },
              ],
            }
          },

          hr: { role: { not_equals: 'admin' } },
          admin: true,
        },

        create: {
          admin: true,
          hr: ({ data }) => data?.role !== 'admin',
        },

        update: {
          hr: ({ doc, data }) =>
            doc?.role !== 'admin' && data?.role !== 'admin',
          admin: true,
        },

        delete: {
          hr: true,
          admin: true,
        },
      },
    },
  ],
})
