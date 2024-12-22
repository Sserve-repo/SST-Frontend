import { baseUrl } from "../config/constant";

export const creatOtp = async (requestPayload: any) => {
  try {
    const response = await fetch(`${baseUrl}/shopper/auth/otpVerification`, {
      method: "POST",
      body: requestPayload,
    });
    return response;
  } catch (error: any) {
    console.log("Otp verification creation failed", error);
  }
};
