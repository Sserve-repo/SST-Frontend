// "use client";

// import { useEffect, useState } from "react";
// import {
//   CheckCircle2,
//   ClipboardCheck,
//   Search,
//   ShieldCheck,
//   Truck,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { OrderDetails } from "./order-details";
// import { useParams } from "next/navigation";
// import { getOrderDetail } from "@/actions/dashboard/buyer";
// import { convertTime } from "@/lib/utils";
// import { Input } from "@/components/ui/input";
// import { FaArrowRight } from "react-icons/fa6";

// interface OrderType {
//   id: string;
//   orderNo: string;
//   userId: string;
//   total: string;
//   vendorTax: string;
//   shippingCost: string;
//   cartTotal: string;
//   status: string;
//   createdAt: string;
//   orderType: string;
//   updatedAt: string;
//   productItems: OrderItemsType[];
// }

// type OrderItemsType = {
//   id: string;
//   orderId: string;
//   userId: string;
//   vendorId: string;
//   listingId: string;
//   productName: string;
//   vendorName: string;
//   quantity: string;
//   currency: string;
//   unitPrice: string;
//   totalAmount: string;
//   orderStatus: string;
//   orderType: string;
//   status: string;
//   createdAt: string;
//   updatedAt: string;
// };

// const statusStyles = {
//   success: "bg-emerald-50 text-emerald-700",
//   pending: "bg-purple-50 text-purple-700",
//   processing: "bg-purple-50 text-purple-700",
//   cancelled: "bg-red-50 text-red-700",
//   "In Transit": "bg-blue-50 text-blue-700",
// };

// const paymentStatusStyles = {
//   paid: "bg-green-100 text-green-600",
//   pending: "bg-yellow-100 text-yellow-600",
// };

// export default function OrdersPage() {
//   const [order, setOrder] = useState<OrderType | null>(null);
//   const [selectedOrder, setSelectedOrder] = useState<OrderItemsType | null>(
//     null
//   );
//   const { id } = useParams();

//   const handleFetchOrders = async (id) => {
//     const response = await getOrderDetail(id);
//     if (response && response.ok) {
//       const data = await response.json();
//       console.log({ data });

//       const result = data.data["Order Details"];
//       const transformedData: OrderType = {
//         id: result.id,
//         orderNo: result.order_no,
//         userId: result.user_id,
//         total: result.total,
//         vendorTax: result.vendor_tax,
//         shippingCost: result.shipping_cost,
//         cartTotal: result.cart_total,
//         status: result.status,
//         createdAt: result.created_at,
//         updatedAt: result.updated_at,
//         orderType: result.order_type || "",
//         productItems: result["product_items"].map((product: any) => ({
//           id: product.id,
//           orderId: product.order_id,
//           userId: product.user_id,
//           vendorId: product.vendor_id,
//           listingId: product.listing_id,
//           productName: product.product_name,
//           vendorName: product.vendor_name,
//           quantity: product.quantity,
//           currency: product.currency,
//           unitPrice: product.unit_price,
//           totalAmount: product.total_amount,
//           orderStatus: product.order_status,
//           orderType: product.order_type || "",
//           status: product.status,
//           createdAt: product.created_at,
//           updatedAt: product.updated_at,
//         })),
//       };
//       setOrder(transformedData);
//     }
//   };

//   useEffect(() => {
//     handleFetchOrders(id);
//   }, [id]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="mx-auto px-4 py-6">
//         <h2 className="text-2xl sm:text-3xl font-bold tracking-tight py-4">
//           Orders History
//         </h2>

