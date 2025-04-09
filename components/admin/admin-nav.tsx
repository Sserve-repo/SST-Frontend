"use client"

import { BarChart3, Users, Package, Calendar, Bell, LifeBuoy, CalendarClock, Megaphone, Settings, BarChart2 } from "lucide-react"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

const menuItems = [
  {
    title: "Overview",
    icon: BarChart3,
    href: "/admin",
  },
  {
    title: "User Management",
    icon: Users,
    href: "/admin/users",
  },
  {
    title: "Services & Products",
    icon: Package,
    href: "/admin/services",
  },
  {
    title: "Bookings & Orders",
    icon: Calendar,
    href: "/admin/orders",
  },
  {
    title: "Notifications",
    icon: Bell,
    href: "/admin/notifications",
  },
  {
    title: "Support",
    icon: LifeBuoy,
    href: "/admin/support",
  },
  {
    title: "Events",
    icon: CalendarClock,
    href: "/admin/events",
  },
  {
    title: "Marketing",
    icon: Megaphone,
    href: "/admin/marketing",
  },
  {
    title: "Analytics",
    icon: BarChart2,
    href: "/admin/analytics",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
            <Link href={item.href}>
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

