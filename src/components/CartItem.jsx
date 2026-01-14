import React from "react";
import { useCart } from "../context/CartContext";

export default function CartItem({ item }) {
  const { removeFromCart, updateQuantity } = useCart();

  return (
    <div className="flex items-center justify-between p-4 border rounded shadow">
      <div className="flex items-center gap-4">
        <img
          src={item.image || "https://placehold.co/80x80?text=No+Image"}

          alt={item.name}
          className="w-16 h-16 object-contain rounded"
        />
        <div>
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-green-600 font-bold">₹{item.price}</p>
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={() => updateQuantity(item._id, item.quantity - 1)}
              className="px-2 py-1 bg-gray-200 rounded"
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item._id, item.quantity + 1)}
              className="px-2 py-1 bg-gray-200 rounded"
            >
              +
            </button>
          </div>
        </div>
      </div>
      <button
        onClick={() => removeFromCart(item._id)}
        className="px-2 py-1 bg-red-500 text-white rounded"
      >
        Remove
      </button>
    </div>
  );
}
