"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type React from "react"; 

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter();
  const { currentUser, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (allowedRoles && !allowedRoles.includes(currentUser?.user_type)) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, currentUser, router, allowedRoles]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
