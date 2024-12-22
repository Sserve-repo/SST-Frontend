"use client";

import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function PageWrapper({ children }: { children: ReactNode }) {
  const { isCollapsed } = useSidebarToggle();

  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto transition-all duration-300 ease-in-out",
        isCollapsed ? "lg:ml-[64px]" : "lg:ml-[0px]",
        "sm:pl-1.5"
      )}
    >
      {children}
    </div>
  );
}
