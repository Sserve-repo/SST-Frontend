"use client";

import { useState, useEffect } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Package,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { getOrders, type Order } from "@/actions/admin/order-api";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
// import { OrderFilters } from "@/components/admin/orders/order-filters";

interface OrderTableItem {
  id: string;
  orderNo: string;
  customer: string;
  items: number;
  total: string;
  status: string;
  orderType: string;
  createdAt: string;
}

interface OrderStats {
  delivered: number;
  pending: number;
  inProgress: number;
  cancelled: number;
  totalRevenue: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderTableItem[]>([]);
  const [stats, setStats] = useState<OrderStats>({
    delivered: 0,
    pending: 0,
    inProgress: 0,
    cancelled: 0,
    totalRevenue: "0",
  });
  const [filters, setFilters] = useState({
    status: "",
    order_status: "",
    search: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: apiError } = await getOrders({
        status: filters.status || undefined,
        order_status: filters.order_status || undefined,
        search: filters.search || undefined,
      });

      if (apiError) {
        throw new Error(apiError);
      }

      if (data) {
        setStats({
          delivered: data.deliveredOrder,
          pending: data.pendingOrder,
          inProgress: data.orderInProgress,
          cancelled: data.cancelledOrder,
          totalRevenue: data.TotalExpenditure,
        });

        const formattedOrders = data.Orders.map((order: Order) => ({
          id: order.id.toString(),
          orderNo: order.order_no,
          customer: "Customer", // API doesn't provide customer name in list response
          items: order.product_items.length,
          total: `$${order.total}`,
          status: order.status,
          orderType: order.order_type,
          createdAt: new Date(order.created_at).toLocaleDateString(),
        }));
        setOrders(formattedOrders);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      case "in_progress":
        return "outline";
      default:
        return "outline";
    }
  };

  const columns: ColumnDef<OrderTableItem>[] = [
    {
      accessorKey: "orderNo",
      header: "Order No",
    },
    {
      accessorKey: "customer",
      header: "Customer",
    },
    {
      accessorKey: "items",
      header: "Items",
      cell: ({ row }) => {
        const items = row.getValue("items") as number;
        return (
          <div className="flex items-center">
            <Package className="mr-2 h-4 w-4" />
            {items}
          </div>
        );
      },
    },
    {
      accessorKey: "total",
      header: "Total",
    },
    {
      accessorKey: "orderType",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("orderType") as string;
        return <Badge variant="outline">{type}</Badge>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={getStatusVariant(status)}>
            {status.replace("_", " ")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/admin/dashboard/orders/${order.id}`)
                }
              >
                <Eye className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchOrders} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary sm:text-3xl">
          Product Orders
        </h1>
        <p className="text-muted-foreground">
          Manage customer product orders and shipments
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.delivered}
            </div>
            <p className="text-xs text-muted-foreground">Completed orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.inProgress}
            </div>
            <p className="text-xs text-muted-foreground">Being processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.cancelled}
            </div>
            <p className="text-xs text-muted-foreground">Cancelled orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${stats.totalRevenue}
            </div>
            <p className="text-xs text-muted-foreground">Total sales</p>
          </CardContent>
        </Card>
      </div>

      {/* <OrderFilters onFiltersChange={setFilters} /> */}

      <DataTable
        columns={columns}
        data={orders}
        searchKey="orderNo"
        searchPlaceholder="Search by order number..."
      />
    </div>
  );
}
