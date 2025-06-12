"use server";

import { baseUrl } from "@/config/constant";

export interface Role {
  id: number;
  name: string;
}

export interface RoleWithPermissions {
  role_id: number;
  role: string;
  permissions: string[];
}

export interface Permission {
  id: number;
  name: string;
}

export interface GroupedPermissions {
  [category: string]: Permission[];
}

export interface PermissionsResponse {
  Permissions: GroupedPermissions;
}

export interface RolePermissionsResponse {
  permissions: Permission[];
  existingPermissions: string[];
  groupedPermissions: GroupedPermissions;
}

export async function createRole(formData: FormData) {
  try {
    const response = await fetch(
      `${baseUrl}/admin/dashboard/user/role/create`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { data: null, error: data.message || "Failed to create role" };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error creating role:", error);
    return { data: null, error: "Failed to create role" };
  }
}

export async function getRoles() {
  try {
    const response = await fetch(
      `${baseUrl}/admin/dashboard/user/role/listRoles`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_TOKEN}`,
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { data: null, error: data.message || "Failed to fetch roles" };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching roles:", error);
    return { data: null, error: "Failed to fetch roles" };
  }
}

export async function getRolesWithPermissions() {
  try {
    const response = await fetch(
      `${baseUrl}/admin/dashboard/user/role/listRolesWithPermissions`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_TOKEN}`,
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { data: null, error: data.message || "Failed to fetch roles" };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching roles:", error);
    return { data: null, error: "Failed to fetch roles" };
  }
}

export async function getPermissions() {
  try {
    const response = await fetch(
      `${baseUrl}/admin/dashboard/user/role/getPermissions`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_TOKEN}`,
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: data.message || "Failed to fetch permissions",
      };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return { data: null, error: "Failed to fetch permissions" };
  }
}

export async function getRolePermissions(id: string) {
  try {
    const response = await fetch(
      `${baseUrl}/admin/dashboard/user/role/view/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_TOKEN}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: data.message || "Failed to fetch role permissions",
      };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching role permissions:", error);
    return { data: null, error: "Failed to fetch role permissions" };
  }
}

export async function updateRole(id: string, formData: FormData) {
  try {
    const response = await fetch(
      `${baseUrl}/admin/dashboard/user/role/update/${id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { data: null, error: data.message || "Failed to update role" };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error updating role:", error);
    return { data: null, error: "Failed to update role" };
  }
}

export async function deleteRole(id: string) {
  try {
    const response = await fetch(
      `${baseUrl}/admin/dashboard/user/role/destroy/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_TOKEN}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { data: null, error: data.message || "Failed to delete role" };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error deleting role:", error);
    return { data: null, error: "Failed to delete role" };
  }
}

export async function assignRoleToUser(userId: string, roleId: string) {
  try {
    const formData = new FormData();
    formData.append("role_id", roleId);

    const response = await fetch(
      `${baseUrl}/admin/dashboard/user/assign-role/${userId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { data: null, error: data.message || "Failed to assign role" };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error assigning role:", error);
    return { data: null, error: "Failed to assign role" };
  }
}
