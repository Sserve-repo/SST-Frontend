"use client";

export const profilePayload = (data: any) => {
  const requestPayload = new FormData();

  const email_status =
    data.email_status === false ||
    data.email_status === 0 ||
    data.email_status === "0"
      ? "0"
      : "1";

  const twofa_status =
    data.twofa_status === false ||
    data.twofa_status === 0 ||
    data.twofa_status === "0"
      ? "0"
      : "1";

  // Append all form fields
  requestPayload.append("firstname", data.firstname);
  requestPayload.append("lastname", data.lastname);
  requestPayload.append("email", data.email);
  requestPayload.append("username", data.username);
  requestPayload.append("address", data.address);
  requestPayload.append("email_status", email_status);
  requestPayload.append("twofa_status", twofa_status);

  // Handle photo upload if it exists
  // if (data.user_photo instanceof File) {
  //   requestPayload.append("user_photo", data.user_photo);
  // }

  return requestPayload;
};
