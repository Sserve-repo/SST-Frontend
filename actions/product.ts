import { baseUrl } from "../config/constant";

export const getRegions = async () => {
  try {
    const response = await fetch(`${baseUrl}/products/getProductRegion`);
    return response;
  } catch (error: any) {
    console.log("failed to fetch regions", error);
  }
};

export const getProductByRegions = async (id: number) => {
  try {
    const response = await fetch(
      `${baseUrl}/products/getCategoryItemsByRegion/${id}`
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

export const getProductByCategory = async (catId: number) => {
  try {
    const response = await fetch(
      `${baseUrl}/general/products/getProductByCategorySub?limit=20&page=1&product_category=${catId}`
    );
    return response;
  } catch (error: any) {
    console.log("failed to fetch product menu", error);
  }
};


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
