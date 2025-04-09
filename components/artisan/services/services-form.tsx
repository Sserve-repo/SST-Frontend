"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ImageUpload } from "./image-upload"
import type { Service } from "@/types/services"

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(10).max(500),
  price: z.number().min(0),
  duration: z.number().min(15).max(480),
  images: z.array(z.string()).min(1),
  availability: z.record(
    z.object({
      start: z.string(),
      end: z.string(),
    }),
  ),
  status: z.enum(["active", "inactive"]),
})

interface ServiceFormProps {
  service?: Service
  onSubmit: (data: Service | Omit<Service, "id">) => void
}

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

export function ServiceForm({ service, onSubmit }: ServiceFormProps) {
  const [selectedDays, setSelectedDays] = useState<string[]>(service ? Object.keys(service.availability) : [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: service || {
      name: "",
      description: "",
      price: 0,
      duration: 60,
      images: [],
      availability: {},
      status: "active",
    },
  } as any)

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (service) {
      onSubmit({
        ...values, id: service.id,
        category: "",
        createdAt: "",
        featured: false,
        vendor: {
          id: "",
          name: "",
          email: ""
        }
      })
    } else {
      onSubmit({
        ...values,
        category: "",
        createdAt: "",
        featured: false,
        vendor: {
          id: "",
          name: "",
          email: ""
        }
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Images</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  onRemove={(url) => field.onChange(field.value.filter((val) => val !== url))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Haircut & Styling" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe your service..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (minutes)</FormLabel>
              <Select value={field.value.toString()} onValueChange={(value) => field.onChange(Number(value))}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[15, 30, 45, 60, 90, 120, 180, 240].map((minutes) => (
                    <SelectItem key={minutes} value={minutes.toString()}>
                      {minutes} minutes
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
          name="availability"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Availability</FormLabel>
              <div className="space-y-4">
                {DAYS.map((day) => (
                  <div key={day} className="flex items-center gap-4">
                    <Switch
                      checked={selectedDays.includes(day)}
                      onCheckedChange={(checked) => {
                        const newDays = checked ? [...selectedDays, day] : selectedDays.filter((d) => d !== day)
                        setSelectedDays(newDays)

                        const newAvailability = { ...field.value }
                        if (checked) {
                          newAvailability[day] = { start: "09:00", end: "17:00" }
                        } else {
                          delete newAvailability[day]
                        }
                        field.onChange(newAvailability)
                      }}
                    />
                    <span className="capitalize">{day}</span>
                    {selectedDays.includes(day) && (
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={field.value[day]?.start || "09:00"}
                          onChange={(e) => {
                            const newAvailability = { ...field.value }
                            newAvailability[day] = {
                              ...newAvailability[day],
                              start: e.target.value,
                            }
                            field.onChange(newAvailability)
                          }}
                          className="w-32"
                        />
                        <span>to</span>
                        <Input
                          type="time"
                          value={field.value[day]?.end || "17:00"}
                          onChange={(e) => {
                            const newAvailability = { ...field.value }
                            newAvailability[day] = {
                              ...newAvailability[day],
                              end: e.target.value,
                            }
                            field.onChange(newAvailability)
                          }}
                          className="w-32"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="submit">{service ? "Update Service" : "Create Service"}</Button>
        </div>
      </form>
    </Form>
  )
}

