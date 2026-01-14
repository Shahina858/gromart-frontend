import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  // 🔹 Image handling (supports full URL, uploads, fallback)
  const buildImageUrl = (img) => {
    if (!img) return "https://placehold.co/300x200?text=Product";
    if (img.startsWith("http")) return img;
    const rawBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const base = rawBase.replace(/\/api\/?$/, "").replace(/\/+$/, "");
    const path = img.replace(/\\\\/g, "/").replace(/^\/+/, "");
    return `${base}/${path}`;
  };

  const image = buildImageUrl(product?.image);

  return (
    <div className="group bg-white border rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-4 relative overflow-hidden hover:-translate-y-1">

      {/* Image */}
      <div className="w-full h-48 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
      <img
  src={image}
  alt={product.title || "Product"}
  className="object-contain h-full w-full transition-transform duration-300 group-hover:scale-105"
  loading="lazy"
/>

      </div>

      {/* Title */}
      <h3 className="mt-3 text-base font-semibold text-gray-900 line-clamp-1">
        {product.title}
      </h3>

      {/* Price */}
      <p className="text-gray-900 text-lg font-bold mt-1">
        ₹{product.price}
      </p>

      {/* Rating (UI only) */}
      <div className="flex items-center gap-1 text-yellow-500 text-sm mt-1">
        ★★★★☆
        <span className="text-gray-500 text-xs">(120)</span>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => addToCart(product)}
          className="flex-1 bg-gray-900 text-white py-2 rounded-lg font-medium
                     hover:bg-gray-800 transition shadow-sm active:scale-[0.97]"
          aria-label="Add to cart"
        >
          Add to Cart
        </button>

        <Link
          to={`/products/${product._id}`}
          className="px-4 py-2 border border-gray-900 text-gray-900 font-medium rounded-lg
                     hover:bg-gray-900 hover:text-white transition"
        >
          View
        </Link>
      </div>
    </div>
  );
}
