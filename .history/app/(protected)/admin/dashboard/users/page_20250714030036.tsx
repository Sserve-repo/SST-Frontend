"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { CreateUserDialog } from "@/components/admin/users/create-user-dialog";
import { EditUserDialog } from "@/components/admin/users/edit-user-dialog";
import { CreateRoleDialog } from "@/components/admin/roles/create-role-dialog";
import { AssignRoleDialog } from "@/components/admin/users/assign-role-dialog";
import { ViewUserDialog } from "@/components/admin/users/view-user-dialog";
import { ViewRoleDialog } from "@/components/admin/roles/view-role-dialog";
import { EditRoleDialog } from "@/components/admin/users/edit-role-dialog";
import { DeleteRoleDialog } from "@/components/admin/roles/delete-role-dialog";
import { DeleteUserDialog } from "@/components/admin/users/delete-user-dialog";
import { BanUserDialog } from "@/components/admin/users/ban-user-dialog";
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
  Users,
  Shield,
  Settings,
  MoreHorizontal,
  Eye,
  Edit,
  Trash,
  UserCog,
  Loader2,
  UserX,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAllUsers } from "@/actions/admin/user-api";
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
  photo: string | null;
  createdAt: string;
  role?: string;
}

interface RoleTableItem {
  id: string;
  name: string;
  permissions: string[];
  permissionCount: number;
}

