import { revalidatePath } from "next/cache";
import { baseUrl } from "../config/constant";
import { ProductFormData } from "@/types/product";
import Cookies from "js-cookie";

export const getRegions = async () => {
  try {
    const response = await fetch(
      `${baseUrl}/general/products/getProductRegion`
    );
    return response;
  } catch (error: any) {
    console.log("failed to fetch regions", error);
  }
};

export const getProductByRegions = async (id: number) => {
  try {
    const response = await fetch(
      `${baseUrl}/general/products/getCategoryItemsByRegion/${id}`
    );
    return response;
  } catch (error: any) {
    console.log("failed to fetch product items regions", error);
  }
};

export const getSingleProduct = async (id: number) => {
  try {
    const response = await fetch(
      `${baseUrl}/general/products/getSingleProduct/${id}`
    );
    return response;
  } catch (error: any) {
    console.log("failed to fetch product detail", error);
  }
};
export const getProductByCategorySub = async (params) => {
  try {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(
      `${baseUrl}/general/products/getProductByCategorySub?${query}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    console.log("failed to fetch product detail", error);
  }
};

export const getProductMenu = async () => {
  try {
    const response = await fetch(
      `${baseUrl}/general/products/getCategoryMenu`,
      { next: { revalidate: 86400 } }
    );
    return response;
  } catch (error: any) {
    console.log("failed to fetch product menu", error);
  }
};

export const getProductByCategory = async (catId: number, subCat: any) => {
  try {
    const response = await fetch(
      `${baseUrl}/general/products/getProductByCategorySub?limit=20&page=1&product_category=${catId}${
        subCat && `product_subcategory=${subCat}`
      }`
    );
    return response;
  } catch (error: any) {
    console.log("failed to fetch product menu", error);
  }
};

// Dashboard Actions

export const getProductList = async () => {
  try {
    const response = await fetch(
      `${baseUrl}/general/products/getProductByCategorySub?limit=20&page=1`
    );
    return response;
  } catch (error: any) {
    console.log("failed to fetch product menu", error);
  }
};

export async function createProduct(data: ProductFormData) {
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real app, you would save to your database here
    console.log("Creating product:", data);

    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to create product" };
  }
}

export async function updateProduct(id: string, data: ProductFormData) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Updating product:", id, data);

    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Deleting product:", id);

    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to delete product" };
  }
}

export async function getProducts() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock data
  return {
    totalProducts: "$15,891.05",
    activeProducts: 120,
    outOfStock: 25,
    totalStockValue: "$5,000",
    newProducts: "15 products",
    outOfStockPercentage: "12%",
    products: Array(13)
      .fill(null)
      .map((_, i) => ({
        id: `prod-${i}`,
        name: "Kuli-kuli",
        dateAdded: "12/12/2023 12:04 PM",
        price: 1222,
        category: "Home decor",
        stockLevel: "20 PCs in stock",
        status:
          i % 3 === 0
            ? "low-on-stock"
            : i % 3 === 1
            ? "fully-stocked"
            : "out-of-stock",
        views: "20.8k",
        images: ["/assets/images/image-placeholder.png"],
        description: "Sample product description",
        shippingCost: 10,
        hasDiscount: false,
        
      })),
  };
}

export async function addProductReview(payload: any, productId: number) {
  try {
    const token = Cookies.get("accessToken");
    if (!token) {
      throw new Error("No access token found");
    }
    const response = await fetch(
      `${baseUrl}/general/products/addReviews/${productId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      }
    );
    return response;
  } catch (error: any) {
    console.log("failed to fetch product menu", error);
  }
}

export async function getProductReviews(productId: number) {
  try {
    const response = await fetch(
      `${baseUrl}/general/products/getReviews/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    console.log("failed to fetch product menu", error);
  }
}

export async function getProductReviewsReplies(
  productId: number,
  reviewId: number
) {
  try {
    const response = await fetch(
      `${baseUrl}/general/products/getReviewsReply/${productId}/${reviewId}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    console.log("failed to fetch product menu", error);
  }
}
