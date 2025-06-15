"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserForm } from "./user-form";
import type { User } from "@/types/users";
import { createUser } from "@/actions/admin/user-api";

interface CreateUserDialogProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

export function CreateUserDialog({
  children,
  onSuccess,
}: CreateUserDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (
    data: Omit<User, "id" | "joinedDate" | "lastActive">
  ) => {
    // Handle user creation here
    console.log("Creating user:", data);
    const payload = new FormData();
    payload.append("first_name", data.firstName);
    payload.append("last_name", data.lastName);
    payload.append("email", data.email);
    payload.append("phone", data.phone);
    payload.append("password", data.password);
    payload.append("password_confirmation", data.passwordConfirmation);

    createUser(payload);

    setOpen(false);
  };

  if (onSuccess) {
    // Call onSuccess callback if provided
    onSuccess();
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
  );
}
