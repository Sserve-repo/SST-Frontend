
import React from "react";
import { useMockData } from "@/hooks/useMockData";
import RolesList from "./role-list";

const RolesPage: React.FC = () => {
  const { 
    roles, 
    addRole, 
    updateRole, 
    deleteRole, 
    assignPermissionsToRole 
  } = useMockData();

  return (
    <div>
      <RolesList
        roles={roles}
        onAddRole={addRole}
        onUpdateRole={updateRole}
        onDeleteRole={deleteRole}
        onAssignPermissions={assignPermissionsToRole}
      />
    </div>
  );
};

export default RolesPage;
