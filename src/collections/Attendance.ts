import { CollectionConfig } from 'payload'

async function getTeamEmployeeIds(req: any, team: any) {
  if (!team) return []

  const teamId = typeof team === 'object' ? team.id || team.value || null : team
  if (!teamId) return []

  const employees = await req.payload.find({
    collection: 'users',
    where: {
      and: [{ team: { equals: teamId } }, { role: { equals: 'employee' } }],
    },
    limit: 1000,
  })

  return employees.docs.map((u: any) => u.id)
}

export const Attendance: CollectionConfig = {
  slug: 'attendance',
  admin: {
    useAsTitle: 'date',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: { readOnly: true }, // employees cannot change this
    },
    {
      name: 'date',
      type: 'date',
      required: true,
    },
    {
      name: 'clockIn',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'timeOnly' },
      },
    },
    {
      name: 'clockOut',
      type: 'date',
      required: false,
      admin: {
        date: { pickerAppearance: 'timeOnly' },
      },
    },
    {
      name: 'status',
      type: 'select',
      options: ['present', 'absent', 'half-day', 'leave'],
      required: true,
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        const user = req.user
        if (user && user.role === 'employee') {
          data.user = user.id // auto-assign logged-in employee
        }
        return data
      },
    ],
  },
  access: {
    // READ access
    read: async ({ req }) => {
      const user = req.user
      if (!user) return false

      if (user.role === 'employee') {
        return { user: { equals: user.id } } // only own records
      }

      if (user.role === 'team_leader') {
        const teamEmployees = await getTeamEmployeeIds(req, user.team)
        return { user: { in: teamEmployees } } // only team members
      }

      if (user.role === 'admin') return true // full access

      return false
    },

    // CREATE access
    create: ({ req }) => {
      const user = req.user
      if (!user) return false
      return ['employee', 'admin'].includes(user.role)
    },

    // UPDATE access
    update: async ({ req, id }) => {
      const user = req.user
      if (!user) return false

      if (!id) {
        // no document id provided, deny update
        return false
      }

      const attendanceDoc = await req.payload.findByID({
        collection: 'attendance',
        id: String(id), // make sure it's a string
      })

      if (user.role === 'employee') return false // cannot update
      if (user.role === 'team_leader') return false // read-only
      if (user.role === 'admin') return true // full access

      return false
    },
    // DELETE access
    delete: ({ req }) => {
      const user = req.user
      if (!user) return false
      return user.role === 'admin'
    },
  },
}
