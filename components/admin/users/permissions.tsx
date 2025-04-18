
import React from "react";
import { useMockData } from "@/hooks/useMockData";
import PermissionsList from "./permissions-list";

const PermissionsPage: React.FC = () => {
  const { 
    permissions, 
    addPermission, 
    updatePermission, 
    deletePermission
  } = useMockData();

  return (
    <div>
      <PermissionsList
        permissions={permissions}
        onAddPermission={addPermission}
        onUpdatePermission={updatePermission}
        onDeletePermission={deletePermission}
      />
    </div>
  );
};

export default PermissionsPage;
