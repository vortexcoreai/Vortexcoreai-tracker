'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle2Icon, Eye, ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, ColumnsIcon, LoaderIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function AttendanceTable({ initialData }) {
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(false)
  return (
    <Tabs defaultValue="outline" className="flex w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <TabsList className="@4xl/main:flex hidden">
          <TabsTrigger value="outline">Outline</TabsTrigger>
          <TabsTrigger value="past-performance">Past Performance</TabsTrigger>
          <TabsTrigger value="key-personnel">Key Personnel</TabsTrigger>
          <TabsTrigger value="focus-documents">Focus Documents</TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ColumnsIcon />
                <span className="hidden lg:inline">Filter By Months</span>
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuCheckboxItem checked>January</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>February</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>March</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <TabsContent value="outline" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted">
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Work Duration</TableHead>
                <TableHead>Reviewer</TableHead>
                <TableHead>DWR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length ? (
                data.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="px-1.5 text-muted-foreground">
                        {row.clockIn ? new Date(row.clockIn).toLocaleTimeString() : '-'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="px-1.5 text-muted-foreground">
                        {row.clockOut ? new Date(row.clockOut).toLocaleTimeString() : '-'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex gap-1 px-1.5 text-muted-foreground">
                        {row.status === 'Done' ? <CheckCircle2Icon className="text-green-500 dark:text-green-400 size-3" /> : <LoaderIcon className="size-3" />}
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="px-1.5 text-muted-foreground">
                        {row.workDuration || '-'}
                      </Badge>
                    </TableCell>
                    <TableCell>{row.reviewer || '-'}</TableCell>
                    <TableCell>
                      {row.dwr ? (
                        <Button variant="ghost" size="icon" className="flex size-8 text-muted-foreground">
                          <Eye />
                        </Button>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between px-4">
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="flex w-fit items-center justify-center text-sm font-medium">Page 1 of 1</div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button variant="outline" className="size-8" size="icon">
                <ChevronLeftIcon />
              </Button>
              <Button variant="outline" className="size-8" size="icon">
                <ChevronRightIcon />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}