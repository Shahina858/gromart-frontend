import React from "react";
import { useWishlist } from "../../context/WishlistContext.jsx";

import { useCart } from "../../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (wishlist.length === 0)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">
        <h1 className="text-3xl font-bold mb-4">Your Wishlist is empty 😔</h1>
        <button
          onClick={() => navigate("/products")}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Browse Products
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 py-12 px-6">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
        Your Wishlist
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {wishlist.map((p) => (
          <div
            key={p._id}
            className="bg-white rounded-3xl border shadow-md p-4 flex flex-col items-center"
          >
            <img
              src={p.image || "https://via.placeholder.com/150"}
              alt={p.name}
              className="w-full h-48 object-contain rounded-2xl mb-4 cursor-pointer"
              onClick={() => navigate(`/product/${p._id}`)}
            />
            <h2 className="text-lg font-semibold text-gray-800 text-center mb-2">
              {p.name}
            </h2>
            <p className="text-green-600 font-bold text-xl mb-4">₹{p.price}</p>
            <div className="flex gap-2">
              <button
                onClick={() => addToCart(p)}
                className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Add to Cart 🛒
              </button>
              <button
                onClick={() => removeFromWishlist(p._id)}
                className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Remove ❌
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
