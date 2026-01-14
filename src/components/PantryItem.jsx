import React from "react";

const PantryItem = ({ item }) => {
  return (
    <div className="border p-2 rounded mb-2">
      <h4 className="font-bold">{item.name}</h4>
      <p>Quantity: {item.quantity}</p>
    </div>
  );
};

export default PantryItem;
