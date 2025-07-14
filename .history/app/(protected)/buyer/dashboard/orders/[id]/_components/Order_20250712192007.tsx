// "use client";

// import { useEffect, useState } from "react";
// import {
//   CheckCircle2,
//   ClipboardCheck,
//   Filter,
//   ShieldCheck,
//   Truck,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
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
// import { MdReplay } from "react-icons/md";
// import { useParams } from "next/navigation";
// import { getOrderDetail } from "@/actions/dashboard/buyer";
// import { convertTime } from "@/lib/utils";

// type OrderItemsType = {
//   id: string;
//   order_id: string;
//   user_id: string;
//   local_id: string;
//   vendor_id: string;
//   product_listing_detail_id: string;
//   quantity: string;
//   currency: string;
//   unit_price: string;
//   total_amount: string;
//   booking_status?: string;
//   order_status: string;
//   order_type: string;
//   status: string;
//   created_at: string;
//   updated_at: string;
//   address: string;
//   product_name: string;
// };

// interface OrderType {
//   id: string;
//   order_no: string;
//   user_id: string;
//   total: string;
//   vendor_tax: string;
//   shipping_cost: string;
//   cart_total: string;
//   status: string;
//   created_at: string;
//   order_type: string;
//   updated_at: string;
//   product_items: OrderItemsType[];
//   activities: {
//     message: string;
//     date: string;
//     icon: React.ReactNode;
//   };
// }

// const statusStyles = {
//   success: "bg-emerald-50 text-emerald-700",
//   pending: "bg-purple-50 text-purple-700",
//   processing: "bg-purple-50 text-purple-700",
//   cancelled: "bg-red-50 text-red-700",
//   "In Transit": "bg-blue-50 text-blue-700",
// };

// export default function OrdersDetailPage() {
//   const [order, setOrder] = useState<OrderType | null>(null);
//   const { id } = useParams();

//   const handleFetchOrders = async (id) => {
//     const response = await getOrderDetail(id);
//     if (response && response.ok) {
//       const data = await response.json();
//       setOrder(data.data["Order Details"]);
//     }
//   };

//   useEffect(() => {
//     handleFetchOrders(id);
//   }, [id]);

//   const [selectedOrder, setSelectedOrder] = useState<OrderItemsType | null>(
//     null
//   );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="mx-auto px-4 py-6">
//         <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
//           Orders History
//         </h2>
//         {/* Header with Order ID and Price */}
//         <div className="my-8 rounded-2xl bg-purple-50 p-6">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//             <div className="space-y-1">
//               <h2 className="text-sm font-medium text-gray-600">
//                 Order ID No.: {order && order.id}
//               </h2>
//               <p className="text-sm text-gray-500">
//                 { order && `${order["product_items"]?.length} Products`}

//                 {order?.created_at && convertTime(order?.created_at)}
//               </p>
//             </div>
//             <div className="text-2xl font-semibold text-primary">
//               ${order?.total}
//             </div>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="mb-6 flex flex-wrap items-center gap-4 p-3 bg-white rounded-3xl border-2 border-gray-100">
//           <div className="flex items-center gap-2">
//             <Filter className="h-5 w-5 text-gray-500" />
//             <span className="text-sm font-medium">Filter By</span>
//           </div>

//           <div className="flex flex-wrap gap-4 w-full sm:flex-1">
//             <Select>
//               <SelectTrigger className="w-full sm:w-[180px] rounded-2xl">
//                 <SelectValue placeholder="Date" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="today">Today</SelectItem>
//                 <SelectItem value="yesterday">Yesterday</SelectItem>
//                 <SelectItem value="week">This Week</SelectItem>
//               </SelectContent>
//             </Select>

//             <Select>
//               <SelectTrigger className="w-full sm:w-[180px] rounded-2xl">
//                 <SelectValue placeholder="Order Status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="delivered">Delivered</SelectItem>
//                 <SelectItem value="processing">Processing</SelectItem>
//                 <SelectItem value="cancelled">Cancelled</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <Button
//             variant="destructive"
//             size="sm"
//             className="w-full sm:w-auto flex rounded-xl items-center gap-1"
//           >
//             <MdReplay size={20} />
//             Reset Filter
//           </Button>
//         </div>

