import { type Access, AccessArgs } from "payload";

export const isAdmin: Access = ({ req: { user } }) => {
	return Boolean(user && user.role === "admin");
};

export const isHr: Access = ({ req: { user } }) => {
	return Boolean(user && user.role === "hr");
};

export const isTeamLeader: Access = ({ req: { user } }) => {
	return Boolean(user && user.role === "team_leader");
};

export const isSelf: Access = ({ req: { user } }) => {
	if (!user) return false;
	return {
		user: {
			equals: user.id,
		},
	};
};

export const isAdminOrSelf: Access = ({ req: { user } }) => {
	if (!user) return false;

	if (user.role === "admin") return true;

	return {
		user: {
			equals: user.id,
		},
	};
};

export const isHrAdminOrSelf: Access = ({ req: { user } }) => {
	if (!user) return false;
	if (user.role === "admin" || user.role === "hr") return true;

	return {
		user: {
			equals: user.id,
		},
	};
};
