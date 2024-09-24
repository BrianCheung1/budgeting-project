import React from "react"
import { Calendar as CaldenarIcon } from "lucide-react"
import { SelectSingleEventHandler } from "react-day-picker"
import { format } from "date-fns"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover"
import { Calendar } from "./ui/calendar"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"

type Props = {
  value?: Date
  onChange?: SelectSingleEventHandler
  disabled?: boolean
}

export const DatePicker = ({ value, onChange, disabled }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          className={cn(
            "w-full font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CaldenarIcon className="size-4 mr-2" />
          {value ? format(value, "PPP") : <span>Pick a Date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          className="flex justify-center"
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={disabled}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
