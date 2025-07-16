"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getRolePermissions } from "@/actions/admin/role-api";
import { Shield, Users } from "lucide-react";

type Permission = {
  id: string | number;
  name: string;
};

interface RoleData {
  permissions: Permission[];
  groupedPermissions: Record<string, Permission[]>;
}

interface ViewRoleDialogProps {
  roleId: string | null;
  onOpenChange: (open: boolean) => void;
}

export function ViewRoleDialog({ roleId, onOpenChange }: ViewRoleDialogProps) {
  const [roleData, setRoleData] = useState<RoleData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRoleData = useCallback(async () => {
    if (!roleId) return;

    setLoading(true);
    try {
      const response = await getRolePermissions(roleId);
      console.log("Fetching role data:", response?.data);
      if (response?.data?.data) {
        setRoleData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching role data:", error);
    } finally {
      setLoading(false);
    }
  }, [roleId]);

  useEffect(() => {
    if (roleId) {
      fetchRoleData();
    }
  }, [roleId, fetchRoleData]);

  if (!roleId) return null;

  return (
    <Dialog open={!!roleId} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>View Role Details</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : roleData ? (
          <div className="space-y-6">
            {/* Role Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Role Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="font-semibold">Role ID:</span> {roleId}
                </div>
                <div>
                  <span className="font-semibold">Permissions Count:</span>{" "}
                  {roleData.permissions?.length || 0}
                </div>
              </CardContent>
            </Card>

            {/* Permissions by Category */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Grouped Permissions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {roleData.groupedPermissions &&
                  (
                    Object.entries(roleData.groupedPermissions) as [
                      string,
                      Permission[]
                    ][]
                  ).map(([category, permissions]) => (
                    <div key={category} className="space-y-1">
                      <h4 className="text-sm font-medium capitalize text-muted-foreground">
                        {category}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {permissions.map((perm) => (
                          <Badge key={perm.id} variant="secondary">
                            {perm.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                {!Object.keys(roleData.groupedPermissions || {}).length && (
                  <p className="text-sm text-muted-foreground">
                    No grouped permissions found.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* All Permissions */}
            <Card>
              <CardHeader>
                <CardTitle>All Permissions</CardTitle>
              </CardHeader>
              <CardContent>
                {roleData.permissions?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {roleData.permissions.map((perm) => (
                      <Badge key={perm.id} variant="outline">
                        {perm.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No permissions assigned to this role.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Failed to load role data
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
