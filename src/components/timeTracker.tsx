'use client'

import dayjs from 'dayjs'
import { useState, useEffect } from 'react'
import duration from 'dayjs/plugin/duration'
import { Card } from '@/components/ui/card'
import { apiFetchPost } from '@/lib/postApi'
import { useMutation } from '@tanstack/react-query'

dayjs.extend(duration)

export default function TimeTracker() {
  const [isWorking, setIsWorking] = useState(false)
  const [isOnBreak, setIsOnBreak] = useState(false)
  const [dwr, setDwr] = useState('')
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [breaks, setBreaks] = useState<{ start: number; end?: number }[]>([])
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const saved = localStorage.getItem('timeTracker')
    if (saved) {
      const parsed = JSON.parse(saved)
      setStartTime(parsed.startTime)
      setEndTime(parsed.endTime)
      setBreaks(parsed.breaks)
      setIsWorking(parsed.isWorking)
      setIsOnBreak(parsed.isOnBreak)
      setDwr(parsed.dwr || '')
    }
  }, [])

  useEffect(() => {
    const state = { startTime, endTime, breaks, isWorking, isOnBreak, dwr }
    localStorage.setItem('timeTracker', JSON.stringify(state))
  }, [startTime, endTime, breaks, isWorking, isOnBreak, dwr])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isWorking) {
      interval = setInterval(() => setNow(Date.now()), 1000)
    }
    return () => clearInterval(interval)
  }, [isWorking])

  const totalTime = startTime ? ((endTime ?? now) - startTime) / 1000 : 0
  const totalBreakTime = breaks.reduce((acc, b) => {
    if (b.end) return acc + (b.end - b.start) / 1000
    if (isOnBreak) return acc + (now - b.start) / 1000
    return acc
  }, 0)
  const actualWorkedTime = startTime ? totalTime - totalBreakTime : 0
  const displayTime = isOnBreak ? (now - (breaks[breaks.length - 1]?.start || now)) / 1000 : actualWorkedTime

  const formatTime = (secs: number) => {
    if (secs < 0) secs = 0
    const d = dayjs.duration(secs, 'seconds')
    const h = String(Math.floor(d.asHours())).padStart(2, '0')
    const m = String(d.minutes()).padStart(2, '0')
    const s = String(d.seconds()).padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  const todayDay = dayjs().format('dddd')
  const todayDate = dayjs().format('MMMM D, YYYY')

  const mutation = useMutation({
    mutationFn: () =>
      apiFetchPost('/api/attendance', {
        date: dayjs(startTime).format('YYYY-MM-DD'),
        clockIn: new Date(startTime!).toISOString(),
        clockOut: new Date(endTime ?? Date.now()).toISOString(),
        status: 'present',
        workDuration: actualWorkedTime,
        dwr: dwr,
        overtimeHours: 2,
        remarks: 'Completed all tasks',
        breaks: breaks.map((b) => ({
          start: new Date(b.start).toISOString(),
          end: b.end ? new Date(b.end).toISOString() : new Date().toISOString(),
        })),
      }),
    onSuccess: () => console.log('Attendance saved!'),
    onError: (err: any) => console.error('Failed to save attendance', err),
  })

  const handleStartWork = () => {
    const nowTime = Date.now()
    setStartTime(nowTime)
    setEndTime(null)
    setIsWorking(true)
    setBreaks([])
    setIsOnBreak(false)
    setDwr('')
  }

  const handleStopWork = () => {
    if (!dwr.trim()) {
      alert('Please enter Daily Work Report (DWR) before stopping the timer.')
      return
    }

    const nowTime = Date.now()
    setEndTime(nowTime)
    setIsWorking(false)

    if (isOnBreak) {
      setBreaks((prev) => {
        const updated = [...prev]
        updated[updated.length - 1].end = nowTime
        return updated
      })
      setIsOnBreak(false)
    }

    mutation.mutate()
  }

  const handleStartBreak = () => {
    if (isWorking && !isOnBreak) {
      setIsOnBreak(true)
      setBreaks((prev) => [...prev, { start: Date.now() }])
    }
  }

  const handleStopBreak = () => {
    if (isOnBreak) {
      setIsOnBreak(false)
      setBreaks((prev) => {
        const updated = [...prev]
        updated[updated.length - 1].end = Date.now()
        return updated
      })
    }
  }

  return (
    <>
      <Card className="@container/card">
        <div className="p-3 py-2 rounded bg-accent/30 flex-1 flex flex-col justify-between text-sm font-medium uppercase relative z-20">
          <div className="flex justify-between items-center">
            <span className="opacity-50">{todayDay}</span>
            <span>{todayDate}</span>
          </div>

          <div className="text-center">
            <div className="text-5xl font-display">{formatTime(displayTime)}</div>
            {isOnBreak && <p className="text-sm text-red-500 mt-1">On Break</p>}
          </div>
        </div>
      </Card>

      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Employee Time Tracker</h1>

        <div className="space-x-3">
          <button onClick={handleStartWork} disabled={isWorking} className="px-4 py-2 bg-green-500 text-white rounded">
            Start Work
          </button>
          <button onClick={handleStopWork} disabled={!isWorking} className="px-4 py-2 bg-red-500 text-white rounded">
            Stop Work
          </button>
          <button onClick={handleStartBreak} disabled={!isWorking || isOnBreak} className="px-4 py-2 bg-yellow-500 text-white rounded">
            Start Break
          </button>
          <button onClick={handleStopBreak} disabled={!isOnBreak} className="px-4 py-2 bg-blue-500 text-white rounded">
            Stop Break
          </button>
        </div>

        {isWorking && (
          <div className="mt-4">
            <label htmlFor="dwr" className="block font-medium mb-1">
              Daily Work Report (DWR) *
            </label>
            <textarea id="dwr" value={dwr} onChange={(e) => setDwr(e.target.value)} className="w-full p-2 border rounded" rows={4} placeholder="Enter your daily work report..." required />
          </div>
        )}
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Break History ({breaks.length})</h2>
          <ul className="list-disc pl-5">
            {breaks.map((b, i) => (
              <li key={i}>
                {dayjs(b.start).format('HH:mm:ss')} - {b.end ? dayjs(b.end).format('HH:mm:ss') : 'Ongoing'} ({formatTime(((b.end ?? now) - b.start) / 1000)})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
