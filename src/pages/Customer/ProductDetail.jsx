import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import { useCart } from "../../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="text-center mt-10">Loading product...</p>;
  }

  if (!product) {
    return <p className="text-center mt-10">Product not found</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-6">
      {/* IMAGE */}
      <img
        src={product.image || "/placeholder.png"}
        alt={product.title}
        className="w-full h-96 object-cover rounded-xl shadow"
      />

      {/* DETAILS */}
      <div>
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <p className="text-gray-600 mt-2">{product.description}</p>

        <p className="text-2xl font-semibold mt-4 text-orange-600">
          ₹{product.price}
        </p>

        <button
          onClick={() => addToCart(product, 1)}
          className="mt-6 bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
