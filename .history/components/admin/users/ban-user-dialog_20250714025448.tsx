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
import { Loader2 } from "lucide-react";

interface BanUserDialogProps {
  userId: string | null;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function BanUserDialog({
  userId,
  onOpenChange,
  onSuccess,
}: BanUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleBanUser = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("active_status", "0"); // 0 = banned/inactive

      const { error } = await updateUserStatus(userId, formData);

      if (error) {
        throw new Error(error);
      }

      toast({
        title: "Success",
        description: "User has been banned successfully.",
      });

      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to ban user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnbanUser = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("active_status", "1"); // 1 = active

      const { error } = await updateUserStatus(userId, formData);

      if (error) {
        throw new Error(error);
      }

      toast({
        title: "Success",
        description: "User has been unbanned successfully.",
      });

      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: "Failed to unban user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={!!userId} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ban/Unban User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to change this user&lsquo;s status? This will
            affect their ability to access the platform.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleBanUser}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Ban User"
            )}
          </AlertDialogAction>
          <AlertDialogAction
            onClick={handleUnbanUser}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Unban User"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
