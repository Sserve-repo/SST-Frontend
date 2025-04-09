"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Notification } from "@/types/notifications"

const formSchema = z.object({
  title: z.string().min(2).max(100),
  message: z.string().min(10).max(1000),
  targetAudience: z.array(z.enum(["shopper", "vendor", "artisan", "admin", "all"])),
  scheduledFor: z.date().optional(),
})

interface NotificationFormProps {
  notification?: Notification
  onSubmit: (data: Omit<Notification, "id" | "status" | "stats" | "sentAt" | "createdAt">) => void
}

const audienceOptions = [
  { value: "all", label: "All Users" },
  { value: "shopper", label: "Shoppers" },
  { value: "vendor", label: "Vendors" },
  { value: "artisan", label: "Artisans" },
  { value: "admin", label: "Admins" },
]

export function NotificationForm({ notification, onSubmit }: NotificationFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: notification
      ? {
          title: notification.title,
          message: notification.message,
          targetAudience: notification.targetAudience,
          scheduledFor: notification.scheduledFor ? new Date(notification.scheduledFor) : undefined,
        }
      : {
          title: "",
          message: "",
          targetAudience: [],
          scheduledFor: undefined,
        },
  } as any)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter notification title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter notification message" className="min-h-[100px] resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="targetAudience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Audience</FormLabel>
              <Select
                onValueChange={(value) => {
                  if (value === "all") {
                    field.onChange(["all"])
                  } else {
                    const currentValue = field.value.filter((v) => v !== "all")
                    if (currentValue.includes(value as any)) {
                      field.onChange(currentValue.filter((v) => v !== value))
                    } else {
                      field.onChange([...currentValue, value] as any)
                    }
                  }
                }}
                value={field.value[0]}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target audience" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {audienceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="scheduledFor"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Schedule For</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="submit">{notification ? "Update Notification" : "Create Notification"}</Button>
        </div>
      </form>
    </Form>
  )
}

