"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { CreateUserDialog } from "@/components/admin/users/create-user-dialog";
import { EditUserDialog } from "@/components/admin/users/edit-user-dialog";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  UserPlus,
  Plus,
  // Search,
  Users,
  Shield,
  Settings,
  MoreHorizontal,
  Eye,
  Edit,
  Trash,
  UserCog,
  Loader2,
  // Filter,
  // Download,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { searchUsers, deleteUser, getAllUsers } from "@/actions/admin/user-api";
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
}

interface RoleTableItem {
  id: string;
  name: string;
  permissions: string[];
  permissionCount: number;
}

export default function UsersRolesPage() {
  const [activeTab, setActiveTab] = useState("users");
  const [searchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserTableItem | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [deletingUser, setDeletingUser] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deletingRole, setDeletingRole] = useState<{
    id: string;
    name: string;
  } | null>(null);
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

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
      if (searchQuery) refetchUsers();
      setDeletingUser(null);
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

  // const handleSearchUsers = () => {
  //   if (!searchQuery.trim()) {
  //     toast({
  //       title: "Warning",
  //       description: "Please enter a search query.",
  //       variant: "destructive",
  //     });
  //     return;
  //   }
  //   refetchUsers();
  // };

  const handleDeleteUser = (user: UserTableItem) => {
    setDeletingUser({ id: user.id, name: user.name });
  };

  const handleDeleteRole = (role: RoleTableItem) => {
    setDeletingRole({ id: role.id, name: role.name });
  };

  const handleUserSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["all-users"] });
    if (searchQuery) refetchUsers();
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
  const searchedUsers: UserTableItem[] =
    usersData?.["Search Details"]?.map((user: any) => ({
      id: user.id?.toString() || "",
      name:
        `${user.firstname || ""} ${user.lastname || ""}`.trim() || "Unknown",
      email: user.email || "N/A",
      userType: getUserTypeLabel(user.user_type || ""),
      status: user.active_status === 1 ? "Active" : "Inactive",
      verified: user.verified_status === "1" ? "Verified" : "Unverified",
      photo: user.user_photo,
      createdAt: user.created_at || "N/A",
    })) || [];

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
    })) || [];

  const displayUsers = searchQuery ? searchedUsers : allUsers;

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
        // const email = row.getValue("email") as string;
        return (
          <div>
            <div className="font-medium">{name}</div>
            {/* <div className="text-sm text-muted-foreground">{email}</div> */}
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
              {/* <DropdownMenuItem onClick={() => setEditingUserId(user.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit User
              </DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDeleteUser(user)}
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
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit Role
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDeleteRole(role)}
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
        <Card className="border-l-1 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Platform users</p>
          </CardContent>
        </Card>

        <Card className="border-l-1 border-l-green-500">
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

        <Card className="border-l-1 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRoles}</div>
            <p className="text-xs text-muted-foreground">System roles</p>
          </CardContent>
        </Card>

        <Card className="border-l-1 border-l-yellow-500">
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
            {/* <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button> */}
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
          {/* <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2 flex-1 max-w-sm">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchUsers()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearchUsers} disabled={usersLoading}>
                {usersLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div> */}

          {allUsersLoading || usersLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : displayUsers.length > 0 ? (
            <Card>
              <CardContent className="p-4">
                <DataTable
                  columns={userColumns}
                  data={displayUsers}
                  searchKey="name"
                  searchPlaceholder="Filter users..."
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  {searchQuery
                    ? "No users found. Try a different search term."
                    : "No users available."}
                </p>
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

      {/* Dialogs */}
      <EditUserDialog
        user={allUsers.find((u) => u.id == editingUserId)}
        userId={editingUserId}
        onOpenChange={(open) => !open && setEditingUserId(null)}
        onSuccess={handleUserSuccess}
      />

      <AssignRoleDialog
        user={selectedUser}
        roles={formattedSimpleRoles}
        onOpenChange={(open) => !open && setSelectedUser(null)}
        onSuccess={handleUserSuccess}
      />

      {/* Delete User Dialog */}
      <AlertDialog
        open={!!deletingUser}
        onOpenChange={(open) => !open && setDeletingUser(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{deletingUser?.name}
              &ldquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteUserMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deletingUser && deleteUserMutation.mutate(deletingUser.id)
              }
              disabled={deleteUserMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteUserMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Role Dialog */}
      <AlertDialog
        open={!!deletingRole}
        onOpenChange={(open) => !open && setDeletingRole(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the role &ldquo;
              {deletingRole?.name}&ldquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteRoleMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deletingRole && deleteRoleMutation.mutate(deletingRole.id)
              }
              disabled={deleteRoleMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteRoleMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
