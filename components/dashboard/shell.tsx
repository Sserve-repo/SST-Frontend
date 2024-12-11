"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingCart,
  Clock,
  TruckIcon as TruckDelivery,
  Star,
  Inbox,
  Heart,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { title: "Overview", href: "/", icon: LayoutDashboard },
  { title: "Orders", href: "/orders", icon: ShoppingCart },
  { title: "Order History", href: "/history", icon: Clock },
  { title: "Track Orders", href: "/track", icon: TruckDelivery },
  { title: "Reviews", href: "/reviews", icon: Star },
  { title: "Inbox", href: "/inbox", icon: Inbox },
  { title: "Favorites", href: "/favorites", icon: Heart },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <nav
        className={cn(
          "fixed inset-y-0 z-50 flex h-full flex-col bg-background border-r transition-all duration-300",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex h-14 items-center justify-between px-4 border-b">
          <Link href="/" className="flex items-center space-x-2">
            <span
              className={cn(
                "font-bold text-lg transition-opacity",
                isCollapsed && "opacity-0"
              )}
            >
              SphereServe
            </span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center p-3 rounded-md transition hover:bg-muted",
                  pathname === item.href && "bg-muted"
                )}
              >
                <item.icon className="h-5 w-5 text-muted-foreground" />
                {!isCollapsed && (
                  <span className="ml-4 text-sm font-medium">{item.title}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
        <div className="p-4">
          <Link href="/settings">
            <div className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md">
              <Settings className="h-5 w-5 text-muted-foreground" />
              {!isCollapsed && <span>Settings</span>}
            </div>
          </Link>
          <button className="flex w-full items-center space-x-2 p-2 text-muted-foreground hover:bg-muted rounded-md">
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 flex items-center justify-between bg-background p-4 border-b">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label="Toggle Sidebar"
            className="p-2 text-muted-foreground"
          >
            {isCollapsed ? (
              <Menu className="h-5 w-5" />
            ) : (
              <X className="h-5 w-5" />
            )}
          </button>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search"
              className="hidden sm:block w-64 border rounded-md px-3 py-2 text-sm"
            />
            <button
              className="p-2 text-muted-foreground"
              aria-label="Notifications"
            >
              <Inbox className="h-5 w-5" />
            </button>
            <div className="relative flex items-center space-x-2">
              <img
                src="/avatars/01.png"
                alt="Avatar"
                className="h-8 w-8 rounded-full"
              />
              <span className="hidden sm:block text-sm font-medium">
                John Doe
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
