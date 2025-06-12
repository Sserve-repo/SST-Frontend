"use client";

import type React from "react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Loader2 } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Role {
  id: number;
  name: string;
}

interface AssignRoleDialogProps {
  user: User | null;
  roles: Role[];
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AssignRoleDialog({
  user,
  roles,
  onOpenChange,
  onSuccess,
}: AssignRoleDialogProps) {
  const [selectedRole, setSelectedRole] = useState("");
  const { toast } = useToast();

  const assignRoleMutation = useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      assignRoleToUser(userId, roleId),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Role assigned successfully.",
      });
      setSelectedRole("");
      onOpenChange(false);
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to assign role.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole) {
      toast({
        title: "Error",
        description: "Please select a role.",
        variant: "destructive",
      });
      return;
    }

    if (!user) return;

    assignRoleMutation.mutate({
      userId: user.id,
      roleId: selectedRole,
    });
  };

  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Role to {user?.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Select Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a role..." />
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

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={assignRoleMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={assignRoleMutation.isPending}>
              {assignRoleMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                "Assign Role"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
