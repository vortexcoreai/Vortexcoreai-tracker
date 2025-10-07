'use client'

import { useSession } from 'next-auth/react'

export async function clientApiFetch(path, token, options = {}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}${path}`, {
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
