"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Order } from "@/types/orders/orders"
import { useEffect } from "react" 

interface RefundDialogProps {
  order: Order | null
  onOpenChange: (open: boolean) => void
}

const formSchema = z.object({
  amount: z.number().min(0),
  reason: z.string().min(10).max(500),
})

export function RefundDialog({ order, onOpenChange }: RefundDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      reason: "",
    },
  })

  useEffect(() => {
    if (order) {
      form.reset({
        amount: order.total,
        reason: "",
      })
    }
  }, [order, form.reset])

  if (!order) return null

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Handle refund processing here
    console.log("Processing refund:", { orderId: order.id, ...data })
    onOpenChange(false)
  }

  return (
    <Dialog open={!!order} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Process Refund</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-1">
                <h3 className="font-semibold">Order Information</h3>
                <p className="text-sm text-muted-foreground">Order ID: {order.id}</p>
                <p className="text-sm text-muted-foreground">Customer: {order.customer.name}</p>
                <p className="text-sm text-muted-foreground">Total Amount: ${order.total}</p>
              </div>

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Refund Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter refund amount"
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
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Refund Reason</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter reason for refund" className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Process Refund</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

