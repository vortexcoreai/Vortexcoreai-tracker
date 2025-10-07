import { useSession as useNextAuthSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useUserSession() {
  const { data: session, status } = useNextAuthSession()
  const router = useRouter()

  return session?.user?.token
}
