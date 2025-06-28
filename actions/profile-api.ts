import { baseUrl } from "@/config/constant";
import Cookies from "js-cookie";

export interface UserProfile {
    id: number;
    firstname: string;
    lastname: string;
    username: string | null;
    phone: string | null;
    user_photo: string | null;
    email: string;
    email_verified_at: string | null;
    verified_status: string;
    active_status: number;
    is_completed: string;
    email_status: string | number;
    twofa_status: string | number;
    user_type: string;
    role_id: number | null;
    address: string | null;
    created_at: string;
    updated_at: string;
}

export interface ProfileUpdateData {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    address: string;
    twofa_status: string;
    email_status: string;
}

export async function getUserProfile() {
    try {
        const token = Cookies.get("accessToken");
        if (!token) {
            throw new Error("No access token found");
        }

        const response = await fetch(
            `${baseUrl}/dashboard/profile/getUserProfile`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        console.log("User Profile Data:", data);

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch user profile");
        }

        return { data: data.data, error: null };
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return {
            data: null,
            error: error instanceof Error ? error.message : "Failed to fetch user profile",
        };
    }
}

export async function updateUserProfile(
    profileData: ProfileUpdateData
) {
    try {
        const token = Cookies.get("accessToken");
        if (!token) throw new Error("No access token found");

        const formData = new FormData();
        Object.entries(profileData).forEach(([key, value]) => {
            formData.append(key, value);
        });

        const response = await fetch(
            `${baseUrl}/dashboard/profile/updateUserProfile`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to update user profile");
        }

        const updatedUser = data.data["User Details"];
        const newToken = data.data.token ?? token; // fallback to old token if none returned
        console.log("Updated User:", updatedUser);
        console.log("New Token:", newToken);

        return { data: updatedUser, token: newToken, error: null };
    } catch (error) {
        console.error("Error updating user profile:", error);
        return {
            data: null,
            error:
                error instanceof Error ? error.message : "Failed to update user profile",
        };
    }
}


export async function updateUserPhoto(photoFile: File) {
    try {
        const token = Cookies.get("accessToken");
        if (!token) {
            throw new Error("No access token found");
        }

        const formData = new FormData();
        formData.append("user_photo", photoFile);

        const response = await fetch(
            `${baseUrl}/dashboard/profile/updateUserPhoto`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to update user photo");
        }

        return { data: data.data["User Details"], error: null };
    } catch (error) {
        console.error("Error updating user photo:", error);
        return {
            data: null,
            error: error instanceof Error ? error.message : "Failed to update user photo",
        };
    }
}