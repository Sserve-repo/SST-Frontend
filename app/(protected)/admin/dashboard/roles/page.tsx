"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateRoleDialog } from "@/components/admin/roles/create-role-dialog";
import { EditRoleDialog } from "@/components/admin/users/edit-role-dialog";
import { ViewRoleDialog } from "@/components/admin/roles/view-role-dialog";
import { DeleteRoleDialog } from "@/components/admin/roles/delete-role-dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { useToast } from "@/hooks/use-toast";
import {
  getRoles,
  getRolePermissions,
  deleteRole,
} from "@/actions/admin/role-api";
import {
  Shield,
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash,
  Users,
} from "lucide-react";
import { useUrlFilters } from "@/hooks/use-url-filters";

interface Role {
  id: string;
  name: string;
  permissions: string[];
  userCount?: number;
  createdAt: string;
}

export default function RolesPage() {
  const { filters, updateFilters, clearFilters } = useUrlFilters();
  const [roles, setRoles] = useState<Role[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);
  const [roleToView, setRoleToView] = useState<string | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { toast } = useToast();

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: apiError } = await getRoles();

      if (apiError) {
        throw new Error(apiError);
      }

      console.log("Fetched roles:", data);

      if (data?.data) {
        const rolesWithPermissions = await Promise.all(
          data.data.map(async (role: any) => {
            try {
              const { data: permData } = await getRolePermissions(
                role.id.toString()
              );
              return {
                id: role.id.toString(),
                name: role.name,
                permissions:
                  permData?.permissions?.map((p: any) => p.name) || [],
                userCount: 0, // This would come from a separate API call
                createdAt: role.created_at || new Date().toISOString(),
              };
            } catch {
              return {
                id: role.id.toString(),
                name: role.name,
                permissions: [],
                userCount: 0,
                createdAt: role.created_at || new Date().toISOString(),
              };
            }
          })
        );

        setRoles(rolesWithPermissions);
        setFilteredRoles(rolesWithPermissions);
      }
    } catch (err) {
      console.error("Error fetching roles:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  useEffect(() => {
    if (filters.search) {
      const filtered = roles.filter((role) =>
        role.name.toLowerCase().includes(filters.search.toLowerCase())
      );
      setFilteredRoles(filtered);
    } else {
      setFilteredRoles(roles);
    }
  }, [filters.search, roles]);

  const handleSearch = useCallback(
    (searchValue: string) => {
      updateFilters({ search: searchValue });
    },
    [updateFilters]
  );

  const handleDeleteRole = async (roleId: string) => {
    try {
      const { error } = await deleteRole(roleId);

      if (error) {
        throw new Error(error);
      }

      toast({
        title: "Success",
        description: "Role deleted successfully.",
      });

      fetchRoles();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete role. Please try again.",
        variant: "destructive",
      });
      throw new Error(error.toString());
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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
            <div className="text-2xl font-bold">{roles.length}</div>
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
              {roles.length}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Permissions
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {roles.reduce((acc, role) => acc + role.permissions.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Assigned permissions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search roles..."
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchRoles} />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No roles found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRoles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.slice(0, 3).map((permission) => (
                            <Badge
                              key={permission}
                              variant="secondary"
                              className="text-xs"
                            >
                              {permission}
                            </Badge>
                          ))}
                          {role.permissions.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{role.permissions.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{role.userCount || 0}</TableCell>
                      <TableCell>
                        {new Date(role.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setRoleToView(role.id)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setRoleToEdit(role)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Role
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() =>
                                setRoleToDelete({
                                  id: role.id,
                                  name: role.name,
                                })
                              }
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <ViewRoleDialog
        roleId={roleToView}
        onOpenChange={(open) => !open && setRoleToView(null)}
      />

      <EditRoleDialog
        role={roleToEdit}
        onOpenChange={(open) => !open && setRoleToEdit(null)}
        onSuccess={fetchRoles}
      />

      <DeleteRoleDialog
        role={roleToDelete}
        onOpenChange={(open) => !open && setRoleToDelete(null)}
        onConfirm={(roleId) => {
          handleDeleteRole(roleId);
          setRoleToDelete(null);
        }}
      />
    </div>
  );
}
