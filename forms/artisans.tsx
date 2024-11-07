"use client";

export const userRegistrationPayload = (data: any) => {
  const requestPayload = new FormData();
  requestPayload.append("firstname", data.firstName);
  requestPayload.append("lastname", data.lastName);
  requestPayload.append("email", data.email);
  requestPayload.append("password", data.password);
  requestPayload.append("password_confirmation", data.confirmPassword);
  return requestPayload;
};

export const businessProfilePayload = (data: any) => {
  const requestPayload = new FormData();
  const userId = localStorage.getItem("userId") || "";
  requestPayload.append("user_id", userId);
  requestPayload.append("business_name", data.businessName);
  requestPayload.append("business_details", data.aboutProduct);
  requestPayload.append("business_email", data.businessEmail);
  requestPayload.append("business_phone", data.businessPhone);
  requestPayload.append("postal_code", data.postalCode);
  requestPayload.append("city", data.city);
  requestPayload.append("province", data.province);
  requestPayload.append("email", data.email);
  requestPayload.append("service_category_id", data.serviceCategory);
  requestPayload.append("service_category_item_id", data.serviceSubcategory);
  return requestPayload;
};

export const artisanIdentityPayload = (data: any) => {
  const requestPayload = new FormData();
  const userId = localStorage.getItem("userId") || "";
  requestPayload.append("user_id", userId);
  requestPayload.append("document1", data.businessLicense);
  requestPayload.append("document2", data.proofOfInsurance);
  requestPayload.append("document3", data.document1);
  requestPayload.append("document4", data.document2);

  return requestPayload;
};

export const serviceAvailabilityPayload = (data: any) => {
  const requestPayload = new FormData();
  const userId = localStorage.getItem("userId") || "";
  requestPayload.append("user_id", userId);
  requestPayload.append("available_dates", data.availableDays);
  requestPayload.append("start_time", data.availableFrom);
  requestPayload.append("end_time", data.availableTo);
  requestPayload.append("longitude", data.shopAddress);
  requestPayload.append("latitude", data.shopAddress);
  requestPayload.append("homeService", data.homeService);
  return requestPayload;
};

export const businessPolicyPayload = (data: any) => {
  const requestPayload = new FormData();
  const userId = localStorage.getItem("userId") || "";
  requestPayload.append("user_id", userId);
  requestPayload.append("booking_details", data.bookingDetails);
  requestPayload.append("cancelling_policy", data.cancellationPolicy);
  return requestPayload;
};
export const shippingPolicyPayload = (data: any) => {
  const requestPayload = new FormData();
  const userId = localStorage.getItem("userId") || "";
  requestPayload.append("user_id", userId);
  requestPayload.append("shipping_option", data.shippingOption);
  requestPayload.append("from_date", data.deliveryFrom);
  requestPayload.append("to_date", data.deliveryTo);
  requestPayload.append("return_policy", data.returnPolicy);
  return requestPayload;
};

export const paymentPreferencePayload = (data: any) => {
  const requestPayload = new FormData();
  const userId = localStorage.getItem("userId") || "";
  requestPayload.append("user_id", userId);
  requestPayload.append("payment_method", data.paymentMethod);
  requestPayload.append("account_number", data.accountNumber);
  requestPayload.append("institutional_number", data.institutionNumber);
  requestPayload.append("transit_number", data.transitNumber);
  requestPayload.append("bank_name", data.bankName);
  return requestPayload;
};

export const billingPayload = (data: any) => {
  const requestPayload = new FormData();
  const userId = localStorage.getItem("userId") || "";
  requestPayload.append("user_id", userId);
  // requestPayload.append("exp_month", data.returnPolicy);
  // requestPayload.append("exp_year", data.returnPolicy);
  // requestPayload.append("cvc", data.returnPolicy);
  // requestPayload.append("type", data.returnPolicy);
  // requestPayload.append("card[tokena]", data.returnPolicy);

  return requestPayload;
};

export const serviceListingPayload = (data: any) => {
  const requestPayload = new FormData();
  const userId = localStorage.getItem("userId") || "";
  requestPayload.append("user_id", userId);
  requestPayload.append("title", data.productName);
  requestPayload.append("price", data.productPrice);
  requestPayload.append("stock_level", data.stockLevels);
  requestPayload.append("shipping_cost", data.shippingCosts);
  requestPayload.append("description", data.productDescription);
  requestPayload.append("image", data.productImage);
  requestPayload.append("service_category_id", data.serviceCategory);
  requestPayload.append("service_category_items_id", data.serviceSubcategory);
  return requestPayload;
};
