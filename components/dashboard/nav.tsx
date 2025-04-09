"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Settings,
  LogOut,
  ShoppingBag,
  MessageSquare,
  Tag,
  BriefcaseBusiness,
  Calendar,
  Star,
  LineChart,
  CalendarClock,
  LayoutDashboard,
  MessageSquareMore,
  Users,
  Package,
  LifeBuoy,
  Megaphone,
  BarChart2,
} from "lucide-react";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import Image from "next/image";
import { TbChartArcs } from "react-icons/tb";
import { HiOutlineArchive } from "react-icons/hi";
import { RiShoppingBag3Line } from "react-icons/ri";
import { useAuth } from "@/context/AuthContext";

const getNavItems = (userType: string) => {
  const baseItems = [
    { title: "Inbox", href: "/dashboard/inbox", icon: MessageSquare },
  ];

  const vendorItems = [
    { title: "Overview", href: "/vendor/dashboard", icon: LayoutDashboard },
    {
      title: "Inventory Management",
      href: "/vendor/dashboard/inventory",
      icon: ShoppingBag,
    },
    {
      title: "Orders Management",
      href: "/vendor/dashboard/orders",
      icon: RiShoppingBag3Line,
    },
    {
      title: "Promotions",
      href: "/vendor/dashboard/promotions",
      icon: Tag,
    },
    {
      title: "Events",
      href: "/vendor/dashboard/events",
      icon: CalendarClock,
    },
    {
      title: "Messages",
      href: "/vendor/dashboard/messages",
      icon: MessageSquareMore,
    },
  ];

  const artisanItems = [
    { title: "Overview", href: "/artisan/dashboard", icon: LayoutDashboard },
    {
      title: "Services",
      href: "/artisan/dashboard/services",
      icon: BriefcaseBusiness,
    },
    {
      title: "Appointments",
      href: "/artisan/dashboard/appointments",
      icon: Calendar,
    },
    {
      title: "Promotions",
      href: "/artisan/dashboard/promotions",
      icon: Tag,
    },
    {
      title: "Events",
      href: "/artisan/dashboard/events",
      icon: CalendarClock,
    },
    {
      title: "Messages",
      href: "/artisan/dashboard/messages",
      icon: MessageSquareMore,
    },
  ];

  const shopperItems = [
    { title: "Overview", href: "/buyer/dashboard", icon: TbChartArcs },
    {
      title: "My Orders",
      href: "/buyer/dashboard/orders",
      icon: ShoppingBag,
    },
    {
      title: "Saved Items",
      href: "/buyer/dashboard/saved",
      icon: HiOutlineArchive,
    },
    { title: "Inbox", href: "/buyer/dashboard/inbox", icon: MessageSquare },
  ];
  const adminItems = [
    { title: "Overview", href: "/admin/dashboard", icon: TbChartArcs },
    {
      title: "User Management",
      href: "/admin/dashboard/users",
      icon: Users,
    },
    {
      title: "Products & Services",
      href: "/admin/dashboard/services",
      icon: Package,
    },
    {
      title: "Bookings & Orders",
      href: "/admin/dashboard/orders",
      icon: Calendar,
    },
    {
      title: "Notifications",
      href: "/admin/dashboard/notifications",
      icon: Calendar,
    },
    {
      title: "Support",
      href: "/admin/dashboard/support",
      icon: LifeBuoy,
    },
    {
      title: "Marketing",
      href: "/admin/dashboard/marketing",
      icon: Megaphone,
    },
    {
      title: "Analytics",
      href: "/admin/dashboard/analytics",
      icon: BarChart2,
    },
    {
      title: "Events",
      href: "/admin/dashboard/events",
      icon: CalendarClock,
    },
    // { title: "Inbox", href: "/buyer/dashboard/inbox", icon: MessageSquare },
  ];

  switch (userType) {
    case "3": // Vendor
      return [...vendorItems];
    case "4": // Artisan
      return [...artisanItems];
    case "2": // Shopper
      return [...shopperItems];
    case "1": // Admin
      return [...adminItems];
    default:
      return baseItems;
  }
};

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logOut, currentUser } = useAuth();
  const { isCollapsed, toggleSidebar } = useSidebarToggle();
  const [isMobile, setIsMobile] = useState(false);

  const navItems = getNavItems(currentUser?.user_type);

  const handleLogOut = () => {
    router.push("/");
    logOut();
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }

    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [router, isAuthenticated]);

  return (
    <>
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-gray-800/15 backdrop-blur-sm z-40"
          onClick={toggleSidebar}
        />
      )}
      <div
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

          <div className="mt-auto space-y-2 border-t py-4">
            <Button
              variant="ghost"
              className="w-full flex items-center justify-start px-3.5 py-3 rounded-lg text-left text-primary hover:bg-purple-50"
              asChild
            >
              <Link href="/dashboard/profile-setting">
                <Settings
                  className={cn(
                    "mr-4 h-5 w-5 transition-all",
                    pathname === "/dashboard/profile-setting" && "text-white",
                    isCollapsed ? "h-6 w-6 mx-auto" : "h-5 w-5 mr-4"
                  )}
                />
                {!isCollapsed && <span className="truncate">Settings</span>}
              </Link>
            </Button>
            <Button
              onClick={handleLogOut}
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
      </div>
    </>
  );
}
