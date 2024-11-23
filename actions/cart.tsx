import { baseUrl } from "../config/constant";

export const fetchCart = async (setCart: (cart: any) => void) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const response = await fetch(`${baseUrl}/general/cart/fetchCart`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setCart(data.cart_items || []);
    } else {
      console.error("Failed to fetch cart");
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
};

export const addToCart = async (item: any, setCart: (cart: any) => void) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const response = await fetch(`${baseUrl}/general/cart/addToCart`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: item.id,
        quantity: item.quantity,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setCart(data.cart_items || []);
    } else {
      console.error("Failed to add to cart");
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
};

export const removeFromCart = async (
  id: number,
  setCart: (cart: any) => void
) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const response = await fetch(
      `${baseUrl}/general/cart/removeFromCart/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setCart(data.cart_items || []);
    } else {
      console.error("Failed to remove from cart");
    }
  } catch (error) {
    console.error("Error removing from cart:", error);
  }
};

export const updateQuantity = async (
  id: number,
  quantity: number,
  setCart: (cart: any) => void
) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const response = await fetch(`${baseUrl}/general/cart/updateQuantity`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: id,
        quantity,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setCart(data.cart_items || []);
    } else {
      console.error("Failed to update quantity");
    }
  } catch (error) {
    console.error("Error updating quantity:", error);
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
