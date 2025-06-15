"use client";

import { useState, useEffect } from "react";
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
  Plus,
  Shield,
  Users,
  Settings,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  getRolesWithPermissions,
  deleteRole,
  type RoleWithPermissions,
} from "@/actions/admin/role-api";
import { useToast } from "@/hooks/use-toast";
import { CreateRoleDialog } from "@/components/admin/roles/create-role-dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";

interface RoleTableItem {
  id: string;
  name: string;
  permissions: string[];
  permissionCount: number;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<RoleTableItem[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    withPermissions: 0,
    totalPermissions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: apiError } = await getRolesWithPermissions();

      if (apiError) {
        throw new Error(apiError);
      }

      if (data?.data?.roles) {
        const formattedRoles = data?.data.roles.map((role: RoleWithPermissions) => ({
          id: role.role_id.toString(),
          name: role.role,
          permissions: role.permissions,
          permissionCount: role.permissions.length,
        }));

        setRoles(formattedRoles);
        setStats({
          total: formattedRoles.length,
          withPermissions: formattedRoles.filter((r) => r.permissionCount > 0)
            .length,
          totalPermissions: formattedRoles.reduce(
            (acc, r) => acc + r.permissionCount,
            0
          ),
        });
      }
    } catch (err) {
      console.error("Error fetching roles:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleDeleteRole = async (id: string) => {
    try {
      const { error } = await deleteRole(id);

      if (error) {
        throw new Error(error);
      }

      toast({
        title: "Success",
        description: "Role deleted successfully.",
      });

      fetchRoles();
    } catch (error) {
      console.error("Failed to delete role:", error);
      toast({
        title: "Error",
        description: "Failed to delete role. Please try again.",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<RoleTableItem>[] = [
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
        const displayPermissions = permissions.slice(0, 3);
        const remaining = permissions.length - 3;

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
              <DropdownMenuItem
                onClick={() => router.push(`/admin/dashboard/roles/${role.id}`)}
              >
                <Eye className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/admin/dashboard/roles/${role.id}/edit`)
                }
              >
                <Edit className="mr-2 h-4 w-4" /> Edit Role
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDeleteRole(role.id)}
              >
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchRoles} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary sm:text-3xl">
            Role Management
          </h1>
          <p className="text-muted-foreground">
            Manage user roles and permissions
          </p>
        </div>
        <CreateRoleDialog onSuccess={fetchRoles}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Role
          </Button>
        </CreateRoleDialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All system roles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Roles</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.withPermissions}
            </div>
            <p className="text-xs text-muted-foreground">
              Roles with permissions
            </p>
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

      <DataTable
        columns={columns}
        data={roles}
        searchKey="name"
        searchPlaceholder="Search roles..."
      />
    </div>
  );
}
