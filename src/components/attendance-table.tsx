'use client'

import React, { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function AttendanceTable({ initialData }) {
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(false)

  return (
    <div className="w-full overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Clock In</TableHead>
            <TableHead>Clock Out</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>DWR</TableHead>
            <TableHead>Work Duration</TableHead>
            <TableHead>Overtime</TableHead>
            {/* <TableHead>Remarks</TableHead> */}
            {/* <TableHead>Approved By</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={10} className="h-24 text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : data.length ? (
            data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.date ? new Date(item.date).toLocaleDateString() : '-'}</TableCell>
                <TableCell>{item.clockIn ? new Date(item.clockIn).toLocaleTimeString() : '-'}</TableCell>
                <TableCell>{item.clockOut ? new Date(item.clockOut).toLocaleTimeString() : '-'}</TableCell>
                <TableCell className="capitalize">{item.status}</TableCell>
                <TableCell>{item.dwr || '-'}</TableCell>
                <TableCell>{item.workDuration || '-'}</TableCell>
                <TableCell>{item.overtimeHours || '-'}</TableCell>
                {/* <TableCell>{item.remarks || '-'}</TableCell> */}
                {/* <TableCell>{item.approvedBy ? `${item.approvedBy.firstName} ${item.approvedBy.lastName}` : '-'}</TableCell> */}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="h-24 text-center">
                No records found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
