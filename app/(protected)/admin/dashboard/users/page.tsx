"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash,
  UserPlus,
  Search,
  Users,
  UserCheck,
  UserX,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { searchUsers, deleteUser } from "@/actions/admin/user-api";
import { useToast } from "@/hooks/use-toast";
import { CreateUserDialog } from "@/components/admin/users/create-user-dialog";

interface UserTableItem {
  id: string;
  name: string;
  email: string;
  userType: string;
  status: string;
  verified: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserTableItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });
  const router = useRouter();
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Warning",
        description: "Please enter a search query.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await searchUsers(searchQuery);

      if (error) {
        throw new Error(error);
      }

      if (data?.["Search Details"]) {
        const formattedUsers = data["Search Details"].map((user, index) => ({
          id: index.toString(),
          name: `${user.firstname} ${user.lastname}`,
          email: "N/A",
          userType: "N/A",
          status: "N/A",
          verified: "N/A",
          createdAt: "N/A",
        }));
        setUsers(formattedUsers);
        setStats({
          total: formattedUsers.length,
          active: 0,
          inactive: 0,
        });
      }
    } catch (error) {
      console.error("Failed to search users:", error);
      toast({
        title: "Error",
        description: "Failed to search users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const { error } = await deleteUser(id);

      if (error) {
        throw new Error(error);
      }

      toast({
        title: "Success",
        description: "User deleted successfully.",
      });

      if (searchQuery) {
        handleSearch();
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getUserTypeVariant = (userType: string) => {
    switch (userType.toLowerCase()) {
      case "admin":
        return "destructive";
      case "vendor":
        return "default";
      case "artisan":
        return "secondary";
      case "buyer":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "default";
      case "inactive":
        return "destructive";
      case "pending":
        return "secondary";
      default:
        return "outline";
    }
  };

  const columns: ColumnDef<UserTableItem>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "userType",
      header: "User Type",
      cell: ({ row }) => {
        const userType = row.getValue("userType") as string;
        if (userType === "N/A") return userType;
        return <Badge variant={getUserTypeVariant(userType)}>{userType}</Badge>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        if (status === "N/A") return status;
        return <Badge variant={getStatusVariant(status)}>{status}</Badge>;
      },
    },
    {
      accessorKey: "verified",
      header: "Verified",
      cell: ({ row }) => {
        const verified = row.getValue("verified") as string;
        if (verified === "N/A") return verified;
        return (
          <Badge variant={verified === "verified" ? "default" : "secondary"}>
            {verified}
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
        const user = row.original;

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
                onClick={() => router.push(`/admin/dashboard/users/${user.id}`)}
              >
                <Eye className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/admin/dashboard/users/${user.id}/edit`)
                }
              >
                <Edit className="mr-2 h-4 w-4" /> Edit User
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDeleteUser(user.id)}
              >
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary sm:text-3xl">
            User Management
          </h1>
          <p className="text-muted-foreground">
            Search and manage platform users
          </p>
        </div>
        <CreateUserDialog>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Create User
          </Button>
        </CreateUserDialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All platform users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inactive Users
            </CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.inactive}
            </div>
            <p className="text-xs text-muted-foreground">Inactive accounts</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Search users by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          className="max-w-sm"
        />
        <Button onClick={handleSearch} disabled={loading}>
          <Search className="mr-2 h-4 w-4" />
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {users.length > 0 ? (
        <DataTable
          columns={columns}
          data={users}
          searchKey="name"
          searchPlaceholder="Filter results..."
        />
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {searchQuery
              ? "No users found. Try a different search term."
              : "Enter a search term to find users."}
          </p>
        </div>
      )}
    </div>
  );
}
