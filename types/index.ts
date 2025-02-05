export interface Message {
    id: string
    sender: string
    subject: string
    label: string
    timestamp: string
    starred: boolean
    content: string
}

export interface Product {
    id: string
    name: string
    category: string
    subCategory?: string
    price: number
    shippingCost: number
    stockLevel: number
    description: string
    images: string[]
    status: "fully-stocked" | "low-on-stock" | "out-of-stock"
    dateAdded: string
    views: number
    hasDiscount: boolean
}

export interface ChatMessage {
    id: string
    content: string
    timestamp: string
    sender: string
}

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
