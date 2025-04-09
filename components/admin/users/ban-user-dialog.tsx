"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { User } from "@/types/users"

interface BanUserDialogProps {
  user: User | null
  onOpenChange: (open: boolean) => void
}

export function BanUserDialog({ user, onOpenChange }: BanUserDialogProps) {
  if (!user) return null

  const isBanned = user.status === "banned"
  const action = isBanned ? "unban" : "ban"

  const handleAction = () => {
    // Handle user ban/unban here
    console.log(`${action}ning user:`, user.id)
    onOpenChange(false)
  }

  return (
    <AlertDialog open={!!user} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{isBanned ? "Unban User Account" : "Ban User Account"}</AlertDialogTitle>
          <AlertDialogDescription>
            {isBanned
              ? `Are you sure you want to unban ${user.name}'s account? They will regain access to all platform features.`
              : `Are you sure you want to ban ${user.name}'s account? They will lose access to all platform features until unbanned.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleAction}
            className={isBanned ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
          >
            {isBanned ? "Unban Account" : "Ban Account"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

