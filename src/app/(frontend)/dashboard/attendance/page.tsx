import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, ColumnsIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { apiFetch } from '@/lib/api'
import { AttendanceTable } from '@/components/attendance-table'

export default async function Page({ searchParams }) {
  const year = Number(searchParams.year) || new Date().getFullYear()
  const month = Number(searchParams.month) || new Date().getMonth() + 1

  const data = await apiFetch(`/api/attendance?where[date][greater_than_equal]=${year}-${month}-01&where[date][less_than_equal]=${year}-${month}-31&limit=100&sort=date`)

  return (
    <>
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
            <AttendanceTable initialData={data.docs || []} />
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
    </>
  )
}
