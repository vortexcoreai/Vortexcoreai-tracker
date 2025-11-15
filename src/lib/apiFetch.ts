import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function apiFetch(path, options = {}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.token) {
    redirect("/login");
  }

  const res = await fetch(`${process.env.PAYLOAD_URL}${path}`, {
    ...options,
    cache: "no-store",
    headers: {
      ...(options.headers || {}),
      Authorization: `JWT ${session.user.token}`,
      "Content-Type": "application/json",
    },
  });

  if (res.status === 401 || res.status === 403) {
    redirect("/login");
  }

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}
