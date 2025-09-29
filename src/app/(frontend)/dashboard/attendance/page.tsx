import { apiFetch } from '@/lib/api'
import AttendanceTable from '@/components/attendance-table'

export default async function Page() {
  const data = await apiFetch('/api/attendance')
  return <AttendanceTable initialData={data.docs || []} />
}
