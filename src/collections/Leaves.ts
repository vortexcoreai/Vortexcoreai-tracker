import type { CollectionConfig } from "payload";
import { combineAccess } from "@/access/combineAccess";
import { isAdmin, isHr, isSelf, isTeamLeader } from "@/access/manageAccess";

export const Leaves: CollectionConfig = {
	slug: "leaves",
	access: {
		read: combineAccess(isAdmin, isHr, isTeamLeader, isSelf),
		create: combineAccess(isAdmin, isHr, isSelf),
		update: combineAccess(isAdmin, isHr),
		delete: combineAccess(isAdmin, isHr),
	},
	admin: {
		useAsTitle: "status",
	},
	fields: [
		{
			name: "user",
			type: "relationship",
			relationTo: "users",
			required: true,
		},
		{
			name: "from",
			type: "date",
			required: true,
		},
		{
			name: "to",
			type: "date",
			required: true,
		},
		{
			name: "reason",
			type: "textarea",
		},
		{
			name: "status",
			type: "select",
			options: ["pending", "approved", "rejected"],
			defaultValue: "pending",
		},
		{
			name: "approvedBy",
			type: "relationship",
			relationTo: "users",
		},
	],
};
