import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function apiFetch(path: string, options: RequestInit = {}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.token) {
    throw new Error('Unauthorized: No token found')
  }

  const res = await fetch(`${process.env.PAYLOAD_URL}${path}`, {
    ...options,
    cache: 'no-store',
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
