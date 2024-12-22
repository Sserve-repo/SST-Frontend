export const confirmPaymentPayload = (data) => {
  const requestPayload = new FormData();
  requestPayload.append("orderId", data.orderId);
  requestPayload.append("paymentIntentId", data.paymentIntentId);
  requestPayload.append("address", data.address);
  requestPayload.append("firstname", data.fullname);
  requestPayload.append("lastname", data.fullname);
  requestPayload.append("province_id", data.provinceId);
  requestPayload.append("city", data.city);
  requestPayload.append("postal_code", data.postalCode);

  return requestPayload;
};



export const confirmServicePaymentPayload = (data) => {
  const requestPayload = new FormData();
  requestPayload.append("orderId", data.orderId);
  requestPayload.append("paymentIntentId", data.paymentIntentId);
  requestPayload.append("address", data.address);
  requestPayload.append("firstname", data.fullname);
  requestPayload.append("lastname", data.fullname);
  requestPayload.append("province_id", data.provinceId);
  requestPayload.append("city", data.city);
  requestPayload.append("postal_code", data.postalCode);
  requestPayload.append("booked_date", data.booked_date);
  requestPayload.append("booked_time", data.booked_time);
  requestPayload.append("listingId", data.listingId);



  return requestPayload;
};
