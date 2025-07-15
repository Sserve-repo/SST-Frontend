"use client";

import React, { useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Calendar, Clock, DollarSign } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Customer {
  id: number;
  firstname: string;
  lastname: string;
  user_photo: string | null;
}

interface ServiceDetail {
  id: number;
  title: string;
}

interface LatestBooking {
  id: number;
  status: string;
  booking_status: string;
  service_listing_detail_id: number;
  user_id: number;
  booked_date: string;
  booked_time: string;
  booked_time_to: string;
  formatted_booked_time: string;
  price: number;
  customer: Customer;
  service_detail: ServiceDetail;
}

interface LatestBookingsProps {
  bookings: LatestBooking[];
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function LatestBookings({ bookings }: LatestBookingsProps) {
  // Define table columns
  const columns = useMemo<ColumnDef<LatestBooking>[]>(
    () => [
      {
        accessorKey: "customer",
        header: "Customer",
        cell: ({ getValue }) => {
          const customer = getValue() as Customer;
          return (
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {customer.firstname.charAt(0)}
                  {customer.lastname.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span>
                {customer.firstname} {customer.lastname}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "service_detail.title",
        header: "Service",
        cell: ({ getValue }) => <span>{getValue<string>()}</span>,
      },
      {
        accessorKey: "booked_date",
        header: () => (
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Date</span>
          </div>
        ),
        cell: ({ getValue }) => <span>{getValue<string>()}</span>,
      },
      {
        accessorKey: "formatted_booked_time",
        header: () => (
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>Time</span>
          </div>
        ),
        cell: ({ row }) => {
          const start = row.original.formatted_booked_time;
          const end = row.original.booked_time_to;
          return (
            <span>
              {start} - {end}
            </span>
          );
        },
      },
      {
        accessorKey: "price",
        header: () => (
          <div className="flex items-center justify-start gap-1">
            <DollarSign className="w-4 h-4" />
            <span>Price</span>
          </div>
        ),
        cell: ({ getValue }) => (
          <div className="text-left font-semibold">
            ${getValue<number>().toFixed(2)}
          </div>
        ),
      },
      {
        accessorKey: "booking_status",
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue<string>();
          return (
            <div className="text-left">
              <Badge className={getStatusColor(status)}>{status}</Badge>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: bookings,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-500">
        <Calendar className="w-12 h-12 mb-2 opacity-50" />
        <p className="text-sm">No bookings available</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-gray-200 overflow-x-auto">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="whitespace-nowrap">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className="hover:bg-gray-50 transition-colors"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="whitespace-nowrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
