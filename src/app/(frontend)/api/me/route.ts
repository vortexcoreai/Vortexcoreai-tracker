import { cookies } from "next/headers";

export async function GET() {
	const cookieStore = cookies();

	// Forward Payload auth cookie to Payload API
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,
		{
			headers: {
				Cookie: cookieStore.toString(), // attach cookies from request
			},
			cache: "no-store", // always fresh
		},
	);

	if (!res.ok) {
		return Response.json({ error: "Unauthorized" }, { status: res.status });
	}

	const user = await res.json();
	return Response.json(user);
}
