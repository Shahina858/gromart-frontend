import { createContext, useContext, useState, useEffect } from "react";
import safeStorage from "../utils/safeStorage";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const stored = safeStorage.getItem("wishlist");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    try {
      safeStorage.setItem("wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.warn("Could not persist wishlist to storage", e);
    }
  }, [wishlist]);

  const addToWishlist = (product) => {
    if (!wishlist.find((p) => p._id === product._id)) {
      setWishlist([...wishlist, product]);
    }
  };

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter((p) => p._id !== id));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
