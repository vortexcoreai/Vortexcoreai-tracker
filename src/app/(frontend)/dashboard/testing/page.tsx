'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { clientApiFetch } from '@/lib/api-client'

export default function Page() {
  const { data: session } = useSession()
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (!session?.user?.token) return

    const fetchUser = async () => {
      try {
        const data = await clientApiFetch('/api/attendance?where[date][greater_than_equal]=2025-09-01&where[date][less_than_equal]=2025-09-31&limit=100&sort=date', session.user.token)
        setUser(data)
      } catch (err) {
        console.error('Error fetching user:', err)
      }
    }

    fetchUser()
  }, [session?.user?.token])

  return <div>{user ? <pre>{JSON.stringify(user, null, 2)}</pre> : <p>Loading user...</p>}</div>
}