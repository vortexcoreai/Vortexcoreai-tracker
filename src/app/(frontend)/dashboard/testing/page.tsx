'use client'

import { useMutation } from '@tanstack/react-query'
import { apiFetchPost } from '@/lib/postApi'
import TimeTracker from '@/components/timeTracker'

export default function AttendancePage() {
  const mutation = useMutation({
    mutationFn: () =>
      apiFetchPost('/api/attendance', {
        date: new Date().toISOString().split('T')[0],
        clockIn: new Date().toISOString(),
        clockOut: new Date().toISOString(),
        status: 'present',
        workDuration: 8,
        dwr: 'Worked on project X',
        overtimeHours: 2,
        remarks: 'Completed all tasks',
      }),
  })

  return (
    <div className="p-4">
      <TimeTracker />
      <button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="px-4 py-2 bg-blue-600 text-white rounded">
        {mutation.isPending ? 'Submitting...' : 'Submit Attendance'}
      </button>

      {mutation.isSuccess && <p className="mt-2 text-sm text-green-600">✅ Success! Attendance recorded.</p>}
      {mutation.isError && <p className="mt-2 text-sm text-red-600">❌ Error: {(mutation.error as Error).message}</p>}
    </div>
  )
}
