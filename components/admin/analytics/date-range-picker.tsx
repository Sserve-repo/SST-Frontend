"use client"

import { CalendarIcon } from "lucide-react"
import { addDays, format } from "date-fns"
import type { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DateRangePickerProps {
  date: DateRange | undefined
  onDateChange: (date: DateRange | undefined) => void
}

export function DateRangePicker({ date, onDateChange }: DateRangePickerProps) {
  const handlePresetChange = (preset: string) => {
    const today = new Date()

    switch (preset) {
      case "last-7":
        onDateChange({
          from: addDays(today, -7),
          to: today,
        })
        break
      case "last-30":
        onDateChange({
          from: addDays(today, -30),
          to: today,
        })
        break
      case "last-90":
        onDateChange({
          from: addDays(today, -90),
          to: today,
        })
        break
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Select onValueChange={handlePresetChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="last-7">Last 7 days</SelectItem>
          <SelectItem value="last-30">Last 30 days</SelectItem>
          <SelectItem value="last-90">Last 90 days</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("justify-start text-left font-normal w-[240px]", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

