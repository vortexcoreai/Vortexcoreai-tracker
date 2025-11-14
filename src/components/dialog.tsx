import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "./ui/badge";

export function CustomDialog({ title, subtitle, date, content }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Eye />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-[80vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{subtitle}</DialogDescription>
        </DialogHeader>

        <div className="bg-gray-200 p-2 rounded-md">{content}</div>

        {date && (
          <DialogFooter>
            <Badge variant="secondary">{date}</Badge>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
