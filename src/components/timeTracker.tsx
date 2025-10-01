'use client'
import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

export default function TimeTracker() {
  const [isWorking, setIsWorking] = useState(false)
  const [isOnBreak, setIsOnBreak] = useState(false)

  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)

  const [breaks, setBreaks] = useState<{ start: number; end?: number }[]>([])

  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    let interval: any
    if (isWorking) {
      interval = setInterval(() => setNow(Date.now()), 1000)
    }
    return () => clearInterval(interval)
  }, [isWorking])

  const handleStartWork = () => {
    setStartTime(Date.now())
    setIsWorking(true)
    setEndTime(null)
    setBreaks([])
  }

  const handleStopWork = () => {
    setIsWorking(false)
    setEndTime(Date.now())
    if (isOnBreak) {
      setBreaks((prev) => {
        const updated = [...prev]
        updated[updated.length - 1].end = Date.now()
        return updated
      })
      setIsOnBreak(false)
    }
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

  const totalTime = startTime ? ((endTime ?? now) - startTime) / 1000 : 0
  const totalBreakTime = breaks.reduce((acc, b) => {
    if (b.end) return acc + (b.end - b.start) / 1000
    if (isOnBreak) return acc + (now - b.start) / 1000
    return acc
  }, 0)

  const actualWorkedTime = totalTime - totalBreakTime
  const formatTime = (secs: number) => {
    const d = dayjs.duration(secs, 'seconds')
    const h = String(Math.floor(d.asHours())).padStart(2, '0')
    const m = String(d.minutes()).padStart(2, '0')
    const s = String(d.seconds()).padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  return (
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

      <div className="mt-6 space-y-2 font-mono text-lg">
        <p>
          <strong>Total Time (incl. break):</strong> {formatTime(totalTime)}
        </p>
        <p>
          <strong>Total Break Time:</strong> {formatTime(totalBreakTime)}
        </p>
        <p>
          <strong>Actual Worked Time:</strong> {formatTime(actualWorkedTime)}
        </p>
      </div>
    </div>
  )
}
