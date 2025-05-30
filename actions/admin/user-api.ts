import { apiRequest } from "@/hooks/use-api"

export interface User {
    id: number
    firstname: string
    lastname: string
    username: string | null
    phone: string | null
    user_photo: string | null
    email: string
    email_verified_at: string | null
    verified_status: string | null
    active_status: number
    is_completed: string
    email_status: number
    twofa_status: number
    otp: string | null
    otp_timestamp: string | null
    registration_status: string | null
    user_type: string
    role_id: number | null
    address: string | null
    stripe_customer_id: string | null
    stripe_payment_method_id: string | null
    created_at: string
    updated_at: string
}

export async function createUser(formData: FormData) {
    return apiRequest<User>(`/admin/dashboard/user/create`, {
        method: "POST",
        body: formData,
        isFormData: true,
    })
}

export async function getUserById(id: string) {
    return apiRequest<User>(`/admin/dashboard/user/show/${id}`)
}

export async function updateUser(id: string, formData: FormData) {
    return apiRequest<User>(`/admin/dashboard/user/update/${id}`, {
        method: "POST",
        body: formData,
        isFormData: true,
    })
}

export async function updateUserStatus(id: string, formData: FormData) {
    return apiRequest<User>(`/admin/dashboard/user/updateStatus/${id}`, {
        method: "POST",
        body: formData,
        isFormData: true,
    })
}

export async function deleteUser(id: string) {
    return apiRequest<any>(`/admin/dashboard/user/destroy/${id}`, {
        method: "POST",
    })
}

export async function searchUsers(query: string) {
    return apiRequest<{ "Search Details": { firstname: string; lastname: string; user_photo: string | null }[] }>(
        `/general/search/userSearch?query=${encodeURIComponent(query)}`,
        {
            requiresAuth: false,
        },
    )
}
