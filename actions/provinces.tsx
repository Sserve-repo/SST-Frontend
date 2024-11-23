import { baseUrl } from "../config/constant";

export const getProvinces = async () => {
  try {
    const response = await fetch(`${baseUrl}/general/province/getProvince`);
    return response;
  } catch (error: any) {
    console.log("failed to fetch regions", error);
  }
};
