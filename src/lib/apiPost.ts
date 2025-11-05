import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { authOptions } from "@/lib/auth";

export async function apiPost(path, data, options = {}, method = "POST") {
	let token: string | undefined;

	if (typeof window === "undefined") {
		const session = await getServerSession(authOptions);
		token = session?.user?.token;
	} else {
		const session = await getSession();
		token = session?.user?.token;
	}

	if (!token) {
		throw new Error("Unauthorized: No token found");
	}

	const res = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}${path}`, {
		...options,
		cache: "no-store",
		method,
		headers: {
			...(options.headers || {}),
			Authorization: `JWT ${token}`,
			"Content-Type": options.headers?.["Content-Type"] || "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		const errorText = await res.text();
		throw new Error(`API error: ${res.status} - ${errorText}`);
	}

	return res.json();
}
