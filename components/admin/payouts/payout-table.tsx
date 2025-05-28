"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { SupportTicket } from "@/types/support";

interface PayoutTableProps {
  tickets: SupportTicket[];
}

export function PayoutTable({ tickets }: PayoutTableProps) {
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>USER ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell className="font-medium">{ticket.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={ticket.user.avatar}
                        alt={ticket.user.name}
                      />
                      <AvatarFallback>{ticket.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{ticket.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {ticket.user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn(
                      ticket.status === "open" && "bg-blue-100 text-blue-600",
                      ticket.status === "in_progress" &&
                        "bg-yellow-100 text-yellow-600",
                      ticket.status === "resolved" &&
                        "bg-green-100 text-green-600",
                      ticket.status === "closed" && "bg-gray-100 text-gray-600"
                    )}
                  >
                    {ticket.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  {ticket.assignedTo ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={ticket.assignedTo.avatar}
                          alt={ticket.assignedTo.name}
                        />
                        <AvatarFallback>
                          {ticket.assignedTo.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{ticket.assignedTo.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Unassigned
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => {}}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
