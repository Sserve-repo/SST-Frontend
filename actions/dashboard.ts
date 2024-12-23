import { baseUrl } from "@/config/constant";
import Cookies from "js-cookie"

export const getOverview = async () => {
    try {
        const token = Cookies.get("accessToken");
        if (!token) return;

        const response = await fetch(
            `${baseUrl}/shopper/dashboard/productOverview`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        );
        return response;
    } catch (error: any) {
        console.log("failed to fetch product menu", error);
    }
};




export const getOrderlist = async () => {
    try {
        const token = Cookies.get("accessToken");
        if (!token) return;

        const response = await fetch(
            `${baseUrl}/shopper/dashboard/getOrderList`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        );
        return response;
    } catch (error: any) {
        console.log("failed to fetch product menu", error);
    }
};


export const getOrderDetail = async (id) => {
    try {
        const token = Cookies.get("accessToken");
        if (!token) return;

        const response = await fetch(
            `${baseUrl}/shopper/dashboard/getOrderItemsList/${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        );
        return response;
    } catch (error: any) {
        console.log("failed to fetch order details", );
    }
};

