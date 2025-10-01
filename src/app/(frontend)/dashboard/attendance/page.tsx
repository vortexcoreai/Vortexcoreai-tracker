'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { clientApiFetch } from '@/lib/api-client'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { AttendanceTable } from '@/components/attendance-table'
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, ColumnsIcon } from 'lucide-react'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tabs } from '@/components/ui/tabs'

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function Page() {
  const { data: session } = useSession()
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const year = Number(searchParams.get('year')) || new Date().getFullYear()
  const month = Number(searchParams.get('month')) || new Date().getMonth() + 1

  const handleChange = (newMonth: number, newYear: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('month', newMonth.toString())
    params.set('year', newYear.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  const handlePrevYear = () => {
    handleChange(month, year - 1)
  }

  const handleNextYear = () => {
    handleChange(month, year + 1)
  }

  useEffect(() => {
    if (!session?.user?.token) return

    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await clientApiFetch(`/api/attendance?where[date][greater_than_equal]=${year}-${month}-01&where[date][less_than_equal]=${year}-${month}-31&limit=100&sort=date`, session.user.token)
        setData(res.docs || [])
      } catch (err) {
        console.error('Error fetching attendance:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session?.user?.token, year, month])

  return (
    <Tabs className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <ColumnsIcon />
              <span className="hidden lg:inline">Filter By Months</span>
              <ChevronDownIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {months.map((m, i) => (
              <DropdownMenuCheckboxItem key={i} checked={month === i + 1} onCheckedChange={() => handleChange(i + 1, year)}>
                {m}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Attendance table */}
      <div className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border">{loading ? <p className="p-4">Loading attendance...</p> : <AttendanceTable initialData={data} />}</div>
      </div>

      {/* Year pagination footer */}
      <div className="flex items-center justify-between">
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            {months[month - 1]} {year}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button variant="outline" className="size-8" size="icon" onClick={handlePrevYear}>
              <ChevronLeftIcon />
            </Button>
            <Button variant="outline" className="size-8" size="icon" onClick={handleNextYear}>
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
      </div>
    </Tabs>
  )
}
