"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { UserForm } from "./user-form"
import type { User } from "@/types/users"

interface CreateUserDialogProps {
  children: React.ReactNode
  onSuccess?: () => void
}

export function CreateUserDialog({ children, onSuccess }: CreateUserDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSubmit = (data: Omit<User, "id" | "joinedDate" | "lastActive">) => {
    // Handle user creation here
    console.log("Creating user:", data)
    setOpen(false)
  }

  if (onSuccess) {
    // Call onSuccess callback if provided
    onSuccess()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>
        <UserForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

