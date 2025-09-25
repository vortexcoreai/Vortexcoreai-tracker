import { Button } from '@/components/ui/button'
import { Edit, Settings } from 'lucide-react'

export default function Page() {
  return (
    <>
      <div id="account-container">
        <div className="container mx-auto px-4 py-6 md:px-6 2xl:max-w-[1400px]">
          <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <div className="flex gap-2">
              <Button>
                <Edit className="w-4" />
                Edit Profile
              </Button>
              <Button>
                <Settings className="w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