//         {/* Table */}
//         <div className="rounded-lg border bg-white overflow-x-auto">
//           <Table className="min-w-full">
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="w-[200px]">NAME</TableHead>
//                 <TableHead>ADDRESS</TableHead>
//                 <TableHead>CATEGORY</TableHead>
//                 <TableHead>ACTION</TableHead>
//                 <TableHead>ORDER STATUS</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {order &&
//                 order.order_type === "product" &&
//                 order["product_items"]?.map((orderItem, index) => (
//                   <TableRow
//                     key={order.order_no}
//                     className="cursor-pointer hover:bg-gray-50"
//                     onClick={() =>
//                       setSelectedOrder(order["product_items"][index])
//                     }
//                   >
//                     <TableCell>{orderItem?.product_name}</TableCell>
//                     <TableCell>
//                       {orderItem?.address ? orderItem?.address : "--"}
//                     </TableCell>
//                     <TableCell>
//                       {orderItem?.order_type || order?.order_type}
//                     </TableCell>
//                     <TableCell>
//                       <Select>
//                         <SelectTrigger className="w-[130px]">
//                           <SelectValue placeholder="Complete" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="complete">Complete</SelectItem>
//                           <SelectItem value="cancel">Cancel</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </TableCell>
//                     <TableCell className="flex justify-start items-center ">
//                       <span
//                         className={`inline-flex rounded-lg px-3 py-1 text-[sm] font-medium ${
//                           statusStyles[
//                             orderItem.order_status as keyof typeof statusStyles
//                           ]
//                         }`}
//                       >
//                         {orderItem?.order_status
//                           ? orderItem.order_status.charAt(0).toUpperCase() +
//                             orderItem.order_status.slice(1)
//                           : ""}
//                       </span>
//                       <img
//                         className="ml-6"
//                         src="/assets/icons/info.svg"
//                         alt="info-icon"
//                       ></img>
//                     </TableCell>
//                   </TableRow>
//                 ))}{" "}
//               {order &&
//                 order.order_type === "service" &&
//                 order["service_items"]?.map((orderItem, index) => (
//                   <TableRow
//                     key={order.order_no}
//                     className="cursor-pointer hover:bg-gray-50"
//                     onClick={() =>
//                       setSelectedOrder(order["service_items"][index])
//                     }
//                   >
//                     <TableCell>{orderItem?.service_name}</TableCell>
//                     <TableCell>
//                       {orderItem?.address ? orderItem?.address : "--"}
//                     </TableCell>
//                     <TableCell>
//                       {orderItem?.order_type || order?.order_type}
//                     </TableCell>
//                     <TableCell>
//                       <Select>
//                         <SelectTrigger className="w-[130px]">
//                           <SelectValue placeholder="Complete" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="complete">Complete</SelectItem>
//                           <SelectItem value="cancel">Cancel</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </TableCell>
//                     <TableCell className="flex justify-start items-center ">
//                       <span
//                         className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
//                           statusStyles[
//                             orderItem.booking_status as keyof typeof statusStyles
//                           ]
//                         }`}
//                       >
//                         {orderItem?.booking_status
//                           ? orderItem.booking_status.charAt(0).toUpperCase() +
//                             orderItem.booking_status.slice(1)
//                           : ""}
//                       </span>
//                       <img
//                         className="ml-6"
//                         src="/assets/icons/info.svg"
//                         alt="info-icon"
//                       ></img>
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
//               shipping_cost: order?.shipping_cost || "0.00",
//               vendor_tax: order?.vendor_tax || "0.00",
//               cart_total: order?.cart_total || "0.00",
//               total: order?.total || "0.00",
//               order_type: order?.order_type,

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
import { CheckCircle2, ClipboardCheck, ShieldCheck, Truck } from "lucide-react";

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

export default function OrdersDetailPage() {
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

  const handlePaymentStatusFilterChange = (value: string) => {
    const newFilters = { ...filters, payment_status: value, page: 1 };
    setFilters(newFilters);
    handleFetchBookings(newFilters);
  };

  useEffect(() => {
    handleFetchOrders(id);
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 py-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight py-4">
          Orders History For {order?.orderNo}
        </h2>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center py-4">
          <div className="relative flex flex-1 gap-x-2">
            <p className="">
              {order && convertTime((order as any).productItems[0].createdAt)}
            </p>
            <p className="bg-green-100 text-green-600 rounded-2xl px-2">
              {order &&
                order?.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </p>
          </div>
          <div className="flex gap-4">
            <Select
              value={filters.payment_status || ""}
              onValueChange={handlePaymentStatusFilterChange}
              defaultValue="all-status"
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Order Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all-status">All Order Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="intransit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
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
                    <TableCell>{orderItem?.vendorName}</TableCell>
                    <TableCell>{orderItem?.productName}</TableCell>
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
