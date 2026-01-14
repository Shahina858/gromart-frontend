import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import CartItem from "../../components/CartItem";

export default function Cart() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/customer/checkout");
  };

  /* =========================
     EMPTY CART
  ========================= */
  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">
        <h2 className="text-3xl font-bold mb-4">
          Your cart is empty 😔
        </h2>
        <Link to="/products" className="text-blue-600">
          Continue shopping
        </Link>
      </div>
    );
  }

  /* =========================
     CART PAGE
  ========================= */
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow my-8">
      <h2 className="text-2xl font-semibold mb-4">
        Your Cart
      </h2>

      {/* CART ITEMS */}
      <div className="space-y-4">
        {cart.map((item) => (
          <CartItem
            key={item.cartId}   // ✅ FIXED
            item={item}         // ✅ PASS DIRECTLY
          />
        ))}
      </div>

      {/* SUMMARY */}
      <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="text-gray-600">
            Items:{" "}
            {cart.reduce(
              (sum, item) => sum + item.quantity,
              0
            )}
          </div>

          <div className="text-xl font-bold">
            Total: ₹{total}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={clearCart}
            className="px-4 py-2 border rounded"
          >
            Clear
          </button>

          <button
            onClick={handleCheckout}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
