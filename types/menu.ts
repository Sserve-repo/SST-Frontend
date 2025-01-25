export interface ProductCategoryItem {
    id: number
    name: string
    product_category_id: number
    product_region_id: number
    created_at: null | string
    updated_at: null | string
}

export interface ProductCategory {
    id: number
    name: string
    product_region_id: number
    created_at: null | string
    updated_at: null | string
    product_category_items: ProductCategoryItem[]
}

export interface Region {
    id: number
    name: string
    created_at: null | string
    updated_at: null | string
    product_categories: ProductCategory[]
}

export interface MenuData {
    "Products Category Menu": Region[]
}

