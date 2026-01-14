import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useCart } from "../../context/CartContext";

export default function BankDetails() {
  const { clearCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const { name, phone, address, cart = [], total = 0 } =
    location.state || {};

  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================
     SAFETY CHECK
  ========================= */
  if (!location.state || !cart.length) {
    return (
      <div className="text-center mt-16 text-gray-600">
        Invalid payment session
      </div>
    );
  }

  /* =========================
     HANDLE ONLINE PAYMENT
  ========================= */
  const handlePayment = async () => {
    if (!bankName || !accountNumber || !ifsc) {
      alert("Please fill all bank details");
      return;
    }

    // 🔒 Ensure productId exists
    const invalidItem = cart.find((i) => !i.productId);
    if (invalidItem) {
      alert("Invalid cart item. Please re-add product.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        orderItems: cart.map((item) => ({
          product: item.productId, // ✅ FIXED
          quantity: item.quantity,
          price: item.price,
        })),

        shippingAddress: {
          name,
          phone,
          address,
          bankName,
          accountNumber,
          ifsc,
        },

        totalPrice: Number(total),
        paymentMethod: "ONLINE", // ✅ ENUM MATCH
      };

      console.log("✅ Online Payment Payload:", payload);

      await API.post("/orders", payload);

      clearCart();
      alert("✅ Payment successful!");
      navigate("/customer/order-success");
    } catch (err) {
      console.error("❌ Payment failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg border">
      <h2 className="text-2xl font-bold mb-6">🏦 Bank Payment Details</h2>

      <div className="space-y-4 mb-6">
        <input
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          className="border p-3 rounded-lg w-full"
          placeholder="Bank Name"
        />

        <input
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="border p-3 rounded-lg w-full"
          placeholder="Account Number"
        />

        <input
          value={ifsc}
          onChange={(e) => setIfsc(e.target.value)}
          className="border p-3 rounded-lg w-full"
          placeholder="IFSC Code"
        />
      </div>

      <div className="mb-6 bg-gray-50 p-4 rounded-lg border">
        <p className="text-lg font-semibold">
          💰 Total Amount: ₹{Number(total).toLocaleString()}
        </p>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold disabled:opacity-50"
      >
        {loading ? "Processing Payment..." : "Complete Payment"}
      </button>
    </div>
  );
}
