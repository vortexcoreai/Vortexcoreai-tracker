import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function apiDelete(path, options = {}) {
	const session = await getServerSession(authOptions);

	if (!session?.user?.token) {
		throw new Error("Unauthorized: No token found");
	}

	const res = await fetch(`${process.env.PAYLOAD_URL}${path}`, {
		...options,
		cache: "no-store",
		headers: {
			...(options.headers || {}),
			Authorization: `JWT ${session.user.token}`,
			"Content-Type": "application/json",
		},
		method: "DELETE",
	});

	if (!res.ok) {
		const errorText = await res.text();
		throw new Error(`API error ${res.status}: ${errorText}`);
	}

	try {
		return await res.json();
	} catch {
		return null;
	}
}
