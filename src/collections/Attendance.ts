import { CollectionConfig } from "payload/types";

async function getTeamEmployeeIds(req: any, team: any) {
  if (!team) return [];

  // normalize: team could be ID, object, or array
  const teamId =
    typeof team === "object"
      ? team.id || team.value || null
      : team;

  if (!teamId) return [];

  const employees = await req.payload.find({
    collection: "users",
    where: {
      and: [
        { team: { equals: teamId } },
        { role: { equals: "employee" } },
      ],
    },
    limit: 1000,
  });

  return employees.docs.map((u: any) => u.id);
}

export const Attendance: CollectionConfig = {
  slug: "attendance",
  admin: {
    useAsTitle: "date",
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "date",
      type: "date",
      required: true,
    },
    {
      name: "status",
      type: "select",
      options: ["present", "absent", "half-day", "leave"],
      required: true,
    },
  ],
  access: {
    read: async ({ req }) => {
      const user = req.user;
      if (!user) return false;

      if (user.role === "employee") {
        return { user: { equals: user.id } };
      }

      if (user.role === "team_leader") {
        const teamEmployees = await getTeamEmployeeIds(req, user.team);
        return {
          or: [
            { user: { equals: user.id } }, // own attendance
            { user: { in: teamEmployees } }, // employees in same team
          ],
        };
      }

      if (user.role === "hr" || user.role === "admin") return true;

      return false;
    },

    create: async ({ req, data }) => {
      const user = req.user;
      if (!user) return false;

      if (user.role === "employee") {
        return data?.user === user.id;
      }

      if (user.role === "team_leader") {
        const teamEmployees = await getTeamEmployeeIds(req, user.team);
        return data?.user === user.id || teamEmployees.includes(data?.user);
      }

      if (user.role === "hr" || user.role === "admin") return true;

      return false;
    },

    update: async ({ req, doc }) => {
      const user = req.user;
      if (!user || !doc) return false;

      if (user.role === "employee") {
        return false;
      }

      if (user.role === "team_leader") {
        if (doc.user === user.id) return false; // cannot update self
        const teamEmployees = await getTeamEmployeeIds(req, user.team);
        return teamEmployees.includes(doc.user as string);
      }

      if (user.role === "hr" || user.role === "admin") return true;

      return false;
    },

    delete: ({ req }) => {
      const user = req.user;
      if (!user) return false;
      return user.role === "admin";
    },
  },
};
