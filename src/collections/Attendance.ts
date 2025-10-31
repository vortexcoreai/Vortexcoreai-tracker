import type { CollectionConfig } from "payload";
import { combineAccess } from "@/access/combineAccess";
import { isAdmin, isHr, isSelf, isTeamLeader } from "@/access/manageAccess";

export const Attendance: CollectionConfig = {
	slug: "attendance",
	admin: {
		useAsTitle: "date",
	},
	access: {
		read: combineAccess(isAdmin, isHr, isTeamLeader, isSelf),
		create: combineAccess(isAdmin, isHr, isSelf),
		update: combineAccess(isAdmin, isHr),
		delete: combineAccess(isAdmin, isHr),
	},
	fields: [
		{
			name: "user",
			type: "relationship",
			relationTo: "users",
			required: true,
			access: {
				update: () => false,
				read: () => true,
				create: () => true,
			},
			admin: {
				readOnly: true,
			},
		},
		{
			name: "date",
			type: "date",
			required: true,
		},
		{
			name: "clockIn",
			type: "date",
			required: true,
			admin: {
				date: { pickerAppearance: "timeOnly" },
			},
		},
		{
			name: "clockOut",
			type: "date",
			required: false,
			admin: {
				date: { pickerAppearance: "timeOnly" },
			},
		},
		{
			name: "status",
			type: "select",
			options: [
				{ label: "Present", value: "present" },
				{ label: "Absent", value: "absent" },
				{ label: "Half Day", value: "half-day" },
				{ label: "Leave", value: "leave" },
			],
		},
		{
			name: "workDuration",
			type: "number",
			required: false,
			admin: { description: "Total hours worked (auto or manual)" },
		},
		{
			name: "breaks",
			type: "array",
			label: "Breaks",
			required: false,
			fields: [
				{
					name: "breakStartTime",
					type: "number",
					label: "Break Start Time",
					required: false,
				},
				{
					name: "breakEndTime",
					type: "number",
					label: "Break End Time",
					required: false,
				},
				{
					name: "totalBreakTime",
					type: "number",
					label: "Total Break Time",
					required: false,
				},
			],
			admin: {
				description: "Total breaks",
			},
		},
		{
			name: "dwr",
			type: "textarea",
			required: false,
			admin: { description: "Daily Work Report" },
		},
		{
			name: "remarks",
			type: "textarea",
			required: false,
			admin: { description: "Manager or employee notes" },
		},
		{
			name: "approvedBy",
			type: "relationship",
			relationTo: "users",
			required: false,
			admin: { description: "Manager who approved this record" },
		},
	],
	hooks: {
		beforeChange: [
			({ data, req, operation }) => {
				if (operation === "create" && req.user) {
					data.user = req.user.id;
				}
				return data;
			},
		],
	},
};
