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
  user: {
    id: string;
    active_status: number;
    firstname?: string;
    lastname?: string;
    email?: string;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function BanUserDialog({
  user,
  open,
  onOpenChange,
  onSuccess,
}: BanUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return "Unknown User";
    const fullName = `${user.firstname || ""} ${user.lastname || ""}`.trim();
    return fullName || user.email || "Unknown User";
  };

  const handleBanUser = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("active_status", "0"); // 0 = banned/inactive

      const { error } = await updateUserStatus(user.id, formData);

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
<<<<<<< HEAD
      console.log(error)
=======
      console.error("Failed to ban user:", error);
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
>>>>>>> origin/lastest-update
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
    if (!user) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("active_status", "1"); // 1 = active

      const { error } = await updateUserStatus(user.id, formData);

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
<<<<<<< HEAD
      console.log(error)
      toast({
        title: "Error",
        description: "Failed to unban user. Please try again.",
        variant: "destructive",
      });
=======
      console.error("Failed to unban user:", error);
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: "Failed to unban user. Please try again.",
          variant: "destructive",
        });
      }
>>>>>>> origin/lastest-update
    } finally {
      setIsLoading(false);
    }
  };

  const isUserBanned = user?.active_status === 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isUserBanned ? "Unban User" : "Ban User"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to {isUserBanned ? "unban" : "ban"}{" "}
            <strong>{getUserDisplayName()}</strong>? This will{" "}
            {isUserBanned ? "restore" : "restrict"} their ability to access the
            platform.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          {isUserBanned ? (
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
          ) : (
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
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
