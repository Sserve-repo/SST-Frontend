
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  UserPlus,
  Filter
} from "lucide-react";
import UserFormDialog from "./UserFormDialog";
import AssignRolesDialog from "./AssignRolesDialog";
import { IUser } from "@/types/rbac";
import DeleteConfirmDialog from "../delete-confirm-dialog";

interface UsersListProps {
  users: IUser[];
  onAddUser: (user: Omit<IUser, "id">) => void;
  onUpdateUser: (user: IUser) => void;
  onDeleteUser: (id: string) => void;
  onAssignRoles: (userId: string, roleIds: string[]) => void;
}

const UsersList: React.FC<UsersListProps> = ({
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onAssignRoles
}) => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignRolesDialogOpen, setAssignRolesDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const handleEdit = (user: IUser) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleDelete = (user: IUser) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleAssignRoles = (user: IUser) => {
    setSelectedUser(user);
    setAssignRolesDialogOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Users</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      user.status === "active" 
                        ? "bg-green-100 text-green-800 hover:bg-green-100" 
                        : "bg-red-100 text-red-800 hover:bg-red-100"
                    }
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map(role => (
                      <Badge key={role.id} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {role.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(user)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAssignRoles(user)}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Assign Roles
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(user)}
                        className="text-red-600 focus:text-red-700"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add User Dialog */}
      <UserFormDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={(data) => {
          onAddUser({ ...data, roles: [] });
          setAddDialogOpen(false);
        }}
      />

      {/* Edit User Dialog */}
      {selectedUser && (
        <UserFormDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          user={selectedUser}
          onSubmit={(data) => {
            onUpdateUser({ ...data, id: selectedUser.id, roles: selectedUser.roles });
            setEditDialogOpen(false);
          }}
        />
      )}

      {/* Delete User Dialog */}
      {selectedUser && (
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Delete User"
          description={`Are you sure you want to delete ${selectedUser.name}? This action cannot be undone.`}
          onConfirm={() => {
            onDeleteUser(selectedUser.id);
            setDeleteDialogOpen(false);
          }}
        />
      )}

      {/* Assign Roles Dialog */}
      {selectedUser && (
        <AssignRolesDialog
          open={assignRolesDialogOpen}
          onOpenChange={setAssignRolesDialogOpen}
          user={selectedUser}
          onAssign={(roleIds) => {
            onAssignRoles(selectedUser.id, roleIds);
            setAssignRolesDialogOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default UsersList;
