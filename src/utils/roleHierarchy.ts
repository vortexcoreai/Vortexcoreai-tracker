export const roleHierarchy = ["employee", "team_leader", "hr", "admin"];

export function canManageRole(currentUserRole: string, targetRole: string) {
	return (
		roleHierarchy.indexOf(targetRole) < roleHierarchy.indexOf(currentUserRole)
	);
}
