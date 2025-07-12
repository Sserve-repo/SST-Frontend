import { X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

type OrderDetailsProps = {
  isOpen: boolean;
  onClose: () => void;
  order: any;
};


const statusStyles = {
  success: "bg-emerald-50 text-emerald-700",
  pending: "bg-purple-50 text-purple-700",
  processing: "bg-purple-50 text-purple-700",
  cancelled: "bg-red-50 text-red-700",
  "In Transit": "bg-blue-50 text-blue-700",
};

export function OrderDetails({ isOpen, onClose, order }: OrderDetailsProps) {
  const [dialog, setDialog] = useState(false);
  const handleRequestRefund = () => {
    setDialog(true);
  };

  const handleCancelOrder = () => {
    setDialog(true);
  };
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[500px] overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-3xl font-bold text-primary">
              {order.name}
            </SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl">Status</h3>
            <span
              className={`inline-flex rounded-lg px-3 py-1 text-[sm] font-medium ${
                statusStyles[order.orderStatus as keyof typeof statusStyles]
              }`}
            >
              order.order_status
            </span>
          </div>

          <div className="space-y-4">
            {order?.order_type === "product" && (
              <div className="flex justify-between">
                <span className="text-gray-600">Quantity</span>
                <span>x{order.quantity}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span>${order?.vendor_tax && order?.vendor_tax}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping Cost</span>
              <span>${order?.shipping_cost && order?.shipping_cost}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Price</span>
              <span>${order?.cart_total}</span>
            </div>
          </div>

          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-xl font-semibold">Total Price</span>
            <span className="text-xl font-semibold">${order?.total}</span>
          </div>

          <div className="mt-8">
            <h3 className="text-xl mb-4">Order Activity</h3>
            <div className="space-y-4">
              {order?.activities?.map((activity, index) => (
                <div key={index} className="flex gap-3">
                  <div className="mt-1">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-sm text-gray-500">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <Dialog>
              <DialogTrigger asChild>
                <>
                  {order.order_type === "service" &&
                    (order.booking_status === "pending" ||
                      order.booking_status === "inprogress") && (
                      <Button
                        onClick={() => handleCancelOrder()}
                        className="h-14 text-[24px] w-full bg-[#EA0234] border"
                      >
                        Cancel Order
                      </Button>
                    )}

                  {order.order_type === "service" &&
                    order.booking_status === "cancelled" && (
                      <Button
                        onClick={() => handleRequestRefund()}
                        className="h-14 text-[24px] w-full bg-[#EA0234] border"
                      >
                        Request Refund
                      </Button>
                    )}

                  {order.order_type === "product" &&
                    (order.order_status === "pending" ||
                      order.order_status === "intransit") && (
                      <Button
                        onClick={() => handleCancelOrder()}
                        className="h-14 text-[24px] w-full bg-[#EA0234] border"
                      >
                        Cancel Order
                      </Button>
                    )}

                  {order.order_type === "product" &&
                    order.order_status === "cancelled" && (
                      <Button
                        onClick={() => handleRequestRefund()}
                        className="h-14 text-[24px] w-full bg-[#EA0234] border"
                      >
                        Request Refund
                      </Button>
                    )}
                </>
              </DialogTrigger>
              {dialog && (
                <DialogContent className="flex flex-col justify-center items-center">
                  <DialogHeader className="flex flex-col justify-center items-center">
                    <DialogTitle className="text-xl">
                      You’re about to cancel your order
                    </DialogTitle>
                    <DialogDescription className="text-center">
                      Are you sure you want to cancel this order? Once your
                      order is cancelled, you will lose the item(s)
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex  gap-x-4">
                    <Button
                      onClick={() => setDialog(false)}
                      className="w-[8rem] h-12  bg-gray-400"
                    >
                      Back
                    </Button>
                    <Button className="w-[8rem] h-12  bg-[#EA0234]">
                      Cancel Order
                    </Button>
                  </div>
                </DialogContent>
              )}
            </Dialog>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
