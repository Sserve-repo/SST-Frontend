"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Promotion } from "@/types/promotions";
import { useEffect } from "react";

// Modified schema to handle either string or Date for date fields
const formSchema = z.object({
  code: z
    .string()
    .min(3, "Code must be at least 3 characters")
    .max(20, "Code must be less than 20 characters"),
  type: z.enum(["percentage", "fixed"]),
  value: z.coerce.number().min(0, "Value must be positive"),
  startDate: z.union([z.string().transform((str) => new Date(str)), z.date()]),
  endDate: z.union([z.string().transform((str) => new Date(str)), z.date()]),
  usageLimit: z.coerce.number().min(1, "Usage limit must be at least 1"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description must be less than 200 characters"),
});

interface PromotionFormProps {
  promotion?: Promotion;
  onSubmit: (
    data: Promotion | Omit<Promotion, "id" | "status" | "usageCount">
  ) => void;
}

export function PromotionForm({ promotion, onSubmit }: PromotionFormProps) {
  // Set up form with a more lenient approach to date validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: promotion?.code || "",
      type: promotion?.type as any || "percentage",
      value: promotion?.value || 0,
      // Pass the values directly now that the schema can handle both
      startDate: promotion?.startDate || new Date(),
      endDate:
        promotion?.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      usageLimit: promotion?.usageLimit || 100,
      description: promotion?.description || "",
    },
  });

  // If we need to explicitly set form values after initialization
  useEffect(() => {
    if (promotion) {
      form.setValue("code", promotion.code || "");
      form.setValue(
        "type",
        promotion.type === "percentage" || promotion.type === "fixed"
          ? promotion.type
          : "percentage"
      );
      form.setValue("value", promotion.value || 0);

      // Ensure dates are properly converted
      if (promotion.startDate) {
        const startDate =
          typeof promotion.startDate === "string"
            ? new Date(promotion.startDate)
            : promotion.startDate;
        form.setValue("startDate", startDate);
      }

      if (promotion.endDate) {
        const endDate =
          typeof promotion.endDate === "string"
            ? new Date(promotion.endDate)
            : promotion.endDate;
        form.setValue("endDate", endDate);
      }

      form.setValue("usageLimit", promotion.usageLimit || 100);
      form.setValue("description", promotion.description || "");
    }
  }, [promotion, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // Ensure the dates are Date objects before submitting
    const processedValues = {
      ...values,
      startDate: new Date(values.startDate),
      endDate: new Date(values.endDate),
    };

    if (promotion) {
      onSubmit({
        ...processedValues,
        id: promotion.id,
        status: promotion.status,
        usageCount: promotion.usageCount,
        name: processedValues.code,
        createdAt:"",
      });
    } else {
      onSubmit({
        ...processedValues,
        id: "",
        status: "draft",
        usageCount: 0,
      } as unknown as Promotion);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Promotion Code</FormLabel>
              <FormControl>
                <Input placeholder="SUMMER2024" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {form.watch("type") === "percentage"
                    ? "Percentage"
                    : "Amount"}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={
                      form.watch("type") === "percentage" ? "10" : "50"
                    }
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => {
              // Ensure field.value is a proper Date object for the Calendar
              const dateValue =
                field.value instanceof Date
                  ? field.value
                  : new Date(field.value);

              return (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal",
                            !dateValue && "text-muted-foreground"
                          )}
                        >
                          {dateValue ? (
                            format(dateValue, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateValue}
                        onSelect={field.onChange}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => {
              // Ensure field.value is a proper Date object for the Calendar
              const dateValue =
                field.value instanceof Date
                  ? field.value
                  : new Date(field.value);

              return (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal",
                            !dateValue && "text-muted-foreground"
                          )}
                        >
                          {dateValue ? (
                            format(dateValue, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateValue}
                        onSelect={field.onChange}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>

        <FormField
          control={form.control}
          name="usageLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usage Limit</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="100"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter promotion details..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="submit">
            {promotion ? "Update Promotion" : "Create Promotion"}
          </Button>
        </div>
      </form>
    </Form>
  );
}