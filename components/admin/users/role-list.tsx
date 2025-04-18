
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
  Lock,
  Filter,
  Eye
} from "lucide-react";
import AssignPermissionsDialog from "./assign-permissions-dialog";
import { Role } from "@/types/rbac";
import RoleFormDialog from "./role-form-dialog";
import DeleteConfirmDialog from "./delete-confirm-dialog";

interface RolesListProps {
  roles: Role[];
  onAddRole: (role: Omit<Role, "id">) => void;
  onUpdateRole: (role: Role) => void;
  onDeleteRole: (id: string) => void;
  onAssignPermissions: (roleId: string, permissionIds: string[]) => void;
}

const RolesList: React.FC<RolesListProps> = ({
  roles,
  onAddRole,
  onUpdateRole,
  onDeleteRole,
  onAssignPermissions
}) => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignPermissionsDialogOpen, setAssignPermissionsDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setEditDialogOpen(true);
  };

  const handleDelete = (role: Role) => {
    setSelectedRole(role);
    setDeleteDialogOpen(true);
  };

  const handleAssignPermissions = (role: Role) => {
    setSelectedRole(role);
    setAssignPermissionsDialogOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Roles</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Role
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.slice(0, 3).map(permission => (
                      <Badge key={permission.id} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        {permission.name}
                      </Badge>
                    ))}
                    {role.permissions.length > 3 && (
                      <Badge variant="outline" className="bg-gray-100 text-gray-700">
                        +{role.permissions.length - 3} more
                      </Badge>
                    )}
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
                      <DropdownMenuItem onClick={() => handleEdit(role)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(role)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAssignPermissions(role)}>
                        <Lock className="mr-2 h-4 w-4" />
                        Assign Permissions
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(role)}
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

      {/* Add Role Dialog */}
      <RoleFormDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={(data) => {
          onAddRole({ ...data, permissions: [] });
          setAddDialogOpen(false);
        }}
      />

      {/* Edit Role Dialog */}
      {selectedRole && (
        <RoleFormDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          role={selectedRole}
          onSubmit={(data) => {
            onUpdateRole({ ...data, id: selectedRole.id, permissions: selectedRole.permissions });
            setEditDialogOpen(false);
          }}
        />
      )}

      {/* Delete Role Dialog */}
      {selectedRole && (
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Delete Role"
          description={`Are you sure you want to delete ${selectedRole.name}? This will remove the role from all users who have it.`}
          onConfirm={() => {
            onDeleteRole(selectedRole.id);
            setDeleteDialogOpen(false);
          }}
        />
      )}

      {/* Assign Permissions Dialog */}
      {selectedRole && (
        <AssignPermissionsDialog
          open={assignPermissionsDialogOpen}
          onOpenChange={setAssignPermissionsDialogOpen}
          role={selectedRole}
          onAssign={(permissionIds) => {
            onAssignPermissions(selectedRole.id, permissionIds);
            setAssignPermissionsDialogOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default RolesList;
