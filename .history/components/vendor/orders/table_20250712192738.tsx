"use client";

import { useMemo, useState } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Eye, ArrowUpDown, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { OrderPreviewSheet } from "./preview-sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/order-utils";
import { getOrderDetails } from "@/actions/dashboard/vendors";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    avatar: string;
  };
  date: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "paid" | "pending" | "failed";
  items: Array<{
    id: string;
    name: string;
    product_name?: string;
    price: number;
    unit_price?: number;
    quantity: number;
    order_status?: string;
  }>;
  shippingAddress: {
    line1: string;
    line2?: string;
    address?: string;
    city: string;
    state: string;
    zipCode: string;
    postal_code?: string;
    country: string;
  };
  shippingMethod: string;
  trackingNumber?: string;
}

interface OrdersTableProps {
  orders: any[];
  onRefresh?: () => void | null;
}

export function OrdersTable({ orders, onRefresh }: OrdersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const transformedOrders = useMemo(() => {
    if (!Array.isArray(orders)) return [];

    return orders.map((order) => ({
      id: String(order?.id || ""),
      orderNumber: order?.orderNumber || `ORD-${order?.id || ""}`,
      customer: {
        name: order?.customer?.name || "Unknown Customer",
        email: order?.customer?.email || "",
        avatar:
          order?.customer?.avatar || "/placeholder.svg?height=32&width=32",
      },
      date: order?.date || new Date().toISOString(),
      total: Number(order?.total) || 0,
      status: order?.status || "pending",
      paymentStatus: order?.paymentStatus || "pending",
      items: Array.isArray(order?.items) ? order.items : [],
      shippingAddress: order?.shippingAddress || {
        line1: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
      },
      shippingMethod: order?.shippingMethod || "Standard Shipping",
    }));
  }, [orders]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        label: "Pending",
      },
      paid: {
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Paid",
      },
      failed: {
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Failed",
      },
      processing: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        label: "Processing",
      },
      shipped: {
        color: "bg-purple-100 text-purple-800 border-purple-200",
        label: "Shipped",
      },
      delivered: {
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Delivered",
      },
      cancelled: {
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Cancelled",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={`${config.color} border`}>{config.label}</Badge>;
  };

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "orderNumber",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-medium"
          >
            Order
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium text-blue-600">
          {row.getValue("orderNumber")}
        </div>
      ),
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => {
        const customer = row.original.customer;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={customer?.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {customer?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-gray-900">
                {customer?.name || "Unknown"}
              </div>
              <div className="text-sm text-gray-500">
                {customer?.email || "No email"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "total",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-medium"
          >
            Total
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = Number(row.getValue("total")) || 0;
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);

        return <div className="font-medium text-gray-900">{formatted}</div>;
      },
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment",
      cell: ({ row }) => getStatusBadge(row.original.paymentStatus),
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-medium"
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = row.getValue("date") as string;
        return (
          <div className="font-medium text-gray-700">{formatDate(date)}</div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const order = row.original;

        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleFetchOrderDetail(order.id)}
              className="h-8 w-8 hover:bg-blue-50"
              disabled={loading}
            >
              <Eye className="h-4 w-4 text-blue-600" />
            </Button>
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem>
                  <Printer className="mr-2 h-4 w-4" />
                  Print Invoice
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Send className="mr-2 h-4 w-4" />
                  Email Invoice
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Tag className="mr-2 h-4 w-4" />
                  Create Label
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Truck className="mr-2 h-4 w-4" />
                  Track Order
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: transformedOrders,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleFetchOrderDetail = async (id: string) => {
    try {
      setLoading(true);
      const response = await getOrderDetails(id);

      if (!response?.ok) {
        throw new Error("Error fetching order detail");
      }

      const data = await response.json();
      const order = data.data["Order Details"];

      setSelectedOrder({
        id: String(order?.id || ""),
        orderNumber: `ORD-${order?.order_no || order?.id}`,
        customer: {
          name:
            `${order?.customer?.firstname || ""} ${
              order?.customer?.lastname || ""
            }`.trim() || "Unknown Customer",
          email: order?.email || order?.customer?.email || "",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        date: order?.created_at || new Date().toISOString(),
        total: Number(order?.total) || 0,
        status: order?.order_status || "pending",
        paymentStatus: order?.status || "pending",
        items: Array.isArray(order?.product_items)
          ? order.product_items.map((item: any) => ({
              id: String(item.id || ""),
              name: item.product_name || "Unknown Product",
              product_name: item.product_name || "Unknown Product",
              price: Number(item.unit_price) || 0,
              unit_price: Number(item.unit_price) || 0,
              quantity: Number(item.quantity) || 1,
              order_status: item.order_status || "pending",
            }))
          : [],
        shippingAddress: {
          line1: order?.delivery_information?.address || "123 Main St",
          address: order?.delivery_information?.address || "123 Main St",
          city: order?.delivery_information?.city || "Unknown City",
          zipCode: order?.delivery_information?.postal_code || "",
          postal_code: order?.delivery_information?.postal_code || "",
          state: order?.delivery_information?.state || "",
          country: order?.delivery_information?.country || "USA",
        },
        shippingMethod: "Standard Shipping",
      });
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast({
        title: "Error",
        description: "Failed to load order details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOrderUpdate = () => {
    setSelectedOrder(null);
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search orders..."
          value={
            (table.getColumn("orderNumber")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("orderNumber")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Select
          value={
            (table?.getColumn("paymentStatus")?.getFilterValue() as string) ??
            "all"
          }
          onValueChange={(value) =>
            table
              ?.getColumn("paymentStatus")
              ?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b bg-gray-50/50">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="font-medium text-gray-700"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-gray-50/50 border-b"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Package className="h-8 w-8 text-gray-400" />
                    <p className="text-gray-500">No orders found.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} order(s) selected.
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      {selectedOrder && (
        <OrderPreviewSheet
          order={selectedOrder}
          open={true}
          onOpenChange={() => setSelectedOrder(null)}
          onUpdate={handleOrderUpdate}
        />
      )}
    </div>
  );
}
