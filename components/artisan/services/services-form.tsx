"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "./image-upload";
import type { Service } from "@/types/services";
import DatePicker from "react-multi-date-picker";
import InputIcon from "react-multi-date-picker/components/input_icon";
import type { Value } from "react-multi-date-picker";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(10).max(500),
  price: z.number().min(0),
  duration: z.number().min(15).max(480),
  images: z.array(z.string()).min(1),
  availableFrom: z.array(z.string()),
  availableTo: z.array(z.string()),
  availability: z.record(
    z.object({
      start: z.string(),
      end: z.string(),
    })
  ),
  status: z.enum(["active", "inactive"]),
});

interface ServiceFormProps {
  service?: Service;
  onSubmit: (data: Service | Omit<Service, "id">) => void;
}

export function ServiceForm({ service, onSubmit }: ServiceFormProps) {
  const [selectedDates, setSelectedDates] = useState<Value[] | undefined>(
    undefined
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: service || {
      name: "",
      description: "",
      price: 0,
      duration: 60,
      images: [],
      availability: {},
      availableFrom: "",
      availableTo: "",
      status: "active",
    },
  } as any);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (service) {
      onSubmit({
        ...values,
        id: service.id,
        category: "",
        createdAt: "",
        featured: false,
        vendor: {
          id: "",
          name: "",
          email: "",
        },
      });
    } else {
      onSubmit({
        ...values,
        category: "",
        createdAt: "",
        featured: false,
        vendor: {
          id: "",
          name: "",
          email: "",
        },
      });
    }
  };

  const handleDateChange = (dates) => {
    setSelectedDates(dates);
    console.log("Formatted Dates:", dates);
  };

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
                  onRemove={(url) =>
                    field.onChange(field.value.filter((val) => val !== url))
                  }
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
              <Select
                value={field.value.toString()}
                onValueChange={(value) => field.onChange(Number(value))}
              >
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
          render={() => (
            <FormItem className="w-full flex flex-col mb-[22px]">
              <FormLabel>Select Days*</FormLabel>
              <DatePicker
                render={
                  <InputIcon className="w-full px-2 rounded-xl  ring-1 ring-[#b9b9b9] py-3 inline-flex justify-center items-center shadow-sm pr-6" />
                }
                multiple
                value={selectedDates}
                // format="MMMM DD YYYY"
                onChange={(dates) => {
                  handleDateChange(dates);
                }}
                className="purple"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-row space-x-2">
          {selectedDates &&
            selectedDates.map((item, index) => <p key={index}>{item?.toLocaleString()}</p>)}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="availableFrom"
            render={({ field }) => (
              <FormItem className="w-full mb-[22px]">
                <FormLabel>Select Start Time*</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    {...field}
                    className="rounded-xl shadow-sm h-12 px-3 text-[#b9b9b9]"
                    placeholder="MM/YY"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="availableTo"
            render={({ field }) => (
              <FormItem className="w-full mb-[22px]">
                <FormLabel>Select End Time*</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    {...field}
                    className="rounded-xl shadow-sm h-12 px-3 text-[#b9b9b9]"
                    placeholder="MM/YY"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
          <Button type="submit">
            {service ? "Update Service" : "Create Service"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
