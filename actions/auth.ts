import { baseUrl } from "../config/constant";
import Cookies from "js-cookie";

export const isAuthenticated = async () => {
  const token = Cookies.get("accessToken");
  try {
    const response = await fetch(`${baseUrl}/general/user/getUserDetails/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (response.ok && response.status === 200) {
      return data;
    }
  } catch (error: any) {
    console.log("Form validation failed", error);
  }
};

export const getUserDetails = async (email: any) => {
  try {
    const response = await fetch(
      `${baseUrl}/general/user/getUserDetails/${email}`
    );
    const res = await response.json();
    if (response.ok && response.status === 200) {
      return res;
    }
  } catch (error: any) {
    console.log("Form validation failed", error);
  }
};

export const getLoggedInUserDetails = async () => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) return;
    const response = await fetch(
      `${baseUrl}/shopper/dashboard/getUserProfile`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const res = await response.json();
    if (response.ok && response.status === 200) {
      return res;
    }
  } catch (error: any) {
    console.log("Form validation failed", error);
  }
};

export const registerUser = async (userType: string, requestPayload: any) => {
  try {
    const response = await fetch(
      `${baseUrl}/${userType}/auth/registerWithEmail`,
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

export const loginUser = async (requestPayload: any) => {
  try {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      body: requestPayload,
    });
    return response;
  } catch (error: any) {
    console.log("Login failed", error);
  }
};

export const resendOtp = async (email: any) => {
  const form = new FormData();
  form.append("email", email);
  try {
    const response = await fetch(`${baseUrl}/auth/resendOTP`, {
      method: "POST",
      body: form,
    });
    return response;
  } catch (error: any) {
    console.log("Resend otp failed", error);
  }
};
