import { apiRequest } from "@/hooks/use-api"
import type { ProductCategoryResponse, ServiceCategoryResponse } from "@/types/categories"

export async function getProductCategories() {
    return apiRequest<ProductCategoryResponse>("/general/products/getCategory", {
        requiresAuth: false,
    })
}

export async function getServiceCategories() {
    return apiRequest<ServiceCategoryResponse>("/general/services/getCategory", {
        requiresAuth: false,
    })
}

export async function searchProducts(query: string) {
    return apiRequest<{ suggestions: string[] }>(`/admin/dashboard/productListing/search?q=${encodeURIComponent(query)}`)
}

export async function searchServices(query: string) {
    return apiRequest<{ suggestions: string[] }>(`/admin/dashboard/serviceListing/search?q=${encodeURIComponent(query)}`)
}
