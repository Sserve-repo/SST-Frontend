import { X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// interface OrderActivity {
//   message: string;
//   date: string;
//   icon: React.ReactNode;
// }

type OrderDetailsProps = {
  isOpen: boolean;
  onClose: () => void;
  order: any;
};

export function OrderDetails({ isOpen, onClose, order }: OrderDetailsProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[500px]">
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
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              {order.status}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Quantity</span>
              <span>x{order.quantity}</span>
            </div>
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
            <span className="text-xl font-semibold">
              ${order?.total}
            </span>
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
