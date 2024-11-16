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
  const email = data.email || localStorage.getItem("email");
  requestPayload.append("user_email", email.replaceAll('"', ""));
  requestPayload.append("business_name", data.businessName);
  requestPayload.append("business_details", data.aboutProduct);
  requestPayload.append("business_email", data.businessEmail);
  requestPayload.append("business_phone", data.businessPhone);
  requestPayload.append("postal_code", data.postalCode);
  requestPayload.append("city", data.city);
  requestPayload.append("province", data.province);
  requestPayload.append("email", data.email);
  requestPayload.append("product_category_id", data.productCategory);
  requestPayload.append("product_region_id", data.productRegion);
  return requestPayload;
};

export const vendorIdentityPayload = (data: any) => {
  const requestPayload = new FormData();
  const email = data.email || localStorage.getItem("email");
  requestPayload.append("user_email", email.replaceAll('"', ""));
  requestPayload.append("document_type", data.idType);
  requestPayload.append("document", data.document);
  return requestPayload;
};

export const shippingPolicyPayload = (data: any) => {
  const requestPayload = new FormData();
  const email = data.email || localStorage.getItem("email");
  requestPayload.append("user_email", email.replaceAll('"', ""));
  requestPayload.append("shipping_option", data.shippingOption);
  requestPayload.append("from_day", data.deliveryFrom);
  requestPayload.append("to_day", data.deliveryTo);
  requestPayload.append("return_policy", data.returnPolicy);
  return requestPayload;
};

export const paymentPreferencePayload = (data: any) => {
  const requestPayload = new FormData();
  const email = data.email || localStorage.getItem("email");
  requestPayload.append("user_email", email.replaceAll('"', ""));
  requestPayload.append("payment_method", data.paymentMethod);
  requestPayload.append("account_number", data.accountNumber);
  requestPayload.append("institutional_number", data.institutionNumber);
  requestPayload.append("transit_number", data.transitNumber);
  requestPayload.append("bank_name", data.bankName);
  return requestPayload;
};

export const billingPayload = (data: any) => {
  const requestPayload = new FormData();
  const email = data.email || localStorage.getItem("email");
  requestPayload.append("user_email", email.replaceAll('"', ""));
  // requestPayload.append("exp_month", data.returnPolicy);
  // requestPayload.append("exp_year", data.returnPolicy);
  // requestPayload.append("cvc", data.returnPolicy);
  // requestPayload.append("type", data.returnPolicy);
  // requestPayload.append("card[tokena]", data.returnPolicy);

  return requestPayload;
};

export const productListingPayload = (data: any) => {
  const requestPayload = new FormData();
  const email = data.email || localStorage.getItem("email") || "";
  requestPayload.append("user_email", email.replaceAll('"', ""));
  requestPayload.append("title", data.productName);
  requestPayload.append("price", data.productPrice);
  requestPayload.append("stock_level", data.stockLevels);
  requestPayload.append("shipping_cost", data.shippingCosts);
  requestPayload.append("description", data.productDescription);
  requestPayload.append("image", data.productImage);
  requestPayload.append("product_category_id", data.productCategory);
  requestPayload.append("product_category_items_id", data.productSubcategory);
  return requestPayload;
};
