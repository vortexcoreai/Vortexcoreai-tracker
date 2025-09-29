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
      admin: { readOnly: true },
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
      options: [
        { label: 'Present', value: 'present' },
        { label: 'Absent', value: 'absent' },
        { label: 'Half Day', value: 'half-day' },
        { label: 'Leave', value: 'leave' },
      ],
      required: true,
    },
    {
      name: 'workDuration',
      type: 'number',
      required: false,
      admin: { description: 'Total hours worked (auto or manual)' },
    },
    {
      name: 'dwr',
      type: 'textarea',
      required: false,
      admin: { description: 'Daily Work Report' },
    },
    {
      name: 'overtimeHours',
      type: 'number',
      required: false,
      admin: { description: 'Overtime in hours' },
    },
    {
      name: 'remarks',
      type: 'textarea',
      required: false,
      admin: { description: 'Manager or employee notes' },
    },
    {
      name: 'approvedBy',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      admin: { description: 'Manager who approved this record' },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        const user = req.user
        if (!user) return data
        if (user.role === 'employee') {
          data.user = user.id
        }
        if (user.role === 'admin' && !data.user) {
          throw new Error('Admin must specify a user when creating attendance.')
        }

        return data
      },
    ],
  },
  access: {
    read: async ({ req }) => {
      const user = req.user
      if (!user) return false

      if (user.role === 'employee') {
        return { user: { equals: user.id } }
      }

      if (user.role === 'team_leader') {
        const teamEmployees = await getTeamEmployeeIds(req, user.team)
        return { user: { in: teamEmployees } }
      }

      if (user.role === 'admin') return true

      return false
    },
    create: ({ req }) => {
      const user = req.user
      if (!user) return false
      return ['employee', 'admin'].includes(user.role)
    },
    update: async ({ req, id }) => {
      const user = req.user
      if (!user) return false

      if (!id) {
        return false
      }

      const attendanceDoc = await req.payload.findByID({
        collection: 'attendance',
        id: String(id),
      })

      if (user.role === 'employee') return false
      if (user.role === 'team_leader') return false
      if (user.role === 'admin') return true

      return false
    },
    delete: ({ req }) => {
      const user = req.user
      if (!user) return false
      return user.role === 'admin'
    },
  },
}
