'use client'

import { useSession } from 'next-auth/react'

export async function clientApiFetch(path: string, token: string, options: RequestInit = {}) {
  const res = await fetch(`http://localhost:3000/${path}`, {
    ...options,
    cache: 'no-store',
    headers: {
      ...(options.headers || {}),
      Authorization: `JWT ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }

  return res.json()
}
