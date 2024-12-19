"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Settings,
  LogOut,
} from "lucide-react";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import Image from "next/image";
import { TbChartArcs } from "react-icons/tb";
import { HiOutlineArchive } from "react-icons/hi";
import { RiShoppingBag3Line } from "react-icons/ri";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { title: "Overview", href: "/dashboard", icon: TbChartArcs },
  { title: "Orders", href: "/dashboard/orders", icon: RiShoppingBag3Line },
  { title: "Inbox", href: "/dashboard/inbox", icon: HiOutlineArchive },
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
            ? "w-[240px] translate-x-0"
            : "w-[240px] translate-x-0 lg:relative",
          isMobile && isCollapsed && "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col px-3">
          {/* Logo Section */}
          <div className="flex items-center justify-start h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/assets/images/logo.svg"
                alt="Logo"
                width={160}
                height={50}
              />
            </Link>
          </div>

          {/* Navigation Items */}
          <ScrollArea className="flex-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className={cn(
                  "w-full flex items-center justify-start px-3.5 py-3 my-2 rounded-lg text-left group",
                  pathname === item.href
                    ? "bg-primary text-white"
                    : "text-primary hover:bg-purple-50"
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon
                    className={cn(
                      "mr-4 h-5 w-5 group-hover:text-purple-900 transition-all",
                      pathname === item.href && "text-white",
                      isCollapsed ? "h-6 w-6 mx-auto" : "h-5 w-5 mr-4"
                    )}
                  />
                  {!isCollapsed && (
                    <span className="truncate">{item.title}</span>
                  )}
                </Link>
              </Button>
            ))}
          </ScrollArea>

          {/* Footer Section */}
          <div className="mt-auto space-y-2 border-t py-4">
            <Button
              variant="ghost"
              className="w-full flex items-center justify-start px-3.5 py-3 rounded-lg text-left text-primary hover:bg-purple-50"
              asChild
            >
              <Link href="/settings">
                <Settings
                  className={cn(
                    "mr-4 h-5 w-5 transition-all",
                    pathname === "/settings" && "text-white",
                    isCollapsed ? "h-6 w-6 mx-auto" : "h-5 w-5 mr-4"
                  )}
                />
                {!isCollapsed && <span className="truncate">Settings</span>}
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-start px-3.5 py-3 rounded-lg text-left text-red-600 hover:bg-red-50"
            >
              <LogOut
                className={cn(
                  "mr-4 h-5 w-5 transition-all",
                  isCollapsed ? "h-6 w-6 mx-auto" : "h-5 w-5 mr-4"
                )}
              />
              {!isCollapsed && <span className="truncate">Logout</span>}
            </Button>
          </div>
        </div>
      </nav>
    </>
  );
}