//         <div className="flex flex-col gap-4 sm:flex-row sm:items-center py-4">
//           <div className="relative flex-1">
//             <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//             <Input
//               placeholder="Search by order ID or customer name..."
//               className="pl-8 sm:max-w-[300px]"
//             />
//           </div>
//           <div className="flex gap-4">
//             <Select defaultValue="all-status">
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder="Order Status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   <SelectItem value="all-status">All Status</SelectItem>
//                   <SelectItem value="pending">Pending</SelectItem>
//                   <SelectItem value="confirmed">Confirmed</SelectItem>
//                   <SelectItem value="completed">Completed</SelectItem>
//                   <SelectItem value="canceled">Canceled</SelectItem>
//                   <SelectItem value="disputed">Disputed</SelectItem>
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//             <Select defaultValue="all-payment">
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder="Payment Status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   <SelectItem value="all-payment">
//                     All Payment Status
//                   </SelectItem>
//                   <SelectItem value="pending">Pending</SelectItem>
//                   <SelectItem value="paid">Paid</SelectItem>
//                   <SelectItem value="refunded">Refunded</SelectItem>
//                   <SelectItem value="refund_pending">Refund Pending</SelectItem>
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="rounded-lg border bg-white overflow-x-auto">
//           <Table className="min-w-full">
//             <TableHeader>
//               <TableRow>
//                 <TableHead>S/N</TableHead>
//                 <TableHead>Order No</TableHead>
//                 <TableHead>Vendor</TableHead>
//                 <TableHead>Product</TableHead>
//                 <TableHead>Qty</TableHead>
//                 <TableHead>Amount</TableHead>
//                 <TableHead>Order Date</TableHead>
//                 <TableHead>Payment Status</TableHead>
//                 <TableHead>Order Status</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {order &&
//                 order.productItems?.map((orderItem, index) => (
//                   <TableRow
//                     key={order.orderNo}
//                     className="cursor-pointer hover:bg-gray-50"
//                     onClick={() =>
//                       setSelectedOrder(order["productItems"][index])
//                     }
//                   >
//                     <TableCell>{index + 1}</TableCell>
//                     <TableCell>{order.orderNo}</TableCell>
//                     <TableCell>{orderItem?.productName}</TableCell>
//                     <TableCell>{orderItem?.vendorName}</TableCell>
//                     <TableCell>{orderItem?.quantity}</TableCell>
//                     <TableCell>${orderItem?.totalAmount}</TableCell>
//                     <TableCell>
//                       {convertTime(order.createdAt) ||
//                         convertTime(order.createdAt)}
//                     </TableCell>
//                     <TableCell>
//                       <span
//                         className={`inline-flex rounded-lg px-3 py-1 text-[sm] font-medium ${
//                           paymentStatusStyles[
//                             order.status as keyof typeof paymentStatusStyles
//                           ]
//                         }`}
//                       >
//                         {order.status.charAt(0).toUpperCase() +
//                           order.status.slice(1)}
//                       </span>
//                     </TableCell>
//                     <TableCell className="flex justify-start items-center ">
//                       <span
//                         className={`inline-flex rounded-lg px-3 py-1 text-[sm] font-medium ${
//                           statusStyles[
//                             orderItem.orderStatus as keyof typeof statusStyles
//                           ]
//                         }`}
//                       >
//                         {orderItem?.orderStatus
//                           ? orderItem.orderStatus.charAt(0).toUpperCase() +
//                             orderItem.orderStatus.slice(1)
//                           : ""}
//                       </span>
//                     </TableCell>
//                     <TableCell>
//                       <div
//                         className="flex justify-center items-center  space-x-2 text-orange-400"
//                         onClick={() =>
//                           setSelectedOrder(order["productItems"][index])
//                         }
//                       >
//                         <p>View Details</p>
//                         <FaArrowRight />
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//             </TableBody>
//           </Table>

//           {/* Pagination */}
//           <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 gap-4">
//             <p className="text-sm text-gray-500">Showing 1-09 of 78</p>
//             <div className="flex gap-2">
//               <Button variant="outline" size="sm">
//                 Previous
//               </Button>
//               <Button variant="outline" size="sm">
//                 Next
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Order Details Sheet */}
//         {selectedOrder && (
//           <OrderDetails
//             isOpen={!!selectedOrder}
//             onClose={() => setSelectedOrder(null)}
//             order={{
//               ...selectedOrder,
//               shipping_cost: order?.shippingCost || "0.00",
//               vendor_tax: order?.vendorTax || "0.00",
//               cart_total: order?.cartTotal || "0.00",
//               total: order?.total || "0.00",
//               order_type: order?.orderType,

//               activities: [
//                 {
//                   message:
//                     "Your order has been delivered. Thank you for shopping at Clicon!",
//                   date: "23 Jan, 2021 at 7:32 PM",
//                   icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
//                 },
//                 {
//                   message: "Your order is in Transit.",
//                   date: "22 Jan, 2021 at 8:00 AM",
//                   icon: <Truck className="h-5 w-5 text-purple-500" />,
//                 },
//                 {
//                   message: "Your order is successfully Verified.",
//                   date: "20 Jan, 2021 at 7:32 PM",
//                   icon: <ShieldCheck className="h-5 w-5 text-orange-500" />,
//                 },
//                 {
//                   message: "Your order has been Confirmed.",
//                   date: "19 Jan, 2021 at 2:61 PM",
//                   icon: <ClipboardCheck className="h-5 w-5 text-blue-500" />,
//                 },
//               ],
//             }}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  ClipboardCheck,
  Search,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderDetails } from "./order-details";
import { useParams } from "next/navigation";
import { getOrderDetail } from "@/actions/dashboard/buyer";
import { convertTime } from "@/lib/utils";
import { FaArrowRight } from "react-icons/fa6";

interface OrderType {
  id: string;
  orderNo: string;
  userId: string;
  total: string;
  vendorTax: string;
  shippingCost: string;
  cartTotal: string;
  status: string;
  createdAt: string;
  orderType: string;
  updatedAt: string;
  productItems: OrderItemsType[];
}

