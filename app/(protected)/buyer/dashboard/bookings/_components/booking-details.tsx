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
import { OrderDetail } from "@/types/order";

// interface OrderActivity {
//   message: string;
//   date: string;
//   icon: React.ReactNode;
// }

type BookingDetailsProps = {
  isOpen: boolean;
  onClose: () => void;
  order: OrderDetail;
};

export function BookingDetails({
  isOpen,
  onClose,
  order,
}: BookingDetailsProps) {
  console.log({ order });
  const [dialog, setDialog] = useState(false);
  const handleRequestRefund = () => {
    setDialog(true);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[500px] overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-3xl font-bold text-primary">
              {order.serviceListingName.charAt(0).toUpperCase() +
                order.serviceListingName.slice(1)}
            </SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p>{order.serviceCategory}</p>
        </SheetHeader>

        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl">Status</h3>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              {order.order.orderType === "service" && order?.bookingStatus}
              {order.order.orderType === "product" && order?.status}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span>${order?.order.vendorTax}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Price</span>
              <span>${order?.order.cartTotal}</span>
            </div>
          </div>

          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-xl font-semibold">Total Price</span>
            <span className="text-xl font-semibold">${order.order.total}</span>
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
              <DialogTrigger className="w-full border">
                {order.order.orderType === "service" &&
                  order.bookingStatus === "cancelled" && (
                    <Button
                      onClick={() => handleRequestRefund()}
                      className="h-14 text-[24px] w-full bg-[#EA0234]"
                    >
                      Request Refund
                    </Button>
                  )}
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
