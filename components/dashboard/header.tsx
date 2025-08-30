"use client";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { useAuth } from "@/context/AuthContext";
// import CartIcon from "../CartIcon";
import Link from "next/link"; 
import { useRouter } from "next/navigation";
// import { Button } from "../ui/button";
// import { Bell } from "lucide-react";
// import { Badge } from "../ui/badge";
// import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
// import { Search } from "lucide-react";
import { BsList } from "react-icons/bs";

export function Header() {
  const { toggleSidebar } = useSidebarToggle();
  const { currentUser, logOut } = useAuth();
  console.log({ currentUser });
  const router = useRouter();
    // Mock notifications data - replace with real data from your API
  // const [notifications, setNotifications] = useState([
  //   {
  //     id: 1,
  //     title: "New order received",
  //     message: "You have received a new order #1234",
  //     time: "2 min ago",
  //     read: false,
  //     type: "order",
  //   },
  //   {
  //     id: 2,
  //     title: "Payment confirmed",
  //     message: "Payment for order #1233 has been confirmed",
  //     time: "1 hour ago",
  //     read: true,
  //     type: "payment",
  //   },
  //   {
  //     id: 3,
  //     title: "New review",
  //     message: "You received a 5-star review",
  //     time: "3 hours ago",
  //     read: false,
  //     type: "review",
  //   },
  // ]);

  // const unreadCount = notifications.filter((n) => !n.read).length;

  // const markAllRead = () => {
  //   setNotifications(notifications.map((n) => ({ ...n, read: true })));
  // };

  const getUserType = (user_type: string) => {
    return user_type === "3"
      ? "Vendor"
      : user_type === "2"
      ? "Shopper"
      : user_type === "4"
      ? "Artisan"
      : null;
  };

  const getSettingsHref = (userType: string) => {
    switch (userType) {
      case "1": // Admin
        return "/admin/dashboard/settings";
      case "3": // Vendor
        return "/vendor/dashboard/settings";
      case "4": // Artisan
        return "/artisan/dashboard/settings/profile";
      case "2": // Buyer
        return "/buyer/dashboard/profile-setting";
      default:
        return "/dashboard/profile-setting";
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className=" flex h-16 items-center justify-between px-4 sm:pr-6 lg:pr-8">
        <div className="flex items-center space-x-4 md:w-[50%] ">
          {/* Sidebar Toggle */}
          <button
            onClick={toggleSidebar}
            className="text-primary rounded-md w-10 h-10 flex items-center justify-center hover:bg-purple-50 transition duration-300"
          >
            <BsList size={24} />
          </button>

          {/* Search */}
          {/* <div className="flex-grow max-w-md mx-4 sm:block hidden">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search"
                className="pl-10 py-2 border-2 border-gray-300 rounded-full text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div> */}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-6">
          {/* Cart */}
          {/* <div className="relative">
            <CartIcon />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative rounded-full"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-1 -top-1 h-4 w-4 p-0 text-xs flex items-center justify-center"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                Notifications
                <Button variant="ghost" size="sm" onClick={markAllRead}>
                  Mark all read
                </Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col items-start gap-1 p-4"
                >
                  <div className="flex w-full justify-between">
                    <span className="font-medium">{notification.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {notification.time}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {notification.description}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu> */}

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center space-x-2 cursor-pointer">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={currentUser?.user_photo}
                    alt="User Avatar"
                  />
                  <AvatarFallback>
                    {" "}
                    {currentUser?.firstname[0] + currentUser?.lastname[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-sm font-medium text-primary">
                    {currentUser?.firstname}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getUserType(currentUser?.user_type)}
                  </p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {currentUser?.firstname}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {currentUser?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href={getSettingsHref(currentUser?.user_type || "2")}>
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  router.push("/");
                  logOut();
                }}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
