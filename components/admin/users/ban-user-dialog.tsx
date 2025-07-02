"use client";

import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { updateUserStatus } from "@/actions/admin/user-api";
import type { User } from "@/types/users";

interface BanUserDialogProps {
  user: User | null;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function BanUserDialog({
  user,
  onOpenChange,
  onSuccess,
}: BanUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = async () => {
    if (!user) return;

    const newStatus = user.status === "banned" ? "active" : "banned";
    const action = newStatus === "banned" ? "ban" : "unban";

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("active_status", newStatus === "active" ? "1" : "0");

      const { error } = await updateUserStatus(user.id, formData);

      if (error) {
        throw new Error(error);
      }

      toast({
        title: "Success",
        description: `User ${user.firstName} ${user.lastName} ${action}ned successfully.`,
      });

      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to ${action} user. Please try again.`,
        variant: "destructive",
      });
      throw new Error(error.toString());
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  const isBanned = user.status === "banned";
  const action = isBanned ? "unban" : "ban";

  return (
    <AlertDialog open={!!user} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{isBanned ? "Unban" : "Ban"} User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to {action}{" "}
            <span className="font-medium">
              {user.firstName} {user.lastName}
            </span>
            ?
            {isBanned
              ? " This will restore their access to the platform."
              : " This will prevent them from accessing the platform."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleStatusChange}
            disabled={isLoading}
            className={
              isBanned
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }
          >
            {isLoading ? `${action}ning...` : `${action} User`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
