"use client"

import { useState, useEffect, useCallback } from "react"
import Cookies from "js-cookie"
import { baseUrl } from "@/config/constant"

interface ApiOptions {
    method?: "GET" | "POST" | "PUT" | "DELETE"
    body?: FormData | Record<string, any>
    headers?: Record<string, string>
    requiresAuth?: boolean
    isFormData?: boolean
}

interface ApiResponse<T> {
    data: T | null
    error: string | null
    loading: boolean
    refetch: () => Promise<void>
}

export function useApi<T>(endpoint: string, options: ApiOptions = {}): ApiResponse<T> {
    const [data, setData] = useState<T | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const { method = "GET", body, headers = {}, requiresAuth = true, isFormData = false } = options

            if (requiresAuth) {
                const token = Cookies.get("accessToken")
                if (token) {
                    headers["Authorization"] = `Bearer ${token}`
                } else {
                    throw new Error("Authentication token not found")
                }
            }

            if (body && !isFormData) {
                headers["Content-Type"] = "application/json"
            }

            const requestOptions: RequestInit = {
                method,
                headers,
                body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
            }

            const response = await fetch(`${baseUrl}${endpoint}`, requestOptions)

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || `API error: ${response.status}`)
            }

            const responseData = await response.json()

            if (!responseData.status) {
                throw new Error(responseData.message || "API returned an error")
            }

            setData(responseData.data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred")
            console.error("API Error:", err)
        } finally {
            setLoading(false)
        }
    }, [endpoint, options])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return { data, error, loading, refetch: fetchData }
}

export async function apiRequest<T>(
    endpoint: string,
    options: ApiOptions = {},
): Promise<{ data: T | null; error: string | null }> {
    try {
        const { method = "GET", body, headers = {}, requiresAuth = true, isFormData = false } = options

        if (requiresAuth) {
            const token = Cookies.get("accessToken")
            if (token) {
                headers["Authorization"] = `Bearer ${token}`
            } else {
                throw new Error("Authentication token not found")
            }
        }

        if (body && !isFormData) {
            headers["Content-Type"] = "application/json"
        }

        const requestOptions: RequestInit = {
            method,
            headers,
            body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
        }

        const response = await fetch(`${baseUrl}${endpoint}`, requestOptions)

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || `API error: ${response.status}`)
        }

        const responseData = await response.json()

        if (!responseData.status) {
            throw new Error(responseData.message || "API returned an error")
        }

        return { data: responseData.data, error: null }
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
        console.error("API Error:", err)
        return { data: null, error: errorMessage }
    }
}
