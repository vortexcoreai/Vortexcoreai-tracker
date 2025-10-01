import { useSession } from 'next-auth/react'

export function useApiFetch() {
  const { data: session } = useSession()

  async function apiFetch(path: string, options: RequestInit = {}) {
    if (!session?.user?.token) {
      throw new Error('Unauthorized: No token found')
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}${path}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `JWT ${session.user.token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`)
    }

    return res.json()
  }

  return { apiFetch }
}
