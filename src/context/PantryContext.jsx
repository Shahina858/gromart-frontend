import React, { createContext, useContext, useState } from "react";

const PantryContext = createContext();

export const PantryProvider = ({ children }) => {
  const [pantryItems, setPantryItems] = useState([]);

  const addPantryItem = (item) => {
    setPantryItems((prev) => {
      if (prev.find((p) => p._id === item._id || p.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removePantryItem = (id) => {
    setPantryItems((prev) =>
      prev.filter((item) => item._id !== id && item.id !== id)
    );
  };

  return (
    <PantryContext.Provider
      value={{ pantryItems, setPantryItems, addPantryItem, removePantryItem }}
    >
      {children}
    </PantryContext.Provider>
  );
};

export const usePantry = () => useContext(PantryContext);
