import React, { useState } from "react";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Plus, MoreHorizontal, Pencil, Trash2, Filter } from "lucide-react";
import { Permission } from "@/types/rbac";
import DeleteConfirmDialog from "./delete-confirm-dialog";
import PermissionFormDialog from "./permission-form-dialog";

interface PermissionsListProps {
  permissions: Permission[];
  onAddPermission: (permission: Omit<Permission, "id">) => void;
  onUpdatePermission: (permission: Permission) => void;
  onDeletePermission: (id: string) => void;
}

const PermissionsList: React.FC<PermissionsListProps> = ({
  permissions,
  onAddPermission,
  onUpdatePermission,
  onDeletePermission,
}) => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] =
    useState<Permission | null>(null);

  const handleEdit = (permission: Permission) => {
    setSelectedPermission(permission);
    setEditDialogOpen(true);
  };

  const handleDelete = (permission: Permission) => {
    setSelectedPermission(permission);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Permissions</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Permission
          </Button>
        </div>
      </div>

      <div key={"resource"} className="mb-6">
        <h3 className="font-medium text-gray-700 mb-3 flex items-center">
          <span className="bg-indigo-500 w-2 h-2 rounded-full mr-2"></span>
          {"Resource Name"}
        </h3>
        <div className="rounded-md border mb-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Action</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell className="font-medium">
                    {permission.name}
                  </TableCell>
                  <TableCell>{permission.description}</TableCell>
                  <TableCell>
                    <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">
                      {permission.action}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEdit(permission)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(permission)}
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
      </div>

      {/* Add Permission Dialog */}
      <PermissionFormDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={(data) => {
          onAddPermission(data);
          setAddDialogOpen(false);
        }}
      />

      {/* Edit Permission Dialog */}
      {selectedPermission && (
        <PermissionFormDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          permission={selectedPermission}
          onSubmit={(data) => {
            onUpdatePermission({ ...data, id: selectedPermission.id });
            setEditDialogOpen(false);
          }}
        />
      )}

      {/* Delete Permission Dialog */}
      {selectedPermission && (
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Delete Permission"
          description={`Are you sure you want to delete ${selectedPermission.name}? This will remove the permission from all roles that have it.`}
          onConfirm={() => {
            onDeletePermission(selectedPermission.id);
            setDeleteDialogOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default PermissionsList;
