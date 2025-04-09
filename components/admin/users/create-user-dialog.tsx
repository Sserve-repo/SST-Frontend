"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { UserForm } from "./user-form"
import type { User } from "@/types/users"

interface CreateUserDialogProps {
  children: React.ReactNode
}

export function CreateUserDialog({ children }: CreateUserDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSubmit = (data: Omit<User, "id" | "joinedDate" | "lastActive">) => {
    // Handle user creation here
    console.log("Creating user:", data)
    setOpen(false)
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

