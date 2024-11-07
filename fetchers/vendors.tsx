import { baseUrl } from "../config/constant";

export const getProductCategories = async () => {
  try {
    const response = await fetch(`${baseUrl}/general/products/getCategory`);
    const res = await response.json();
    if (response.ok && response.status === 200) {
      return res;
    }
  } catch (error: any) {
    console.log("Form validation failed", error);
  }
};

export const getProductCategoryItemsById = async (catId) => {
  try {
    const response = await fetch(
      `${baseUrl}/general/products/getCategoryItemsByProductCategoryId/${catId}`
    );
    const res = await response.json();
    if (response.ok && response.status === 200) {
      return res;
    }
  } catch (error: any) {
    console.log("Form validation failed", error);
  }
};

export const getProductRegions = async () => {
  try {
    const response = await fetch(
      `${baseUrl}/general/products/getProductRegion`
    );
    const res = await response.json();
    if (response.ok && response.status === 200) {
      return res;
    }
  } catch (error: any) {
    console.log("Form validation failed", error);
  }
};

export const createBusinessProfile = async (requestPayload: any) => {
  try {
    const response = await fetch(
      `${baseUrl}/vendor/auth/registerBusinessDetails`,
      {
        method: "POST",
        body: requestPayload,
      }
    );
    return response;
  } catch (error: any) {
    console.log("Registration failed", error);
  }
};

export const createVendorIdentity = async (requestPayload: any) => {
  try {
    const response = await fetch(`${baseUrl}/vendor/auth/vendorIdentity`, {
      method: "POST",
      body: requestPayload,
    });
    return response;
  } catch (error: any) {
    console.log("Vendor identity creation failed", error);
  }
};

export const createShippingPolicy = async (requestPayload: any) => {
  try {
    const response = await fetch(`${baseUrl}/vendor/auth/shippingPolicy`, {
      method: "POST",
      body: requestPayload,
    });
    return response;
  } catch (error: any) {
    console.log("Vendor identity creation failed", error);
  }
};

export const createPaymentPreference = async (requestPayload: any) => {
  try {
    const response = await fetch(`${baseUrl}/vendor/auth/paymentPreference`, {
      method: "POST",
      body: requestPayload,
    });
    return response;
  } catch (error: any) {
    console.log("Payment preference creation failed", error);
  }
};

export const createBilling = async (requestPayload: any) => {
  try {
    const response = await fetch(`${baseUrl}/vendor/auth/billingDetail`, {
      method: "POST",
      body: requestPayload,
    });
    return response;
  } catch (error: any) {
    console.log("Vendor identity creation failed", error);
  }
};

export const createProductListing = async (requestPayload: any) => {
  try {
    const response = await fetch(`${baseUrl}/vendor/auth/listingDetail`, {
      method: "POST",
      body: requestPayload,
    });
    return response;
  } catch (error: any) {
    console.log("Vendor listing detail creation failed", error);
  }
};
