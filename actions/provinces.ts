import { baseUrl } from "../config/constant";

export const getProvinces = async () => {
  try {
    const response = await fetch(`${baseUrl}/general/province/getProvince`);
    console.log("fetching provinces response status:", response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("provinces raw data:", data);
    
    return {
      data: data,
      error: null
    };
  } catch (error: any) {
    console.log("failed to fetch provinces", error);
    return {
      data: null,
      error: error.message || "Failed to fetch provinces"
    };
  }
};
