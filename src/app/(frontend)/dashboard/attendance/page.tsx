import { apiFetch } from '@/lib/api'
import { AttendanceTable } from '@/components/attendance-table'

export default async function Page({ searchParams }) {
  const year = Number(searchParams.year) || new Date().getFullYear()
  const month = Number(searchParams.month) || new Date().getMonth() + 1

  const data = await apiFetch(`/api/attendance?where[date][greater_than_equal]=${year}-${month}-01&where[date][less_than_equal]=${year}-${month}-31&limit=100&sort=date`)
  return (
    <>
      <AttendanceTable initialData={data.docs || []} />
    </>
  )
}