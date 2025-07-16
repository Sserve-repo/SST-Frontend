"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Promotion, PromotionFormData } from "@/types/promotions";
import { updatePromotions } from "@/actions/dashboard/vendors";

const promotionSchema = z.object({
  discount_name: z.string().min(1, "Promotion name is required"),
  discount_type: z.enum(["percentage", "fixed_amount"]),
  discount_value: z.number().min(0.01, "Discount value must be greater than 0"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  usage_limit: z.number().min(1, "Usage limit must be at least 1"),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

interface EditPromotionDialogProps {
  promotion: Promotion | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (id: number, formData: FormData) => void;
}

export function EditPromotionDialog({
  promotion,
  open,
  onOpenChange,
  // onSuccess,
}: EditPromotionDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      discount_name: "",
      discount_type: "percentage",
      discount_value: 0,
      start_date: "",
      end_date: "",
      usage_limit: 100,
      description: "",
      status: "active",
    },
  });

  useEffect(() => {
    if (promotion && open) {
      const formatDate = (date: Date) => {
        return date.toISOString().split("T")[0];
      };

      form.reset({
        discount_name: promotion.name,
        discount_type: promotion.type,
        discount_value: promotion.value,
        start_date: formatDate(promotion.startDate),
        end_date: formatDate(promotion.endDate),
        usage_limit: promotion.usageLimit || 100,
        description: promotion.description || "",
        status: promotion.status === "active" ? "active" : "inactive",
      } as any);
    }
  }, [promotion, open, form]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      // Here you would call your update API
      const response = await updatePromotions((promotion as any)?.id, data)
      if (!response.ok) {
        throw new Error("Failed to update promotion");
      }

      toast({
        title: "Success",
        description: "Promotion updated successfully",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating promotion:", error);
      toast({
        title: "Error",
        description: "Failed to update promotion",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Don't render the dialog if no promotion is selected
  if (!promotion) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Promotion</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="discount_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Promotion Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter promotion name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="discount_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed_amount">
                          Fixed Amount
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discount_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Discount Value
                      {form.watch("discount_type") === "percentage" && " (%)"}
                      {form.watch("discount_type") === "fixed_amount" && " ($)"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step={form.watch("discount_type") === "percentage" ? "1" : "0.01"}
                        min="0"
                        max={form.watch("discount_type") === "percentage" ? "100" : undefined}
                        placeholder="0"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? 0 : parseFloat(value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="usage_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usage Limit</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="100"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? 1 : parseInt(value));
                      }}
                    />
                  </FormControl>
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
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

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter promotion description"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary/90"
              >
                {loading ? "Updating..." : "Update Promotion"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}