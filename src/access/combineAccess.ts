import type { Access } from "payload";

export const combineAccess =
	(...rules: Access[]): Access =>
	(args) => {
		for (const rule of rules) {
			const result = rule(args);

			if (result === true) return true;

			if (typeof result === "object" && result !== null) {
				return result;
			}
		}

		return false;
	};
