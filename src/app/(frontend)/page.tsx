// import { headers as getHeaders } from 'next/headers.js'
// import { getPayload } from 'payload'
import React from 'react'
import { Button } from '@/components/ui/button'

// import config from '@/payload.config'
import './styles.css'

export default async function HomePage() {
  // const headers = await getHeaders()
  // const payloadConfig = await config
  // const payload = await getPayload({ config: payloadConfig })
  // const { user } = await payload.auth({ headers })

  return (
    <div className="bg-amber-400 text-rose-700 p-10">
      {/* {!user && <h1 className="bg-amber-400 text-rose-700 p-10">Welcome to your new project.</h1>}
      {user && <h1 className="bg-amber-400 text-rose-700 p-10">Welcome back, {user.email}</h1>} */}
      <Button variant="secondary" size="lg">Login</Button>
    </div>
  )
}