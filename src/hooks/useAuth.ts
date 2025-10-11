// hooks/useAuth.ts
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useAuth(redirectTo: string = "/login") {
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push(redirectTo);
		}
	}, [status, router, redirectTo]);

	return { session, status };
}
