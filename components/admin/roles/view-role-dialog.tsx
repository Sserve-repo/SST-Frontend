"use client";

import { useState, useEffect } from "react";
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

interface ViewRoleDialogProps {
  roleId: string | null;
  onOpenChange: (open: boolean) => void;
}

export function ViewRoleDialog({ roleId, onOpenChange }: ViewRoleDialogProps) {
  const [roleData, setRoleData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (roleId) {
      fetchRoleData();
    }
  }, [roleId]);

  const fetchRoleData = async () => {
    if (!roleId) return;

    setLoading(true);
    try {
      const { data, error } = await getRolePermissions(roleId);
      if (!error && data) {
        setRoleData(data);
      }
    } catch (error) {
      console.error("Error fetching role data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!roleId) return null;

  return (
    <Dialog open={!!roleId} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Role Details</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : roleData ? (
          <div className="space-y-6">
            {/* Role Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Role Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Role ID:</span> {roleId}
                  </div>
                  <div>
                    <span className="font-medium">Total Permissions:</span>{" "}
                    {roleData.permissions?.length || 0}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Permissions by Category */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Permissions by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {roleData.groupedPermissions &&
                    Object.entries(roleData.groupedPermissions).map(
                      ([category, permissions]: [string, any]) => (
                        <div key={category} className="space-y-2">
                          <h4 className="font-medium capitalize text-sm">
                            {category}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {permissions.map((permission: any) => (
                              <Badge key={permission.id} variant="secondary">
                                {permission.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                </div>
              </CardContent>
            </Card>

            {/* All Permissions */}
            <Card>
              <CardHeader>
                <CardTitle>All Permissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {roleData.permissions?.map((permission: any) => (
                    <Badge key={permission.id} variant="outline">
                      {permission.name}
                    </Badge>
                  ))}
                </div>
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
