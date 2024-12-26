"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { BsList } from "react-icons/bs";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { useAuth } from "@/context/AuthContext";
import CartIcon from "../CartIcon";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Header() {
  const { toggleSidebar } = useSidebarToggle();
  const { currentUser, logOut } = useAuth();
  const router = useRouter();

  const getUserType = (user_type: string) => {
    return user_type === "3"
      ? "Vendor"
      : user_type === "2"
      ? "Shopper"
      : user_type === "4"
      ? "Artisan"
      : null;
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
          <div className="flex-grow max-w-md mx-4 sm:block hidden">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search"
                className="pl-10 py-2 border-2 border-gray-300 rounded-full text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-6">
          {/* Cart */}
          <div className="relative">
            <CartIcon />
          </div>

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
              <Link href={"/dashboard/profile-setting"}>
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
