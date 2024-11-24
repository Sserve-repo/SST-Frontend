import { baseUrl } from "../config/constant";

export const createPayment = async () => {
  const form = new FormData();
  form.append("paymentMethodId", "pm_card_mastercard");
  try {
    const response = await fetch(
      `${baseUrl}/general/checkout/createProductPayment`,
      {
        headers: {
          Authorization: `Bearer ${localStorage
            .getItem("accessToken")
            ?.replaceAll('"', "")}`,
        },
        method: "POST",
        body: form,
      }
    );
    return response;
  } catch (error: any) {
    console.log("failed to make  payment", error);
  }
};
