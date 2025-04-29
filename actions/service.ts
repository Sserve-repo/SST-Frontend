import { baseUrl } from "../config/constant";
import Cookies from "js-cookie";

export const getRegions = async () => {
  try {
    const response = await fetch(`${baseUrl}/products/getProductRegion`);
    return response;
  } catch (error: any) {
    console.log("failed to fetch regions", error);
  }
};

export const getServiceByRegions = async (id: number) => {
  try {
    const response = await fetch(
      `${baseUrl}/products/getCategoryItemsByRegion/${id}`
    );
    return response;
  } catch (error: any) {
    console.log("failed to fetch product items regions", error);
  }
};
export const getServicesMenu = async () => {
  try {
    const response = await fetch(
      `${baseUrl}/general/services/getCategoryMenu`,
      { next: { revalidate: 86400 } }
    );
    return response;
  } catch (error: any) {
    console.log("failed to fetch service menu", error);
  }
};

// export const getServiceByCategory = async (catId: number) => {
//   try {
//     const response = await fetch(
//       `${baseUrl}/general/services/geServiceByCategorySub?limit=20&page=1&service_category=${catId}`
//     );
//     return response;
//   } catch (error: any) {
//     console.log("failed to fetch service menu", error);
//   }
// };

export const getServiceBySubCategory = async (subCategory: number | null) => {
  try {
    const url = subCategory
      ? `${baseUrl}/general/services/getServicesByCategory?sub_service_category=${subCategory}`
      : `${baseUrl}/general/services/getServicesByCategory`;

    const response = await fetch(url);
    return response;
  } catch (error: any) {
    console.log("failed to fetch service category", error);
  }
};

export const getServiceByCategory = async (catId: number) => {
  try {
    const response = await fetch(
      `${baseUrl}/general/services/getServicesByCategory/${catId}`
    );
    return response;
  } catch (error: any) {
    console.log("failed to fetch service category", error);
  }
};

export const getServiceDetail = async (id) => {
  const token = Cookies.get("accessToken");
  try {
    const response = await fetch(
      `${baseUrl}/general/checkout/getAvailableDatesAndTimes/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    console.log("failed to fetch featured artisan", error);
  }
};
