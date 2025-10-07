'use client'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useUserSession } from '@/hooks/useUserSession'
import { clientApiFetch } from '@/lib/api-client'
import { Tabs } from '@/components/ui/tabs'
import { AttendanceTable } from '@/components/tables/attendance-table'
import { CustomDropdown } from '@/components/customDropdown'
import { useQuery } from '@tanstack/react-query'

export default function Page() {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const tableHeaders = ['Date', 'Clock In', 'Clock Out', 'Status', 'Work Duration', 'Breaks', 'DWR']

  const userToken = useUserSession()
  const searchParams = useSearchParams()

  const year = Number(searchParams.get('year')) || new Date().getFullYear()
  const month = Number(searchParams.get('month')) || new Date().getMonth() + 1

  const { data, isLoading, error } = useQuery({
    queryKey: [year, month],
    queryFn: async () => {
      const res = await clientApiFetch(`/api/attendance?where[date][greater_than_equal]=${year}-${month}-01&where[date][less_than_equal]=${year}-${month}-31&limit=100&sort=date`, userToken)
      return res.docs || []
    },
    enabled: !!userToken,
  })

  return (
    <Tabs className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <CustomDropdown title="Months" data={months} params="month" />
      </div>

      <div className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border">
          {isLoading && <p className="p-4">Loading attendance...</p>}
          {error && <p className="p-4 text-red-500">Error loading attendance</p>}
          {data && <AttendanceTable tableHeader={tableHeaders} tableData={data} />}
        </div>
      </div>
    </Tabs>
  )
}
