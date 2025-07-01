"use client";

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

interface DeleteRoleDialogProps {
  role: { id: string; name: string } | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (roleId: string) => void;
}

export function DeleteRoleDialog({
  role,
  onOpenChange,
  onConfirm,
}: DeleteRoleDialogProps) {
  if (!role) return null;

  return (
    <AlertDialog open={!!role} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Role</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the role &quot;{role.name}&quot;?
            This action cannot be undone and will remove all associated
            permissions.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(role.id)}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete Role
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
