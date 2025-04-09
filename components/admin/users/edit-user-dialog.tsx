"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import  {UserForm}  from "@/components/admin/users/user-form"
import type { User } from "@/types/users"

interface EditUserDialogProps {
  user: User | null
  onOpenChange: (open: boolean) => void
}

export function EditUserDialog({ user, onOpenChange }: EditUserDialogProps) {
  if (!user) return null

  const handleSubmit = (data: Omit<User, "id" | "joinedDate" | "lastActive">) => {
    // Handle user update here
    console.log("Updating user:", { ...data, id: user.id })
    onOpenChange(false)
  }

  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit User Details</DialogTitle>
        </DialogHeader>
        <UserForm user={user} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

