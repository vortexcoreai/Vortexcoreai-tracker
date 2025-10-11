import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const body = await req.json();

	const res = await fetch(
		`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/login`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: body.email,
				password: body.password,
			}),
		},
	);

	const data = await res.json();

	if (!res.ok) {
		return NextResponse.json(
			{ error: data.message || "Login failed" },
			{ status: res.status },
		);
	}

	// Forward the payload-token cookie to the browser
	const payloadCookie = res.headers.get("set-cookie");

	const response = NextResponse.json({ user: data.user });

	if (payloadCookie) {
		response.headers.set("set-cookie", payloadCookie);
	}

	return response;
}
