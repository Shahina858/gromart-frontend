import { createContext, useContext, useState, useEffect } from "react";
import safeStorage from "../utils/safeStorage";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const stored = safeStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  /* =========================
     PERSIST CART
  ========================= */
  useEffect(() => {
    try {
      safeStorage.setItem("cart", JSON.stringify(cart));
    } catch (e) {
      console.warn("Could not persist cart", e);
    }
  }, [cart]);

  /* =========================
     ADD TO CART (FINAL FIX)
  ========================= */
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.productId === product._id
      );

      if (existing) {
        return prev.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          cartId: crypto.randomUUID(), // frontend-only
          productId: product._id,      // 🔥 BACKEND PRODUCT ID
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ];
    });
  };

  /* =========================
     REMOVE FROM CART
  ========================= */
  const removeFromCart = (cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  /* =========================
     UPDATE QUANTITY
  ========================= */
  const updateQuantity = (cartId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.cartId === cartId
          ? { ...item, quantity }
          : item
      )
    );
  };

  /* =========================
     CLEAR CART
  ========================= */
  const clearCart = () => setCart([]);

  /* =========================
     TOTAL PRICE
  ========================= */
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
