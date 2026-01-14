import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cart, total, clearCart } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMode, setPaymentMode] = useState("cod");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* =========================
     CHECKOUT HANDLER (MULTI STORE)
  ========================= */
  const handleCheckout = async () => {
    /* ---------- BASIC VALIDATION ---------- */
    if (!cart.length) {
      alert("🛒 Cart is empty");
      return;
    }

    if (!name || !phone || !address) {
      alert("Please fill all required fields.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert("Enter a valid 10-digit phone number");
      return;
    }

    /* ---------- GROUP CART BY STORE ---------- */
    const groupedByStore = {};

    cart.forEach((item) => {
      if (!groupedByStore[item.storeId]) {
        groupedByStore[item.storeId] = [];
      }
      groupedByStore[item.storeId].push(item);
    });

    const storeIds = Object.keys(groupedByStore);

    /* ---------- ONLINE PAYMENT ---------- */
    if (paymentMode === "online") {
      navigate("/customer/bank-details", {
        state: { name, phone, address, cart, total },
      });
      return;
    }

    /* ---------- CASH ON DELIVERY ---------- */
    setLoading(true);

    try {
      for (const storeId of storeIds) {
        const storeItems = groupedByStore[storeId];

        const storeTotal = storeItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        const payload = {
          orderItems: storeItems.map((item) => ({
            product: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),

          shippingAddress: {
            name,
            phone,
            address,
          },

          storeId,
          totalPrice: Number(storeTotal),
          paymentMethod: "COD",
        };

        console.log("✅ Creating order for store:", storeId, payload);

        await API.post("/orders", payload);
      }

      clearCart();
      alert("✅ Orders placed successfully from multiple stores!");
      navigate("/customer/order-success");
    } catch (err) {
      console.error("❌ Checkout error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-10 border">
      <h2 className="text-3xl font-bold mb-6">🛒 Checkout</h2>

      {/* ADDRESS */}
      <div className="space-y-4 mb-6">
        <Input label="Full Name" value={name} setValue={setName} />
        <Input label="Phone" value={phone} setValue={setPhone} />
        <Textarea label="Address" value={address} setValue={setAddress} />
      </div>

      {/* PAYMENT MODE */}
      <div className="mb-6">
        <label className="font-semibold mb-2 block">Payment Mode</label>
        <div className="flex gap-6">
          <Radio
            label="💵 Cash on Delivery"
            value="cod"
            checked={paymentMode === "cod"}
            onChange={setPaymentMode}
          />
          <Radio
            label="💳 Online Payment"
            value="online"
            checked={paymentMode === "online"}
            onChange={setPaymentMode}
          />
        </div>
      </div>

      {/* SUMMARY */}
      <div className="mb-6 bg-gray-50 p-4 rounded border">
        <p>🧾 Items: <b>{cart.length}</b></p>
        <p className="text-lg font-semibold">💰 Total: ₹{total}</p>
        <p className="text-sm text-gray-500">
          🏪 Stores: {new Set(cart.map((i) => i.storeId)).size}
        </p>
      </div>

      {/* ACTION */}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full py-3 rounded-lg bg-gray-900 text-white font-semibold disabled:opacity-50"
      >
        {loading ? "Processing..." : "Place Orders"}
      </button>
    </div>
  );
}

/* =========================
   UI HELPERS
========================= */

const Input = ({ label, value, setValue }) => (
  <div>
    <label className="font-medium">{label}</label>
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="border p-3 rounded w-full"
    />
  </div>
);

const Textarea = ({ label, value, setValue }) => (
  <div>
    <label className="font-medium">{label}</label>
    <textarea
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="border p-3 rounded w-full"
    />
  </div>
);

const Radio = ({ label, value, checked, onChange }) => (
  <label className="flex gap-2 cursor-pointer">
    <input
      type="radio"
      checked={checked}
      onChange={() => onChange(value)}
    />
    {label}
  </label>
);
