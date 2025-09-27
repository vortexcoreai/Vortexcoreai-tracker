import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Edit, Settings, Mail, Star, Users } from 'lucide-react'

export default function Page() {
  return (
    <div id="account-container">
      <div className="container mx-auto px-4 py-6 md:px-6 2xl:max-w-[1400px]">
        {/* Header */}
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

        {/* Main Grid */}
        <div className="grid gap-6 md:grid-cols-4">
          {/* Sidebar Profile Card */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <span className="relative size-20 shrink-0 overflow-hidden rounded-full">
                    <Image className="aspect-square size-full" alt="User Avatar" src="https://github.com/shadcn.png" width={80} height={80} />
                  </span>
                  <h2 className="mt-4 text-lg font-semibold">John Doe</h2>
                  <p className="text-sm text-muted-foreground">Product Designer</p>
                  <span className="mt-2 w-fit rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">Pro Member</span>
                  <Button className="mt-4 w-full">
                    <Mail className="mr-2 size-4" />
                    Message
                  </Button>
                </div>

                {/* Info Section */}
                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member since</span>
                    <span>Jan 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last active</span>
                    <span>2 hours ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Role</span>
                    <span>Admin</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="space-y-6 md:col-span-3">
            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: <Star className="size-5 text-primary" />, value: '128', label: 'Projects Completed' },
                { icon: <Users className="size-5 text-primary" />, value: '8.5k', label: 'Team Members' },
                { icon: <Star className="size-5 text-primary" />, value: '99%', label: 'Satisfaction Rate' },
              ].map((stat, i) => (
                <Card key={i}>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="rounded-lg bg-primary/10 p-2">{stat.icon}</div>
                    <div>
                      <p className="text-2xl font-semibold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold">Recent Activity</h3>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-4 border-b pb-4 last:border-0">
                      <div className="rounded-full bg-muted p-2">
                        <Star className="size-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm">{`Completed project "Dashboard UI"`}</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
