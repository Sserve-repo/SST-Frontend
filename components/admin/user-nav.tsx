"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings, User } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"

export function UserNav() {
  const { currentUser, logOut } = useAuth();

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-full justify-start gap-2 px-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={currentUser?.user_photo} alt="Admin" />
            <AvatarFallback>{currentUser?.firstname?.[0]}{currentUser?.lastname?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">{currentUser?.firstname} {currentUser?.lastname}</span>
            <span className="text-xs text-muted-foreground">{currentUser?.email}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{currentUser?.firstname} {currentUser?.lastname}</p>
            <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <Link href={getSettingsHref(currentUser?.user_type || "1")}>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

