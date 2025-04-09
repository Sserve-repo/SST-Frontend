"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Order } from "@/types/orders/orders"

interface DisputeDialogProps {
  order: Order | null
  onOpenChange: (open: boolean) => void
}

const formSchema = z.object({
  status: z.enum(["resolved", "rejected"]),
  response: z.string().min(10).max(500),
})

export function DisputeDialog({ order, onOpenChange }: DisputeDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "resolved",
      response: "",
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Handle dispute resolution here
    console.log("Resolving dispute:", { orderId: order.id, ...data })
    onOpenChange(false)
  }

  if (!order) return null

  if (!order.dispute) {
    return (
      <Dialog open={!!order} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>No Dispute Found</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">There is no active dispute for this order.</p>
          <div className="flex justify-end">
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={!!order} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Dispute</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Dispute Information</h3>
              <Badge
                variant="secondary"
                className={cn(
                  order.dispute.status === "resolved" && "bg-green-100 text-green-600",
                  order.dispute.status === "pending" && "bg-yellow-100 text-yellow-600",
                  order.dispute.status === "rejected" && "bg-red-100 text-red-600",
                )}
              >
                {order.dispute.status}
              </Badge>
            </div>
            <div className="grid gap-1">
              <p className="text-sm text-muted-foreground">Order ID: {order.id}</p>
              <p className="text-sm text-muted-foreground">Customer: {order.customer.name}</p>
              <p className="text-sm text-muted-foreground">Reason: {order.dispute.reason}</p>
              <p className="text-sm text-muted-foreground">Description: {order.dispute.description}</p>
            </div>
          </div>

          {order.dispute.status === "pending" && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resolution Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="response"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Response</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter your response to the dispute" className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Update Dispute</Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

