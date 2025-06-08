export interface ProductCategory {
    id: number
    name: string
    product_region_id: number
    created_at: string | null
    updated_at: string | null
}

export interface ServiceCategory {
    id: number
    name: string
    created_at: string | null
    updated_at: string | null
}

export interface CategoryResponse<T> {
    status: boolean
    status_code: number
    message: string
    data: T
    token: string | null
    debug: string | null
}

export type ProductCategoryResponse = CategoryResponse<{
    "Products Category": ProductCategory[]
}>

export type ServiceCategoryResponse = CategoryResponse<{
    "Service Category": ServiceCategory[]
}>

