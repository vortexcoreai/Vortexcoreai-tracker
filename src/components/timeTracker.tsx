'use client'

import dayjs from 'dayjs'
import { useState, useEffect } from 'react'
import duration from 'dayjs/plugin/duration'
import { apiFetchPost } from '@/lib/postApi'
import { useMutation } from '@tanstack/react-query'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'

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

  const formattedBreaks = breaks.map((b) => ({
    breakStartTime: b.start,
    breakEndTime: b.end,
    totalBreakTime: b.end - b.start,
  }))

  const mutation = useMutation({
    mutationFn: () =>
      apiFetchPost('/api/attendance', {
        date: dayjs(startTime).format('YYYY-MM-DD'),
        clockIn: new Date(startTime!).toISOString(),
        clockOut: new Date(endTime ?? Date.now()).toISOString(),
        status: 'present',
        workDuration: actualWorkedTime,
        dwr: dwr,
        remarks: 'Completed all tasks',
        breaks: formattedBreaks,
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
      <div className="flex gap-4">
        {/* Timer Card */}
        <Card className="w-full mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{todayDay}</span>
              <span>{todayDate}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-6 relative">
            <div className="text-6xl font-extrabold tracking-tight">{formatTime(displayTime)}</div>
            {isOnBreak && <p className="mt-2 text-sm text-red-600 font-medium uppercase tracking-wide">On Break</p>}
          </CardContent>
          <CardFooter className="flex flex-wrap justify-center gap-3">
            <Button onClick={handleStartWork} disabled={isWorking} variant="default">
              Start Work
            </Button>
            <Button onClick={handleStopWork} disabled={!isWorking} variant="destructive">
              Stop Work
            </Button>
            <Button onClick={handleStartBreak} disabled={!isWorking || isOnBreak} variant="secondary">
              Start Break
            </Button>
            <Button onClick={handleStopBreak} disabled={!isOnBreak} variant="outline">
              Stop Break
            </Button>
          </CardFooter>
        </Card>

        {/* DWR Section */}
        {isWorking && (
          <Card className="w-full mx-auto shadow-md">
            <CardHeader>
              <CardTitle>Daily Work Report (DWR) *</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Label htmlFor="dwr" className="text-sm font-medium">
                  Enter your work report
                </Label>
                <Textarea id="dwr" value={dwr} onChange={(e) => setDwr(e.target.value)} placeholder="Describe what you worked on today..." className="resize-none" rows={4} required />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex">
        {/* Break History */}
        <Card className="mt-6 min-w-[400px] shadow-sm">
          <CardHeader>
            <CardTitle>Break History ({breaks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-60">
              <ul className="list-disc space-y-1">
                {breaks.map((b, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span>
                      {dayjs(b.start).format('HH:mm:ss')} - {b.end ? dayjs(b.end).format('HH:mm:ss') : 'Ongoing'}
                    </span>
                    <span className="ml-2 font-mono">{formatTime(((b.end ?? now) - b.start) / 1000)}</span>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
