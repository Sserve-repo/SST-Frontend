import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ORDER_STATUS_MAP,
  getTableColumns,
  formatDate,
  formatCurrency,
  isCustomOrder,
} from "@/lib/order-utils";
import type { OrderTableProps, Order } from "@/types/order";

export function RoleTable({
  orders,
  userType,
  onViewDetails,
  isLoading,
  sort,
  onSort,
}: OrderTableProps) {
  const columns = getTableColumns(userType);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8" />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, j) => (
              <Skeleton key={j} className="h-12" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  const renderCell = (order: Order, key: string) => {
    switch (key) {
      case "orderNo":
        return `#${order.orderNo}`;
      case "date":
        return formatDate(order.date);
      case "total":
        return formatCurrency(order.total);
      case "status":
        return (
          <Badge
            variant="secondary"
            className={ORDER_STATUS_MAP[order.status].color}
          >
            {ORDER_STATUS_MAP[order.status].label}
          </Badge>
        );
      case "vendorName":
        return !isCustomOrder(order) ? order.vendorName : "N/A";
      case "customerName":
        return order.customerName;
      case "isCustomOrder":
        return (
          <Badge variant="outline">
            {isCustomOrder(order) ? "Custom" : "Standard"}
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead
              key={column.key}
              className={column.sortable ? "cursor-pointer" : ""}
              onClick={() => {
                if (column.sortable && onSort) {
                  onSort({
                    field: column.key as keyof Order,
                    direction:
                      sort?.field === column.key && sort.direction === "asc"
                        ? "desc"
                        : "asc",
                  });
                }
              }}
            >
              <div className="flex items-center gap-2">
                {column.label}
                {column.sortable && sort?.field === column.key && (
                  <span>{sort.direction === "asc" ? "↑" : "↓"}</span>
                )}
              </div>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow
            key={order.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => onViewDetails(order)}
          >
            {columns.map((column) => (
              <TableCell key={column.key}>
                {renderCell(order, column.key)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