export default function UsersRolesPage() {
  const [activeTab, setActiveTab] = useState("users");
  const [selectedUser, setSelectedUser] = useState<UserTableItem | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [banningUserId, setBanningUserId] = useState<string | null>(null);

  // Role states
  const [viewingRoleId, setViewingRoleId] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<RoleTableItem | null>(null);
  const [deletingRole, setDeletingRole] = useState<RoleTableItem | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all users
  const { data: allUsersData, isLoading: allUsersLoading } = useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      const { data, error } = await getAllUsers();
      if (error) throw new Error(error);
      return data.data;
    },
    enabled: activeTab === "users",
  });

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

  // Delete user mutation
  // const deleteUserMutation = useMutation({
  //   mutationFn: deleteUser,
  //   onSuccess: () => {
  //     toast({
  //       title: "Success",
  //       description: "User deleted successfully.",
  //     });
  //     queryClient.invalidateQueries({ queryKey: ["all-users"] });
  //     setDeletingUserId(null);
  //   },
  //   onError: (error: Error) => {
  //     toast({
  //       title: "Error",
  //       description: error.message || "Failed to delete user.",
  //       variant: "destructive",
  //     });
  //   },
  // });

  // Delete role mutation
  const deleteRoleMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Role deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["roles-with-permissions"] });
      setDeletingRole(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete role.",
        variant: "destructive",
      });
    },
  });

  const handleUserSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["all-users"] });
  };

  const handleRoleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["roles-with-permissions"] });
    queryClient.invalidateQueries({ queryKey: ["roles"] });
  };

  const getUserTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      "1": "Admin",
      "2": "Vendor",
      "3": "Artisan",
      "4": "Buyer",
    };
    return types[type] || type;
  };

  // Format data for tables
  const allUsers: UserTableItem[] =
    allUsersData?.users?.map((user: any) => ({
      id: user.id?.toString() || "",
      name:
        `${user.firstname || ""} ${user.lastname || ""}`.trim() || "Unknown",
      email: user.email || "N/A",
      userType: getUserTypeLabel(user.user_type || ""),
      status: user.active_status === 1 ? "Active" : "Inactive",
      verified: user.verified_status === "1" ? "Verified" : "Unverified",
      photo: user.user_photo,
      createdAt: user.created_at || "N/A",
      role: user.role?.name || "No Role",
    })) || [];

  const formattedRoles: RoleTableItem[] =
    rolesData?.data?.roles?.map((role: RoleWithPermissions) => ({
      id: role.role_id.toString(),
      name: role.role,
      permissions: role.permissions || [],
      permissionCount: (role.permissions || []).length,
    })) || [];

  const formattedSimpleRoles: Role[] = simpleRoles?.data || [];

  // Calculate stats
  const stats = {
    totalUsers: allUsersData?.userCounts?.allUsers || 0,
    activeUsers: allUsersData?.userCounts?.activeUsers || 0,
    totalRoles: formattedRoles.length,
    activeRoles: formattedRoles.filter((r) => r.permissionCount > 0).length,
    totalPermissions: formattedRoles.reduce(
      (acc, r) => acc + r.permissionCount,
      0
    ),
  };

  const userColumns: ColumnDef<UserTableItem>[] = [
    {
      accessorKey: "photo",
      header: "",
      cell: ({ row }) => {
        const photo = row.getValue("photo") as string | null;
        const name = row.getValue("name") as string;
        return (
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
            {photo ? (
              <img
                src={photo || "/assets/images/image-placeholder.png"}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Users className="h-5 w-5 text-gray-400" />
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const name = row.getValue("name") as string;
        const email = row.getValue("email") as string;
        return (
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-sm text-muted-foreground">{email}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "userType",
      header: "User Type",
      cell: ({ row }) => {
        const userType = row.getValue("userType") as string;
        return <Badge variant="outline">{userType}</Badge>;
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        return (
          <Badge variant={role === "No Role" ? "secondary" : "default"}>
            {role}
          </Badge>
        );
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
              <DropdownMenuItem onClick={() => setViewingUserId(user.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                <UserCog className="mr-2 h-4 w-4" />
                Assign Role
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEditingUserId(user.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit User
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setBanningUserId(user.id)}>
                <UserX className="mr-2 h-4 w-4" />
                Ban User
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => setDeletingUserId(user.id)}
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
      cell: ({ row }) => {
        const name = row.getValue("name") as string;
        return <div className="font-medium">{name}</div>;
      },
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
              <DropdownMenuItem onClick={() => setViewingRoleId(role.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEditingRole(role)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Role
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => setDeletingRole(role)}
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary">
          Users & Roles Management
        </h1>
        <p className="text-muted-foreground">
          Manage platform users and their roles & permissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Platform users</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.activeUsers}
            </div>
            <p className="text-xs text-muted-foreground">Active users</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRoles}</div>
            <p className="text-xs text-muted-foreground">System roles</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Permissions
            </CardTitle>
            <Settings className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
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
          {allUsersLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : allUsers.length > 0 ? (
            <Card>
              <CardContent className="p-4">
                <DataTable
                  columns={userColumns}
                  data={allUsers}
                  searchKey="name"
                  searchPlaceholder="Filter users..."
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No users available.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          {rolesLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : rolesError ? (
            <Card>
              <CardContent className="text-center py-8">
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
              </CardContent>
            </Card>
          ) : formattedRoles.length > 0 ? (
            <Card>
              <CardContent className="p-4">
                <DataTable
                  columns={roleColumns}
                  data={formattedRoles}
                  searchKey="name"
                  searchPlaceholder="Search roles..."
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground mb-2">
                  No roles found. Create a new role to get started.
                </p>
                <CreateRoleDialog onSuccess={handleRoleSuccess}>
                  <Button variant="link">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Role
                  </Button>
                </CreateRoleDialog>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* User Dialogs */}
      <ViewUserDialog
        userId={allUsers.find((u) => u.id == viewingUserId)?.id as any}
        onOpenChange={(open) => !open && setViewingUserId(null)}
      />

      <EditUserDialog
        user={allUsers.find((u) => u.id === editingUserId)}
        userId={editingUserId}
        onOpenChange={(open) => !open && setEditingUserId(null)}
        onSuccess={handleUserSuccess}
      />

      <AssignRoleDialog
        user={selectedUser as any}
        roles={formattedSimpleRoles}
        onOpenChange={(open) => !open && setSelectedUser(null)}
        onSuccess={handleUserSuccess}
      />

      <DeleteUserDialog
        user={(allUsers.find((u) => u.id == deletingUserId) as any) ?? null}
        onOpenChange={(open) => !open && setDeletingUserId(null)}
        onSuccess={handleUserSuccess}
      />

      <BanUserDialog
        user={(allUsers.find((u) => u.id == banningUserId) as any) ?? null}
        onOpenChange={(open) => !open && setBanningUserId(null)}
        onSuccess={handleUserSuccess}
      />

      {/* Role Dialogs */}
      <ViewRoleDialog
        roleId={viewingRoleId}
        onOpenChange={(open) => !open && setViewingRoleId(null)}
      />

      <EditRoleDialog
        role={editingRole}
        onOpenChange={(open) => !open && setEditingRole(null)}
        onSuccess={handleRoleSuccess}
      />

      <DeleteRoleDialog
        role={deletingRole}
        onOpenChange={(open) => !open && setDeletingRole(null)}
        onConfirm={(roleId) => {
          deleteRoleMutation.mutate(roleId);
        }}
      />
    </div>
  );
}
