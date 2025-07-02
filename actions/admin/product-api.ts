import { apiRequest } from "@/hooks/use-api";

export interface Product {
  id: number;
  user_id: number;
  title: string;
  price: string;
  stock_level: number;
  shipping_cost: string;
  description: string;
  image: string;
  status: number;
  created_at: string;
  updated_at: string;
  product_discount_id: number | null;
  product_images: string[];
  vendor_name: string;
  vendor_email: string;
  category: {
    id: number;
    name: string;
  };
  subcategory?: {
    id: number;
    name: string;
  };
  featured?: boolean;
}

export interface ListingCounts {
  allProducts: number;
  pendingProducts: number;
  approvedProducts: number;
  rejectedProducts: number;
  disabledProducts: number;
}

export interface ProductListData {
  productListing: Product[];
  listingCounts?: ListingCounts;
}

export interface ProductListResponse {
  status: string;
  status_code: number;
  message: string;
  token?: string;
  debug?: any;
  current_page?: number;
  per_page?: number;
  total?: number;
  last_page?: number;
  data?: ProductListData;
}

/**
 * A successful request always has data and no error
 */
interface GetProductsSuccess {
  data: ProductListResponse;
  error: null;
}

/**
 * A failed request always has an error message and no data
 */
interface GetProductsFailure {
  data: null;
  error: string;
}

/**
 * Union of the two → TypeScript can now narrow on `error`
 */
export type GetProductsResult = GetProductsSuccess | GetProductsFailure;


export async function getProducts(params: Record<string, string> = {}): Promise<GetProductsResult> {
  try {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "all") {
        switch (key) {
          case "product_category":
            queryParams.append("product_category", value);
            break;
          case "status": {
            const statusMap: Record<string, string> = {
              pending: "pending",
              approved: "approved",
              rejected: "rejected",
              disabled: "disabled",
            };
            queryParams.append("status", statusMap[value] || value);
            break;
          }
          case "search":
            queryParams.append("search", value);
            break;
          default:
            queryParams.append(key, value);
        }
      }
    });

    const endpoint = `/admin/dashboard/productListing/list${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await apiRequest<ProductListResponse>(endpoint);

    return {
      data: response as any,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch products",
    };
  }
}

export async function updateProductStatus(payload: {
  status: "approved" | "rejected" | "disabled" | "pending";
  product_ids: number[];
}): Promise<{ data: any; error: string | null }> {
  try {
    const data = await apiRequest<any>("/admin/dashboard/productListing/updateStatus", {
      method: "POST",
      body: payload,
    });
    return { data, error: null };
  } catch (error) {
    console.error("Error updating product status:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to update product status",
    };
  }
}

export async function disableProducts(productIds: number[]): Promise<{ data: any; error: string | null }> {
  try {
    const data = await apiRequest<any>("/admin/dashboard/productListing/updateStatus", {
      method: "POST",
      body: {
        status: "disabled",
        product_ids: productIds,
      },
    });
    return { data, error: null };
  } catch (error) {
    console.error("Error disabling products:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to disable products",
    };
  }
}
