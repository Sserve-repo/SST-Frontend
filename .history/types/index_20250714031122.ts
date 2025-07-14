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
    id: string;
    name: string;
    title?: string;
    sku: string;
    category: string;
    subCategory: string;
    category_id?: string | number;
    sub_category_id?: string | number;
    price: number;
    stock: number;
    stock_level?: number;
    threshold: number;
    status: "draft" | "published" | string | number;
    lastUpdated: string;
    updated_at?: string;
    description: string;
    images: string[];
    product_images: string[];
    shippingCost: number;
    shipping_cost?: number;
    dateAdded?: string;
    stockLevel?: number
    views?: n
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

export interface RescheduleData {
    booked_date: string
    booked_time: string
}