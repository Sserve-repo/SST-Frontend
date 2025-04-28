
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { IUser, } from "@/types/rbac";
import { useMockData } from "@/hooks/useMockData";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface AssignRolesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: IUser;
  onAssign: (roleIds: string[]) => void;
}

const AssignRolesDialog: React.FC<AssignRolesDialogProps> = ({
  open,
  onOpenChange,
  user,
  onAssign,
}) => {
  const { roles } = useMockData();
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    user.roles.map((role) => role.id)
  );

  const handleToggleRole = (roleId: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSubmit = () => {
    onAssign(selectedRoles);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Roles to {user.name}</DialogTitle>
          <DialogDescription>
            Select multiple roles to assign to this user. Changes will take effect immediately.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Selected Roles:</h4>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {selectedRoles.map((roleId) => {
                  const role = roles.find((r) => r.id === roleId);
                  return role ? (
                    <motion.div
                      key={role.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Badge 
                        variant="secondary"
                        className="group cursor-pointer hover:bg-destructive/10"
                        onClick={() => handleToggleRole(role.id)}
                      >
                        {role.name}
                        <X className="ml-1 h-3 w-3 group-hover:text-destructive" />
                      </Badge>
                    </motion.div>
                  ) : null;
                })}
              </AnimatePresence>
            </div>
          </div>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {roles.map((role) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent/50"
              >
                <Checkbox
                  id={`role-${role.id}`}
                  checked={selectedRoles.includes(role.id)}
                  onCheckedChange={() => handleToggleRole(role.id)}
                />
                <label
                  htmlFor={`role-${role.id}`}
                  className="text-sm font-medium cursor-pointer flex-1"
                >
                  <div>{role.name}</div>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                </label>
              </motion.div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignRolesDialog;
