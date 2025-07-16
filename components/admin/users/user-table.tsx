"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ban, Edit, MoreHorizontal, Trash2, Eye, UserCog } from "lucide-react";
import { EditUserDialog } from "./edit-user-dialog";
import { DeleteUserDialog } from "./delete-user-dialog";
import { BanUserDialog } from "./ban-user-dialog";
import { AssignRoleDialog } from "./assign-role-dialog";
import { ViewUserDialog } from "./view-user-dialog";
import { cn } from "@/lib/utils";
import type { User } from "@/types/users";

interface UserTableProps {
  users: User[];
  roles?: any[];
  onRefresh?: () => void;
}

export function UserTable({ users, roles = [], onRefresh }: UserTableProps) {
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToBan, setUserToBan] = useState<any | null>(null);
  const [userToAssignRole, setUserToAssignRole] = useState<User | null>(null);
  const [userToView, setUserToView] = useState<string | null>(null);

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "capitalize",
                      user.role === "admin" && "bg-[#5D3A8B]/10 text-primary",
                      user.role === "vendor" && "bg-blue-100 text-blue-600",
                      user.role === "artisan" && "bg-green-100 text-green-600",
                      user.role === "shopper" && "bg-orange-100 text-orange-600"
                    )}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn(
                      user.status === "active" && "bg-green-100 text-green-600",
                      user.status === "banned" && "bg-red-100 text-red-600",
                      user.status === "pending" &&
                        "bg-yellow-100 text-yellow-600"
                    )}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(user.joinedDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(user.lastActive).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setUserToView(user.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setUserToEdit(user)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setUserToAssignRole(user)}
                      >
                        <UserCog className="mr-2 h-4 w-4" />
                        Assign Role
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setUserToBan(user)}>
                        <Ban className="mr-2 h-4 w-4" />
                        {user.status === "banned" ? "Unban User" : "Ban User"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setUserToDelete(user)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ViewUserDialog
<<<<<<< HEAD
        userId={userToView?.id as string}
=======
        userId={userToView}
>>>>>>> origin/lastest-update
        onOpenChange={(open) => !open && setUserToView(null)}
      />

      <EditUserDialog
        userId={userToEdit?.id as string}
        user={userToEdit}
        onOpenChange={(open) => !open && setUserToEdit(null)}
        onSuccess={onRefresh}
      />

      <AssignRoleDialog
        user={userToAssignRole}
        roles={roles}
        onOpenChange={(open) => !open && setUserToAssignRole(null)}
        onSuccess={onRefresh}
      />

      <DeleteUserDialog
        user={userToDelete}
        onOpenChange={(open) => !open && setUserToDelete(null)}
        onSuccess={onRefresh}
      />

      <BanUserDialog
        userId={userToBan?.id as string}
        onOpenChange={(open) => !open && setUserToBan(null)}
        onSuccess={onRefresh}
        open={!!userToBan}
      />
    </>
  );
}
