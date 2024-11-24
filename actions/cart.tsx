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

export const addToCart = async (cart) => {
  const token = localStorage.getItem("accessToken");

  try {
    const responses = await Promise.all(
      JSON.parse(cart).map(async (item) => {
        const form = new FormData();
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

        // Handle individual response errors
        if (!response.ok) {
          console.error(
            `Failed to add item ${item.id} to cart`,
            await response.text()
          );
        }

        return response.json();
      })
    );

    console.log("All items processed:", responses);
    return responses;
  } catch (error) {
    console.error("Failed to add items to cart:", error);
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
