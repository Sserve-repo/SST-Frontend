export interface Product {
    is_favorite: any
    id: number
    user_id: number
    title: string
    price: string
    stock_level: number
    shipping_cost: string
    product_category_id: number
    product_category_items_id: number
    description: string
    image: string
    created_at: string
    updated_at: string
}

export interface ProductFormData {
    name: string
    category: string
    subCategory?: string
    price: number
    shippingCost: number
    stockLevel: number| string
    description: string
    images: string[]
    hasDiscount: boolean
}

export interface ProductResponse {
    product_listing: Product[]
    current_page: number
    per_page: number
    total: number
    last_page: number
}

export interface FilterParams {
    search: string | undefined
    page?: number
    limit?: number
    product_category?: string
    product_subcategory?: string
    min_price?: string
    max_price?: string
    min_shipping_cost?: string
    max_shipping_cost?: string
    sort_by?: "most_recent" | "low_to_high" | "high_to_low" | "newest"
}




export type IProduct = {
  id?: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  images: string[] | File[];
  status: "active" | "inactive" | "approved" | "pending" |"rejected" | "disabled";
  category: string;
  createdAt: string | Date
  featured: boolean
  vendor: {
    id: string;
    name: string;
    email: string;
  };
  totalPages?: number;
  totalItems?: number;
  page?: number;
  limit?: number;
  subcategory?: string;
  stockLevel?: number | string;
  
};
