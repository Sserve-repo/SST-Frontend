import { apiRequest } from "@/hooks/use-api"

export interface Product {
  id: number
  user_id: number
  title: string
  price: string
  stock_level: number
  shipping_cost: string
  description: string
  image: string
  status: number
  created_at: string
  updated_at: string
  product_discount_id: number | null
  product_images: string[]
  vendor_name: string
  vendor_email: string
  category: {
    id: number
    name: string
  }
  subcategory?: {
    id: number
    name: string
  }
  featured?: boolean
}

// export interface ProductListResponse {
//   status: boolean
//   status_code: number
//   message: string
//   data: {
//     productListing: Product[]
//     listingCounts?: {
//       allProducts: number
//       pendingProducts: number
//       approvedProducts: number
//       rejectedProducts: number
//       disabledProducts: number
//     }
//   }
//   token: null
//   debug: null
// }

export type ProductListResponse = {
  status: string
  status_code: number
  message: string
  token?: string
  debug?: any
  data: {
    productListing: Product[]
    listingCounts?: {
      allProducts: number
      pendingProducts: number
      approvedProducts: number
      rejectedProducts: number
      disabledProducts: number
    }
  }
}

export async function getProducts(params: Record<string, string> = {}) {
  try {
    // Build query string from params
    const queryParams = new URLSearchParams()

    // Map frontend filter names to API parameter names
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "all") {
        switch (key) {
          case "category":
            queryParams.append("category", value)
            break
          case "status":
            // Map status strings to numbers for API
            const statusMap: Record<string, string> = {
              pending: "0",
              approved: "1",
              rejected: "2",
              disabled: "3",
            }
            queryParams.append("status", statusMap[value] || value)
            break
          case "search":
            queryParams.append("search", value)
            break
          default:
            queryParams.append(key, value)
        }
      }
    })

    const endpoint = `/admin/dashboard/productListing/list${queryParams.toString() ? `?${queryParams.toString()}` : ""}`

    return apiRequest<ProductListResponse>(endpoint)
  } catch (error) {
    console.error("Error fetching products:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch products",
    }
  }
}

export async function updateProductStatus(payload: {
  status: "approved" | "rejected" | "disabled" | "pending"
  product_ids: number[]
}) {
  try {
    return apiRequest<any>("/admin/dashboard/productListing/updateStatus", {
      method: "POST",
      body: payload,
    })
  } catch (error) {
    console.error("Error updating product status:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to update product status",
    }
  }
}

export async function disableProducts(productIds: number[]) {
  try {
    return apiRequest<any>("/admin/dashboard/productListing/updateStatus", {
      method: "POST",
      body: {
        status: "disabled",
        product_ids: productIds,
      },
    })
  } catch (error) {
    console.error("Error disabling products:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to disable products",
    }
  }
}