type OrderItemsType = {
  id: string;
  orderId: string;
  userId: string;
  vendorId: string;
  listingId: string;
  productName: string;
  vendorName: string;
  quantity: string;
  currency: string;
  unitPrice: string;
  totalAmount: string;
  orderStatus: string;
  orderType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

const statusStyles = {
  success: "bg-emerald-50 text-emerald-700",
  pending: "bg-purple-50 text-purple-700",
  processing: "bg-purple-50 text-purple-700",
  cancelled: "bg-red-50 text-red-700",
  "In Transit": "bg-blue-50 text-blue-700",
};


export default function OrdersPage() {
  const [order, setOrder] = useState<OrderType | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderItemsType | null>(
    null
  );
  const { id } = useParams();

  const handleFetchOrders = async (id) => {
    const response = await getOrderDetail(id);
    if (response && response.ok) {
      const data = await response.json();
      console.log({ data });

      const result = data.data["Order Details"];
      const transformedData: OrderType = {
        id: result.id,
        orderNo: result.order_no,
        userId: result.user_id,
        total: result.total,
        vendorTax: result.vendor_tax,
        shippingCost: result.shipping_cost,
        cartTotal: result.cart_total,
        status: result.status,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
        orderType: result.order_type || "",
        productItems: result["product_items"].map((product: any) => ({
          id: product.id,
          orderId: product.order_id,
          userId: product.user_id,
          vendorId: product.vendor_id,
          listingId: product.listing_id,
          productName: product.product_name,
          vendorName: product.vendor_name,
          quantity: product.quantity,
          currency: product.currency,
          unitPrice: product.unit_price,
          totalAmount: product.total_amount,
          orderStatus: product.order_status,
          orderType: product.order_type || "",
          status: product.status,
          createdAt: product.created_at,
          updatedAt: product.updated_at,
        })),
      };
      setOrder(transformedData);
    }
  };

  useEffect(() => {
    handleFetchOrders(id);
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 py-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight py-4">
          Orders History
        </h2>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center py-4">
          <div className="relative flex-1">
            {order && convertTime((order as any).productItems[0].createdAt)}
          </div>
          <div className="flex gap-4">
            <Select defaultValue="all-status">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Order Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all-status">All Order Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                  <SelectItem value="disputed">Disputed</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-white overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>S/N</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order &&
                order.productItems?.map((orderItem, index) => (
                  <TableRow
                    key={order.orderNo}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() =>
                      setSelectedOrder(order["productItems"][index])
                    }
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{orderItem?.productName}</TableCell>
                    <TableCell>{orderItem?.vendorName}</TableCell>
                    <TableCell>{orderItem?.quantity}</TableCell>
                    <TableCell>${orderItem?.totalAmount}</TableCell>

                    <TableCell className="flex justify-start items-center ">
                      <span
                        className={`inline-flex rounded-lg px-3 py-1 text-[sm] font-medium ${
                          statusStyles[
                            orderItem.orderStatus as keyof typeof statusStyles
                          ]
                        }`}
                      >
                        {orderItem?.orderStatus
                          ? orderItem.orderStatus.charAt(0).toUpperCase() +
                            orderItem.orderStatus.slice(1)
                          : ""}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div
                        className="flex justify-center items-center  space-x-2 text-orange-400"
                        onClick={() =>
                          setSelectedOrder(order["productItems"][index])
                        }
                      >
                        <p>View Details</p>
                        <FaArrowRight />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {/* Order Details Sheet */}
        {selectedOrder && (
          <OrderDetails
            isOpen={!!selectedOrder}
            onClose={() => setSelectedOrder(null)}
            order={{
              ...selectedOrder,
              shipping_cost: order?.shippingCost || "0.00",
              vendor_tax: order?.vendorTax || "0.00",
              cart_total: order?.cartTotal || "0.00",
              total: order?.total || "0.00",
              order_type: order?.orderType,

              activities: [
                {
                  message:
                    "Your order has been delivered. Thank you for shopping at Clicon!",
                  date: "23 Jan, 2021 at 7:32 PM",
                  icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
                },
                {
                  message: "Your order is in Transit.",
                  date: "22 Jan, 2021 at 8:00 AM",
                  icon: <Truck className="h-5 w-5 text-purple-500" />,
                },
                {
                  message: "Your order is successfully Verified.",
                  date: "20 Jan, 2021 at 7:32 PM",
                  icon: <ShieldCheck className="h-5 w-5 text-orange-500" />,
                },
                {
                  message: "Your order has been Confirmed.",
                  date: "19 Jan, 2021 at 2:61 PM",
                  icon: <ClipboardCheck className="h-5 w-5 text-blue-500" />,
                },
              ],
            }}
          />
        )}
      </div>
    </div>
  );
}
