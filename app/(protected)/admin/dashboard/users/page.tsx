"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { CreateUserDialog } from "@/components/admin/users/create-user-dialog";
import { CreateRoleDialog } from "@/components/admin/roles/create-role-dialog";
import { AssignRoleDialog } from "@/components/admin/users/assign-role-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  UserPlus,
  Plus,
  Search,
  Users,
  Shield,
  Settings,
  MoreHorizontal,
  Eye,
  Edit,
  Trash,
  UserCog,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { searchUsers, deleteUser } from "@/actions/admin/user-api";
import {
  getRolesWithPermissions,
  getRoles,
  deleteRole,
  type RoleWithPermissions,
  type Role,
} from "@/actions/admin/role-api";
import type { ColumnDef } from "@tanstack/react-table";

interface UserTableItem {
  id: string;
  name: string;
  email: string;
  userType: string;
  status: string;
  verified: string;
  createdAt: string;
}

interface RoleTableItem {
  id: string;
  name: string;
  permissions: string[];
  permissionCount: number;
}

export default function UsersRolesPage() {
  const [activeTab, setActiveTab] = useState("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserTableItem | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch roles with permissions
  const {
    data: rolesData,
    isLoading: rolesLoading,
    error: rolesError,
  } = useQuery({
    queryKey: ["roles-with-permissions"],
    queryFn: async () => {
      const { data, error } = await getRolesWithPermissions();
      if (error) throw new Error(error);
      return data;
    },
    enabled: activeTab === "roles",
  });

  // Fetch simple roles list for assignment
  const { data: simpleRoles } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const { data, error } = await getRoles();
      if (error) throw new Error(error);
      return data;
    },
  });

  // Search users query
  const {
    data: usersData,
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["users", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return null;
      const { data, error } = await searchUsers(searchQuery);
      if (error) throw new Error(error);
      return data;
    },
    enabled: false, // Only run when manually triggered
  });

  console.log("Users data:", usersData);
  console.log("Roles data:", rolesData);
  console.log("Simple roles:", simpleRoles);
  console.log("Selected user:", selectedUser);
  console.log("Search query:", searchQuery);
  console.log("Active tab:", activeTab);
  console.log("Users loading:", usersLoading);
  console.log("Roles loading:", rolesLoading);
  console.log("Roles error:", rolesError);
  console.log("Users error:", usersData?.error);
  console.log("Simple roles:", simpleRoles);

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User deleted successfully.",
      });
      refetchUsers();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user.",
        variant: "destructive",
      });
    },
  });

  // Delete role mutation
  const deleteRoleMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Role deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["roles-with-permissions"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete role.",
        variant: "destructive",
      });
    },
  });

  const handleSearchUsers = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Warning",
        description: "Please enter a search query.",
        variant: "destructive",
      });
      return;
    }
    refetchUsers();
  };

  const handleDeleteUser = (id: string) => {
    deleteUserMutation.mutate(id);
  };

  const handleDeleteRole = (id: string) => {
    deleteRoleMutation.mutate(id);
  };

  const handleUserSuccess = () => {
    refetchUsers();
  };

  const handleRoleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["roles-with-permissions"] });
    queryClient.invalidateQueries({ queryKey: ["roles"] });
  };

  // Format data for tables
  const formattedUsers: UserTableItem[] =
    usersData?.["Search Details"]?.map((user: any, index: number) => ({
      id: user.id?.toString() || index.toString(),
      name:
        `${user.firstname || ""} ${user.lastname || ""}`.trim() || "Unknown",
      email: user.email || "N/A",
      userType: user.user_type || "N/A",
      status: user.active_status === 1 ? "Active" : "Inactive",
      verified: user.email_verified_at ? "Verified" : "Unverified",
      createdAt: user.created_at || "N/A",
    })) || [];

  const formattedRoles: RoleTableItem[] =
    rolesData?.roles?.map((role: RoleWithPermissions) => ({
      id: role.role_id.toString(),
      name: role.role,
      permissions: role.permissions || [],
      permissionCount: (role.permissions || []).length,
    })) || [];

  const formattedSimpleRoles: Role[] = simpleRoles || [];

  // Calculate stats
  const stats = {
    totalUsers: formattedUsers.length,
    totalRoles: formattedRoles.length,
    activeRoles: formattedRoles.filter((r) => r.permissionCount > 0).length,
    totalPermissions: formattedRoles.reduce(
      (acc, r) => acc + r.permissionCount,
      0
    ),
  };

  const userColumns: ColumnDef<UserTableItem>[] = [
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
        return <Badge variant="outline">{userType}</Badge>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variant = status === "Active" ? "default" : "secondary";
        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    {
      accessorKey: "verified",
      header: "Verified",
      cell: ({ row }) => {
        const verified = row.getValue("verified") as string;
        const variant = verified === "Verified" ? "default" : "destructive";
        return <Badge variant={variant}>{verified}</Badge>;
      },
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
              <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                <UserCog className="mr-2 h-4 w-4" />
                Assign Role
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit User
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDeleteUser(user.id)}
                disabled={deleteUserMutation.isPending}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const roleColumns: ColumnDef<RoleTableItem>[] = [
    {
      accessorKey: "name",
      header: "Role Name",
    },
    {
      accessorKey: "permissionCount",
      header: "Permissions",
      cell: ({ row }) => {
        const count = row.getValue("permissionCount") as number;
        return <Badge variant="secondary">{count} permissions</Badge>;
      },
    },
    {
      accessorKey: "permissions",
      header: "Permission List",
      cell: ({ row }) => {
        const permissions = row.getValue("permissions") as string[];
        const displayPermissions = permissions.slice(0, 2);
        const remaining = permissions.length - 2;

        return (
          <div className="flex flex-wrap gap-1">
            {displayPermissions.map((permission, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {permission}
              </Badge>
            ))}
            {remaining > 0 && (
              <Badge variant="outline" className="text-xs">
                +{remaining} more
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const role = row.original;

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
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit Role
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDeleteRole(role.id)}
                disabled={deleteRoleMutation.isPending}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary sm:text-3xl">
          Users & Roles Management
        </h1>
        <p className="text-muted-foreground">
          Manage platform users and their roles & permissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Platform users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRoles}</div>
            <p className="text-xs text-muted-foreground">System roles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Roles</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.activeRoles}
            </div>
            <p className="text-xs text-muted-foreground">With permissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Permissions
            </CardTitle>
            <Settings className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalPermissions}
            </div>
            <p className="text-xs text-muted-foreground">
              Assigned permissions
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            {activeTab === "users" && (
              <CreateUserDialog onSuccess={handleUserSuccess}>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create User
                </Button>
              </CreateUserDialog>
            )}
            {activeTab === "roles" && (
              <CreateRoleDialog onSuccess={handleRoleSuccess}>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Role
                </Button>
              </CreateRoleDialog>
            )}
          </div>
        </div>

        <TabsContent value="users" className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search users by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchUsers()}
              className="max-w-sm"
            />
            <Button onClick={handleSearchUsers} disabled={usersLoading}>
              {usersLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              {usersLoading ? "Searching..." : "Search"}
            </Button>
          </div>

          {usersLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : formattedUsers.length > 0 ? (
            <DataTable
              columns={userColumns}
              data={formattedUsers}
              searchKey="name"
              searchPlaceholder="Filter users..."
            />
          ) : (
            <div className="text-center py-8 border rounded-md">
              <p className="text-muted-foreground">
                {searchQuery
                  ? "No users found. Try a different search term."
                  : "Enter a search term to find users."}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          {rolesLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : rolesError ? (
            <div className="text-center py-8 border rounded-md">
              <p className="text-red-600 mb-2">Failed to load roles</p>
              <Button
                variant="outline"
                onClick={() =>
                  queryClient.invalidateQueries({
                    queryKey: ["roles-with-permissions"],
                  })
                }
              >
                Retry
              </Button>
            </div>
          ) : formattedRoles.length > 0 ? (
            <DataTable
              columns={roleColumns}
              data={formattedRoles}
              searchKey="name"
              searchPlaceholder="Search roles..."
            />
          ) : (
            <div className="text-center py-8 border rounded-md">
              <p className="text-muted-foreground mb-2">
                No roles found. Create a new role to get started.
              </p>
              <CreateRoleDialog onSuccess={handleRoleSuccess}>
                <Button variant="link">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Role
                </Button>
              </CreateRoleDialog>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Assign Role Dialog */}
      <AssignRoleDialog
        user={selectedUser}
        roles={formattedSimpleRoles}
        onOpenChange={(open) => !open && setSelectedUser(null)}
        onSuccess={handleUserSuccess}
      />
    </div>
  );
}
