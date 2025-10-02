import { getServerSession } from 'next-auth'
import { getSession } from 'next-auth/react'
import { authOptions } from '@/lib/auth'

export async function apiFetchPost(path, data, options = {}) {
  let token

  if (typeof window === 'undefined') {
    const session = await getServerSession(authOptions)
    token = session?.user?.token
  } else {
    const session = await getSession()
    token = session?.user?.token
  }

  if (!token) {
    throw new Error('Unauthorized: No token found')
  }

  const res = await fetch(`http://localhost:3000/${path}`, {
    ...options,
    cache: 'no-store',
    method: 'POST',
    headers: {
      ...(options.headers || {}),
      Authorization: `JWT ${token}`,
      'Content-Type': options.headers?.['Content-Type'] || 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`API error: ${res.status} - ${errorText}`)
  }

  return res.json()
}
