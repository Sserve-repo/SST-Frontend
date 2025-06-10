"use server"

import { baseUrl } from "@/config/constant"

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
    try {
        const response = await fetch(`${baseUrl}/admin/dashboard/user/create`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.API_TOKEN}`,
            },
            body: formData,
        })
       
        const data = await response.json()

        if (!response.ok) {
            return { data: null, error: data.message || "Failed to create user" }
        }

        return { data, error: null }
    } catch (error) {
        console.error("Error creating user:", error)
        return { data: null, error: "Failed to create user" }
    }
}

export async function getUserById(id: string) {
    try {
        const response = await fetch(`${baseUrl}/admin/dashboard/user/show/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.API_TOKEN}`,
            },
        })

        const data = await response.json()

        if (!response.ok) {
            return { data: null, error: data.message || "Failed to fetch user" }
        }

        return { data, error: null }
    } catch (error) {
        console.error("Error fetching user:", error)
        return { data: null, error: "Failed to fetch user" }
    }
}

export async function updateUser(id: string, formData: FormData) {
    try {
        const response = await fetch(`${baseUrl}/admin/dashboard/user/update/${id}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.API_TOKEN}`,
            },
            body: formData,
        })

        const data = await response.json()

        if (!response.ok) {
            return { data: null, error: data.message || "Failed to update user" }
        }

        return { data, error: null }
    } catch (error) {
        console.error("Error updating user:", error)
        return { data: null, error: "Failed to update user" }
    }
}

export async function updateUserStatus(id: string, formData: FormData) {
    try {
        const response = await fetch(`${baseUrl}/admin/dashboard/user/updateStatus/${id}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.API_TOKEN}`,
            },
            body: formData,
        })

        const data = await response.json()

        if (!response.ok) {
            return { data: null, error: data.message || "Failed to update user status" }
        }

        return { data, error: null }
    } catch (error) {
        console.error("Error updating user status:", error)
        return { data: null, error: "Failed to update user status" }
    }
}

export async function deleteUser(id: string) {
    try {
        const response = await fetch(`${baseUrl}/admin/dashboard/user/destroy/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.API_TOKEN}`,
            },
        })

        const data = await response.json()

        if (!response.ok) {
            return { data: null, error: data.message || "Failed to delete user" }
        }

        return { data, error: null }
    } catch (error) {
        console.error("Error deleting user:", error)
        return { data: null, error: "Failed to delete user" }
    }
}

export async function searchUsers(query: string) {
    try {
        const response = await fetch(
            `${baseUrl}/general/search/userSearch?query=${encodeURIComponent(query)}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                cache: "no-store",
            }
        )

        const data = await response.json()

        if (!response.ok) {
            return { data: null, error: data.message || "Failed to search users" }
        }

        return { data, error: null }
    } catch (error) {
        console.error("Error searching users:", error)
        return { data: null, error: "Failed to search users" }
    }
}