import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ServiceData } from "@/types/analytics";

interface DataTableProps {
  data: ServiceData[];
}

export function DataTable({ data }: DataTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Service Name</TableHead>
          <TableHead className="text-right">Total Bookings</TableHead>
          <TableHead className="text-right">Revenue</TableHead>
          <TableHead className="text-right">Avg. Revenue per Booking</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((service) => (
          <TableRow key={service.name}>
            <TableCell>{service.name}</TableCell>
            <TableCell className="text-right">{service.bookings}</TableCell>
            <TableCell className="text-right">${service.revenue}</TableCell>
            <TableCell className="text-right">
              ${(service.revenue / service.bookings).toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
