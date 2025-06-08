import { baseUrl } from "../../config/constant"
import Cookies from "js-cookie"
import type { ProductCategoryResponse, ServiceCategoryResponse } from "@/types/categories"

export const getProductCategories = async (): Promise<{
    data?: ProductCategoryResponse
    error?: string
}> => {
    try {
        const token = Cookies.get("accessToken")
        const response = await fetch(`${baseUrl}/general/products/getCategory`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        return { data }
    } catch (error: any) {
        console.error("Failed to fetch product categories:", error)
        return { error: error.message || "Failed to fetch product categories" }
    }
}

export const getServiceCategories = async (): Promise<{
    data?: ServiceCategoryResponse
    error?: string
}> => {
    try {
        const token = Cookies.get("accessToken")
        const response = await fetch(`${baseUrl}/general/services/getCategory`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        return { data }
    } catch (error: any) {
        console.error("Failed to fetch service categories:", error)
        return { error: error.message || "Failed to fetch service categories" }
    }
}
