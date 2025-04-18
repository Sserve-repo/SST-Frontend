import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { IUser, Role, Permission } from "@/types/rbac";

// Initial mock data
const initialPermissions: Permission[] = [
  {
    id: "p1",
    name: "View users",
    description: "Can view user list and details",
    action: "read",
  },
  {
    id: "p2",
    name: "Create users",
    description: "Can create new users",
    action: "create",
  },
  {
    id: "p3",
    name: "Update users",
    description: "Can update existing users",
    action: "update",
  },
  {
    id: "p4",
    name: "Delete users",
    description: "Can delete users",
    action: "delete",
  },
  {
    id: "p5",
    name: "View roles",
    description: "Can view role list and details",
    action: "read",
  },
  {
    id: "p6",
    name: "Manage roles",
    description: "Can create, update and delete roles",
    action: "manage",
  },
  {
    id: "p7",
    name: "View permissions",
    description: "Can view permission list",
    action: "read",
  },
  {
    id: "p8",
    name: "Manage permissions",
    description: "Can create, update and delete permissions",
    action: "manage",
  },
  {
    id: "p9",
    name: "View reports",
    description: "Can view reports",
    action: "read",
  },
  {
    id: "p10",
    name: "Manage reports",
    description: "Can create and manage reports",
    action: "manage",
  },
];


const initialRoles: Role[] = [
  {
    id: "r1",
    name: "Administrator",
    description: "Full system access",
    permissions: initialPermissions,
  },
  {
    id: "r2",
    name: "User Manager",
    description: "Can manage users",
    permissions: initialPermissions,
  },
  {
    id: "r3",
    name: "Read Only",
    description: "Can only view data, no edit permissions",
    permissions: initialPermissions.filter((p) => p.action === "read"),
  },
];

const initialUsers: IUser[] = [
  {
    id: "u1",
    name: "John Admin",
    email: "admin@example.com",
    status: "active",
    roles: [initialRoles[0]],
  },
  {
    id: "u2",
    name: "Jane Manager",
    email: "manager@example.com",
    status: "active",
    roles: [initialRoles[1]],
  },
  {
    id: "u3",
    name: "Bob Viewer",
    email: "viewer@example.com",
    status: "active",
    roles: [initialRoles[2]],
  },
  {
    id: "u4",
    name: "Alice Inactive",
    email: "inactive@example.com",
    status: "inactive",
    roles: [],
  },
];

export function useMockData() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  // Initialize with mock data
  useEffect(() => {
    setPermissions(initialPermissions);
    setRoles(initialRoles);
    setUsers(initialUsers);
  }, []);

  // Users CRUD operations
  const addUser = (user: Omit<IUser, "id">) => {
    const newUser = { ...user, id: uuidv4(), roles: [] };
    setUsers((prev) => [...prev, newUser]);
    return newUser;
  };

  const updateUser = (updatedUser: IUser) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const assignRolesToUser = (userId: string, roleIds: string[]) => {
    const selectedRoles = roles.filter((role) => roleIds.includes(role.id));
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, roles: selectedRoles } : user
      )
    );
  };

  // Roles CRUD operations
  const addRole = (role: Omit<Role, "id">) => {
    const newRole = { ...role, id: uuidv4(), permissions: [] };
    setRoles((prev) => [...prev, newRole]);
    return newRole;
  };

  const updateRole = (updatedRole: Role) => {
    setRoles((prev) =>
      prev.map((role) => (role.id === updatedRole.id ? updatedRole : role))
    );
  };

  const deleteRole = (id: string) => {
    // Remove the role from all users
    setUsers((prev) =>
      prev.map((user) => ({
        ...user,
        roles: user.roles.filter((role) => role.id !== id),
      }))
    );
    // Delete the role
    setRoles((prev) => prev.filter((role) => role.id !== id));
  };

  const assignPermissionsToRole = (roleId: string, permissionIds: string[]) => {
    const selectedPermissions = permissions.filter((permission) =>
      permissionIds.includes(permission.id)
    );

    const updatedRoles = roles.map((role) =>
      role.id === roleId ? { ...role, permissions: selectedPermissions } : role
    );

    setRoles(updatedRoles);

    // Update the roles in users too
    setUsers((prev) =>
      prev.map((user) => ({
        ...user,
        roles: user.roles.map((userRole) =>
          userRole.id === roleId
            ? updatedRoles.find((r) => r.id === roleId)!
            : userRole
        ),
      }))
    );
  };

  // Permissions CRUD operations
  const addPermission = (permission: Omit<Permission, "id">) => {
    const newPermission = { ...permission, id: uuidv4() };
    setPermissions((prev) => [...prev, newPermission]);
    return newPermission;
  };

  const updatePermission = (updatedPermission: Permission) => {
    setPermissions((prev) =>
      prev.map((permission) =>
        permission.id === updatedPermission.id ? updatedPermission : permission
      )
    );

    // Update the permission in roles too
    setRoles((prev) =>
      prev.map((role) => ({
        ...role,
        permissions: role.permissions.map((perm) =>
          perm.id === updatedPermission.id ? updatedPermission : perm
        ),
      }))
    );
  };

  const deletePermission = (id: string) => {
    // Remove the permission from all roles
    setRoles((prev) =>
      prev.map((role) => ({
        ...role,
        permissions: role.permissions.filter((perm) => perm.id !== id),
      }))
    );
    // Delete the permission
    setPermissions((prev) => prev.filter((perm) => perm.id !== id));
  };

  return {
    users,
    roles,
    permissions,
    addUser,
    updateUser,
    deleteUser,
    assignRolesToUser,
    addRole,
    updateRole,
    deleteRole,
    assignPermissionsToRole,
    addPermission,
    updatePermission,
    deletePermission,
  };
}
