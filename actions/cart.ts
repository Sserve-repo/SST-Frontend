import { baseUrl } from "../config/constant";

export const fetchCart = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const response = await fetch(`${baseUrl}/general/cart/fetchCart`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
};


export const addOrUpdateCart = async (cart) => {
  const token = localStorage.getItem("accessToken")?.replaceAll('"', "");
  try {
    const form = new FormData();
    form.append("product_id", cart.product_id);
    form.append("quantity", cart.quantity);
    const response = await fetch(`${baseUrl}/general/cart/addToCart`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });
    return response;
  } catch (error) {
    console.error("Failed to add items to cart:", error);
  }
};

export const removeCartItem = async (
  cartId
) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const response = await fetch(
      `${baseUrl}/general/cart/removeFromCart/${cartId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response
  } catch (error) {
    console.error("Error removing from cart:", error);
  }
};


export const clearCart = async (setCart: (cart: any) => void) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const response = await fetch(`${baseUrl}/general/cart/clearCart`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      setCart([]);
    } else {
      console.error("Failed to clear cart");
    }
  } catch (error) {
    console.error("Error clearing cart:", error);
  }
};
