import { baseUrl } from "../config/constant";

export const getServiceCategories = async () => {
  try {
    const response = await fetch(`${baseUrl}/general/services/getCategory`);
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

export const getServiceCategoryItems = async (Id: any) => {
  try {
    const response = await fetch(
      `${baseUrl}/general/services/getCategoryItems`
    );
    const res = await response.json();
    if (response.ok && response.status === 200) {
      return res;
    }
  } catch (error: any) {
    console.log("Form validation failed", error);
  }
};

export const getServiceCategoryItemsById = async (Id: any) => {
  try {
    const response = await fetch(
      `${baseUrl}/general/services/getCategoryItemsByServiceCategoryId/${Id}`
    );
    const res = await response.json();
    if (response.ok && response.status === 200) {
      return res;
    }
  } catch (error: any) {
    console.log("Form validation failed", error);
  }
};

export const createbusinessPolicy = async (requestPayload: any) => {
  try {
    const response = await fetch(`${baseUrl}/artisan/auth/businessPolicy`, {
      method: "POST",
      body: requestPayload,
    });
    return response;
  } catch (error: any) {
    console.log("Business policy creation failed", error);
  }
};

export const createBusinessProfile = async (requestPayload: any) => {
  try {
    const response = await fetch(
      `${baseUrl}/artisan/auth/registerBusinessDetails`,
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

export const createServiceAvailability = async (requestPayload: any) => {
  try {
    const response = await fetch(
      `${baseUrl}/artisan/auth/serviceAreaAvailability`,
      {
        method: "POST",
        body: requestPayload,
      }
    );
    return response;
  } catch (error: any) {
    console.log("Service Area Availability creation failed", error);
  }
};

export const createArtisanIdentity = async (requestPayload: any) => {
  try {
    const response = await fetch(`${baseUrl}/artisan/auth/vendorIdentity`, {
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
    const response = await fetch(`${baseUrl}/artisan/auth/shippingPolicy`, {
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
    const response = await fetch(`${baseUrl}/artisan/auth/paymentPreference`, {
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
    const response = await fetch(`${baseUrl}/artisan/auth/billingDetail`, {
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
    const response = await fetch(`${baseUrl}/artisan/auth/listingDetail`, {
      method: "POST",
      body: requestPayload,
    });
    return response;
  } catch (error: any) {
    console.log("Vendor listing detail creation failed", error);
  }
};




export const createServiceListing = async (requestPayload: any) => {
  try {
    const response = await fetch(`${baseUrl}/artisan/auth/listingDetail`, {
      method: "POST",
      body: requestPayload,
    });
    return response;
  } catch (error: any) {
    console.log("Service listing detail creation failed", error);
  }
};
