"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  ShoppingCart,
  Clock,
  TruckIcon,
  Star,
  Inbox,
  Heart,
  Settings,
  LogOut,
} from "lucide-react";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import Image from "next/image";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { title: "OrderList", href: "/dashboard/ordersPage", icon: Clock },
  { title: "Track Orders", href: "/dashboard/track", icon: TruckIcon },
  { title: "Reviews and Ratings", href: "/dashboard/reviews", icon: Star },
  { title: "Inbox", href: "/dashboard/inbox", icon: Inbox },
  { title: "Favorites", href: "/dashboard/favorites", icon: Heart },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebarToggle();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <>
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-gray-800/15 backdrop-blur-sm z-40"
          onClick={toggleSidebar}
        />
      )}
      <nav
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-white transition-all duration-300 ease-in-out border-r",
          isCollapsed
            ? "w-[70px] translate-x-0"
            : isMobile
            ? "w-[280px] translate-x-0"
            : "w-[280px] translate-x-0 lg:relative",
          isMobile && isCollapsed && "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between h-16 px-4 py-1">
            <Link href="/" className="flex items-center space-x-2">
              {!isCollapsed && (
                <span className="font-bold">
                  <Image
                    src="/assets/images/logo.svg"
                    alt="Logo"
                    width={160}
                    height={30}
                  />
                </span>
              )}
            </Link>
            {/* <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              aria-label="Toggle Navigation"
            >
              {isCollapsed ? (
                <Menu className="h-5 w-5" />
              ) : (
                <X className="h-5 w-5" />
              )}
            </Button> */}
          </div>

          <ScrollArea className="flex-1 w-full py-2">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "justify-start w-full mx-1 my-1",
                  pathname === item.href && "bg-muted"
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-5 w-5" />
                  {!isCollapsed && (
                    <span className="truncate">{item.title}</span>
                  )}
                </Link>
              </Button>
            ))}
          </ScrollArea>

          <div className="mt-auto border-t space-y-1 py-4">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-5 w-5" />
                {!isCollapsed && "Settings"}
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground"
            >
              <LogOut className="mr-2 h-45w-5" />
              {!isCollapsed && "Logout"}
            </Button>
          </div>
        </div>
      </nav>
    </>
  );
}
