"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import {
  updateRole,
  getPermissions,
  type GroupedPermissions,
} from "@/actions/admin/role-api";

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

interface EditRoleDialogProps {
  role: Role | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditRoleDialog({
  role,
  onOpenChange,
  onSuccess,
}: EditRoleDialogProps) {
  const [loading, setLoading] = useState(false);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<GroupedPermissions>({});
  const { toast } = useToast();

  useEffect(() => {
    if (role) {
      setRoleName(role.name);
      setSelectedPermissions(role.permissions);
      fetchPermissions();
    }
  }, [role]);

  const fetchPermissions = async () => {
    setPermissionsLoading(true);
    try {
      const { data, error } = await getPermissions();

      if (error) {
        throw new Error(error);
      }

      if (data?.Permissions) {
        setPermissions(data.Permissions);
      }
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
      toast({
        title: "Error",
        description: "Failed to load permissions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPermissionsLoading(false);
    }
  };

  const handlePermissionChange = (permissionName: string, checked: boolean) => {
    setSelectedPermissions((prev) =>
      checked
        ? [...prev, permissionName]
        : prev.filter((p) => p !== permissionName)
    );
  };

  const handleSelectAllInCategory = (category: string, checked: boolean) => {
    const categoryPermissions = permissions[category]?.map((p) => p.name) || [];

    setSelectedPermissions((prev) =>
      checked
        ? [
            ...prev.filter((p) => !categoryPermissions.includes(p)),
            ...categoryPermissions,
          ]
        : prev.filter((p) => !categoryPermissions.includes(p))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roleName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a role name.",
        variant: "destructive",
      });
      return;
    }

    if (!role) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", roleName);

      // Add each permission as a separate form field
      selectedPermissions.forEach((permission) => {
        formData.append("permission[]", permission);
      });

      const { error } = await updateRole(role.id, formData);

      if (error) {
        throw new Error(error);
      }

      toast({
        title: "Success",
        description: "Role updated successfully.",
      });

      onSuccess();
    } catch (error) {
      console.error("Failed to update role:", error);
      toast({
        title: "Error",
        description: "Failed to update role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={!!role} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Edit Role: {role?.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="roleName">Role Name</Label>
            <Input
              id="roleName"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Enter role name..."
              required
            />
          </div>

          <div className="space-y-4">
            <Label>Permissions</Label>
            {permissionsLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : (
              <ScrollArea className="h-[300px] border rounded-md p-4">
                <div className="space-y-6">
                  {Object.entries(permissions).map(
                    ([category, categoryPermissions]) => {
                      const allSelected = categoryPermissions.every((p) =>
                        selectedPermissions.includes(p.name)
                      );
                      const someSelected = categoryPermissions.some((p) =>
                        selectedPermissions.includes(p.name)
                      );

                      return (
                        <div key={category} className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`category-${category}`}
                              checked={allSelected}
                              ref={(el) => {
                                if (el)
                                  el.indeterminate =
                                    someSelected && !allSelected;
                              }}
                              onCheckedChange={(checked) =>
                                handleSelectAllInCategory(
                                  category,
                                  checked as boolean
                                )
                              }
                            />
                            <Label
                              htmlFor={`category-${category}`}
                              className="text-sm font-medium capitalize"
                            >
                              {category} ({categoryPermissions.length})
                            </Label>
                          </div>

                          <div className="ml-6 space-y-2">
                            {categoryPermissions.map((permission) => (
                              <div
                                key={permission.id}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`permission-${permission.id}`}
                                  checked={selectedPermissions.includes(
                                    permission.name
                                  )}
                                  onCheckedChange={(checked) =>
                                    handlePermissionChange(
                                      permission.name,
                                      checked as boolean
                                    )
                                  }
                                />
                                <Label
                                  htmlFor={`permission-${permission.id}`}
                                  className="text-sm text-muted-foreground"
                                >
                                  {permission.name}
                                </Label>
                              </div>
                            ))}
                          </div>

                          {Object.keys(permissions).indexOf(category) <
                            Object.keys(permissions).length - 1 && (
                            <Separator />
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </ScrollArea>
            )}

            {selectedPermissions.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {selectedPermissions.length} permission(s) selected
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || permissionsLoading}>
              {loading ? "Updating..." : "Update Role"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
