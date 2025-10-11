import type { CollectionConfig } from "payload";

export const Teams: CollectionConfig = {
	slug: "teams",
	admin: {
		useAsTitle: "name",
	},
	access: {
		// DONE
		read: ({ req }) => {
			const user = req.user;
			if (!user) return false;

			if (user.role === "employee") return false;

			if (user.role === "team_leader") {
				return { teamLeader: { equals: user.id } };
			}

			return true;
		},

		// DONE
		update: ({ req, doc }) => {
			const user = req.user;
			if (!user) return false;

			if (user.role === "team_leader") {
				if (!doc) return false;
				const leaderId =
					typeof doc.teamLeader === "object"
						? doc.teamLeader.id || doc.teamLeader.value
						: doc.teamLeader;

				return leaderId === user.id;
			}

			return ["hr", "admin"].includes(user.role);
		},

		// DONE
		create: ({ req }) => {
			const user = req.user;
			if (!user) return false;
			return ["hr", "admin"].includes(user.role);
		},

		// DONE
		delete: ({ req }) => {
			const user = req.user;
			return user && user.role === "admin";
		},
	},
	fields: [
		{
			name: "name",
			type: "text",
			required: true,
		},
		{
			name: "teamLeader",
			type: "relationship",
			relationTo: "users",
			required: true,
		},
		{
			name: "members",
			type: "relationship",
			relationTo: "users",
			hasMany: true,
		},
	],
};
