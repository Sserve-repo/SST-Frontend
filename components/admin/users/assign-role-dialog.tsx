"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { assignRoleToUser } from "@/actions/admin/role-api";
import type { User } from "@/types/users";

interface AssignRoleDialogProps {
  user: User | null;
  roles: any[];
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AssignRoleDialog({
  user,
  roles,
  onOpenChange,
  onSuccess,
}: AssignRoleDialogProps) {
  const [selectedRole, setSelectedRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAssignRole = async () => {
    if (!user || !selectedRole) return;

    setIsLoading(true);
    try {
      const { error } = await assignRoleToUser(user.id, selectedRole);

      if (error) {
        throw new Error(error);
      }

      toast({
        title: "Success",
        description: `Role assigned to ${user.firstName} ${user.lastName} successfully.`,
      });

      onSuccess?.();
      onOpenChange(false);
      setSelectedRole("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Role</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Assign a role to{" "}
              <span className="font-medium">
                {user.firstName} {user.lastName}
              </span>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Select Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssignRole}
            disabled={!selectedRole || isLoading}
          >
            {isLoading ? "Assigning..." : "Assign Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
