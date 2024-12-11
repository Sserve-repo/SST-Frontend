"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Search, Bell } from "lucide-react";
import { BsList } from "react-icons/bs";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";

export function Header() {
  const {  toggleSidebar } = useSidebarToggle();

  return (
    <>
    
    <header className="sticky top-0 z-50 w-full border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background">
      <div className="container flex h-16 items-center justify-between">
        <button 
          onClick={toggleSidebar} 
          className=" bg-sidebar-muted text-sidebar-muted-foreground ml-4 rounded-md w-[30px] h-[30px] flex items-center justify-center transition duration-300 ease-in-out"
        >
          <BsList size={24} />
        </button>

        {/* Search */}
        <div className="flex items-center space-x-2 md:justify-end">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="pl-8 md:w-[300px] lg:w-[400px]"
            />
          </div>
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/01.png" alt="Avatar" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Jonathan Doe
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    jonathan@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
    </>
  );
}
