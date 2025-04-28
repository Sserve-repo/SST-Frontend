import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Role } from "@/types/rbac";
import { useMockData } from "@/hooks/useMockData";
import { Search } from "lucide-react";

interface AssignPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role;
  onAssign: (permissionIds: string[]) => void;
}

const AssignPermissionsDialog: React.FC<AssignPermissionsDialogProps> = ({
  open,
  onOpenChange,
  role,
  onAssign,
}) => {
  const { permissions } = useMockData();
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    role.permissions.map((permission) => permission.id)
  );
  const [searchQuery, setSearchQuery] = useState("");

  // const filteredPermissions = permissions.filter((permission) =>
  //   permission.name.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  const handleTogglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSubmit = () => {
    onAssign(selectedPermissions);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Assign Permissions to {role.name}</DialogTitle>
        </DialogHeader>
        <div className="relative my-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search permissions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="py-4 max-h-[400px] overflow-y-auto">
          <div key={"resource"} className="mb-4">
            <h3 className="font-medium text-sm text-gray-700 mb-2 flex items-center">
              <span className="bg-gray-200 w-2 h-2 rounded-full mr-2"></span>
              {"Resource Name"}
            </h3>
            <div className="space-y-2 ml-4">
              {permissions.map((permission) => (
                <div
                  key={permission.id}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={`permission-${permission.id}`}
                    checked={selectedPermissions.includes(permission.id)}
                    onCheckedChange={() =>
                      handleTogglePermission(permission.id)
                    }
                  />
                  <label
                    htmlFor={`permission-${permission.id}`}
                    className="text-sm font-medium cursor-pointer flex-1"
                  >
                    {permission.name}
                    <p className="text-xs text-gray-500">
                      {permission.description}
                    </p>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignPermissionsDialog;
