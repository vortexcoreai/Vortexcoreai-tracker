import { CollectionConfig } from 'payload/types';

async function getTeamEmployeeIds(req: any, team: any) {
  if (!team) return [];

  const teamId = typeof team === 'object' ? team.id || team.value || null : team;
  if (!teamId) return [];

  const employees = await req.payload.find({
    collection: 'users',
    where: {
      and: [
        { team: { equals: teamId } },
        { role: { equals: 'employee' } },
      ],
    },
    limit: 1000,
  });

  return employees.docs.map((u: any) => u.id);
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
      admin: {
        readOnly: true, // employees cannot change this
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
    },
    {
      name: 'clockIn',
      type: 'time',
      required: true,
    },
    {
      name: 'clockOut',
      type: 'time',
      required: false,
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
        const user = req.user;
        if (user && user.role === 'employee') {
          data.user = user.id; // auto-assign logged-in employee
        }
        return data;
      },
    ],
  },
  access: {
    // READ access
    read: async ({ req }) => {
      const user = req.user;
      if (!user) return false;

      if (user.role === 'employee') {
        return { user: { equals: user.id } }; // only own records
      }

      if (user.role === 'team_leader') {
        const teamEmployees = await getTeamEmployeeIds(req, user.team);
        return { user: { in: teamEmployees } }; // only team members
      }

      if (user.role === 'admin') return true; // all records

      return false;
    },

    // CREATE access
    create: ({ req }) => {
      const user = req.user;
      if (!user) return false;

      return ['employee', 'admin'].includes(user.role); // only employee or admin
    },

    // UPDATE access
    update: async ({ req, doc }) => {
      const user = req.user;
      if (!user || !doc) return false;

      if (user.role === 'employee') return false; // cannot update
      if (user.role === 'team_leader') return false; // read-only
      if (user.role === 'admin') return true; // admin full access

      return false;
    },

    // DELETE access
    delete: ({ req }) => {
      const user = req.user;
      if (!user) return false;

      return user.role === 'admin'; // only admin
    },
  },
};
