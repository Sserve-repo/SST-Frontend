import { apiRequest } from "@/hooks/use-api"

export interface Role {
    id: number
    name: string
}

export interface RoleWithPermissions {
    role_id: number
    role: string
    permissions: string[]
}

export interface Permission {
    id: number
    name: string
}

export interface GroupedPermissions {
    [category: string]: Permission[]
}

export interface PermissionsResponse {
    Permissions: GroupedPermissions
}

export interface RolePermissionsResponse {
    permissions: Permission[]
    existingPermissions: string[]
    groupedPermissions: GroupedPermissions
}

export async function createRole(formData: FormData) {
    return apiRequest<Role>(`/admin/dashboard/user/role/create`, {
        method: "POST",
        body: formData,
        isFormData: true,
    })
}

export async function getRoles() {
    return apiRequest<Role[]>(`/admin/dashboard/user/role/listRoles`)
}

export async function getRolesWithPermissions() {
    return apiRequest<{ roles: RoleWithPermissions[] }>(`/admin/dashboard/user/role/listRolesWithPermissions`)
}

export async function getPermissions() {
    return apiRequest<PermissionsResponse>(`/admin/dashboard/user/role/getPermissions`)
}

export async function getRolePermissions(id: string) {
    return apiRequest<RolePermissionsResponse>(`/admin/dashboard/user/role/view/${id}`)
}

export async function updateRole(id: string, formData: FormData) {
    return apiRequest<{ id: number; name: string; permissions: string[] }>(`/admin/dashboard/user/role/update/${id}`, {
        method: "POST",
        body: formData,
        isFormData: true,
    })
}

export async function deleteRole(id: string) {
    return apiRequest<any>(`/admin/dashboard/user/role/destroy/${id}`)
}
