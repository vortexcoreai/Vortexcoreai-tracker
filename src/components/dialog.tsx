import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Eye } from 'lucide-react'
import { Badge } from './ui/badge'

export function CustomDialog({ title, subtitle, date, content }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Eye />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{subtitle}</DialogDescription>
        </DialogHeader>

        {content}

        {date && (
          <DialogFooter>
            <Badge variant="secondary">{date}</Badge>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
