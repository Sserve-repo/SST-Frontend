export interface Permission {
  id: string;
  name: string;
  description: string;
  action: "create" | "read" | "update" | "delete" | "manage";
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  roles: Role[];
}
