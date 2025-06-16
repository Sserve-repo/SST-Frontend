"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { UserFilters } from "@/components/admin/users/user-filters";
import { UserTable } from "@/components/admin/users/user-table";
import { CreateUserDialog } from "@/components/admin/users/create-user-dialog";
import type { User } from "@/types/users";

export default function UsersPage() {
  const [users] = useState<User[]>([
    {
      id: "1",
      firstName: "John",
      lastName: "JDoe",
      email: "john@example.com",
      phone: "+1234567890",
      role: "shopper",
      status: "active",
      joinedDate: "2024-01-15",
      lastActive: "2024-02-25",
      password: "",
      passwordConfirmation: ""
    },
    {
      id: "2",
      firstName: "John",
      lastName: "JDoe",
      email: "jane@example.com",
      phone: "+1234567891",
      role: "vendor",
      status: "active",
      joinedDate: "2024-01-20",
      lastActive: "2024-02-24",
      password: "",
      passwordConfirmation: ""
    },
    {
      id: "3",
      firstName: "John",
      lastName: "JDoe",
      email: "mike@example.com",
      phone: "+1234567892",
      role: "artisan",
      status: "banned",
      joinedDate: "2024-01-25",
      lastActive: "2024-02-20",
      password: "",
      passwordConfirmation: ""
    },
    {
      id: "4",
      firstName: "John",
      lastName: "JDoe",
      email: "sarah@example.com",
      phone: "+1234567893",
      role: "admin",
      status: "active",
      joinedDate: "2024-02-01",
      lastActive: "2024-02-25",
      password: "",
      passwordConfirmation: ""
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary sm:text-3xl">
            Vendor, Artisan and Shoppers Management
          </h1>
          <p className="text-muted-foreground">
            Manage and monitor vendor, artisan and shoppers accounts
          </p>
        </div>
        <CreateUserDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </CreateUserDialog>
      </div>

      <UserFilters />
      <UserTable users={users} />
    </div>
  );
}
