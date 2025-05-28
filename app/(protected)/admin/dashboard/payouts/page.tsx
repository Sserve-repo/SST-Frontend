"use client";

import { useState } from "react";
import { PayoutTable } from "@/components/admin/payouts/payout-table";
import { PayoutStats } from "@/components/admin/payouts/payout-stats";
import { PayoutFilters } from "@/components/admin/payouts/payout-filters";
import type { SupportTicket } from "@/types/support";

export default function SupportPage() {
  const [tickets] = useState<SupportTicket[]>([
    {
      id: "TCKT-001",
      user: {
        name: "Sarah Johnson",
        email: "sarah@example.com",
        avatar: "/placeholder.svg",
      },
      type: "technical",
      status: "open",
      priority: "high",
      subject: "Cannot access my account",
      description:
        "I've been trying to log in but keep getting an error message.",
      assignedTo: null,
      createdAt: "2024-02-25T10:00:00",
      updatedAt: "2024-02-25T10:00:00",
      messages: [
        {
          id: "1",
          sender: "user",
          content:
            "I've been trying to log in but keep getting an error message.",
          timestamp: "2024-02-25T10:00:00",
        },
      ],
      internalNotes: [],
    },
    {
      id: "TCKT-002",
      user: {
        name: "Michael Brown",
        email: "michael@example.com",
        avatar: "/placeholder.svg",
      },
      type: "billing",
      status: "in_progress",
      priority: "medium",
      subject: "Refund request for order #12345",
      description: "I would like to request a refund for my recent order.",
      assignedTo: {
        id: "1",
        name: "John Admin",
        email: "john@admin.com",
        avatar: "/placeholder.svg",
      },
      createdAt: "2024-02-24T15:30:00",
      updatedAt: "2024-02-25T09:15:00",
      messages: [
        {
          id: "1",
          sender: "user",
          content: "I would like to request a refund for my recent order.",
          timestamp: "2024-02-24T15:30:00",
        },
        {
          id: "2",
          sender: "admin",
          content:
            "I'll look into this right away. Could you please provide the reason for the refund?",
          timestamp: "2024-02-25T09:15:00",
        },
      ],
      internalNotes: [
        {
          id: "1",
          author: "John Admin",
          content:
            "Customer has a valid reason for refund. Processing request.",
          timestamp: "2024-02-25T09:16:00",
        },
      ],
    },
    {
      id: "TCKT-003",
      user: {
        name: "Emily Davis",
        email: "emily@example.com",
        avatar: "/placeholder.svg",
      },
      type: "feature_request",
      status: "resolved",
      priority: "low",
      subject: "Suggestion for new feature",
      description: "It would be great if we could have a dark mode option.",
      assignedTo: {
        id: "2",
        name: "Alice Admin",
        email: "alice@admin.com",
        avatar: "/placeholder.svg",
      },
      createdAt: "2024-02-23T14:20:00",
      updatedAt: "2024-02-24T11:30:00",
      messages: [
        {
          id: "1",
          sender: "user",
          content: "It would be great if we could have a dark mode option.",
          timestamp: "2024-02-23T14:20:00",
        },
        {
          id: "2",
          sender: "admin",
          content:
            "Thank you for the suggestion! We'll add this to our feature request list.",
          timestamp: "2024-02-24T11:30:00",
        },
      ],
      internalNotes: [
        {
          id: "1",
          author: "Alice Admin",
          content: "Added to Q2 roadmap for implementation.",
          timestamp: "2024-02-24T11:31:00",
        },
      ],
    },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary sm:text-3xl">
          Payout Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage and respond to customer payout requests
        </p>
      </div>

      <PayoutStats tickets={tickets} />
      <PayoutFilters />
      <PayoutTable tickets={tickets} />
    </div>
  );
}
