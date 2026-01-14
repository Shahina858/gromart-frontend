import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full text-center">

        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <CheckCircle size={80} className="text-green-500" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Successful 🎉
        </h2>

        <p className="text-gray-500 mb-6">
          Your order has been placed successfully.
        </p>

        {/* Receipt Card */}
        <div className="border rounded-xl p-4 bg-gray-50 text-left mb-6">
          <p className="text-sm text-gray-600 mb-1">
            🧾 <span className="font-semibold">Order Status:</span>{" "}
            <span className="text-green-600 font-medium">Confirmed</span>
          </p>

          <p className="text-sm text-gray-600 mb-1">
            💳 <span className="font-semibold">Payment Status:</span>{" "}
            <span className="text-green-600 font-medium">Successful</span>
          </p>

          <p className="text-sm text-gray-600 mb-1">
            🚚 <span className="font-semibold">Delivery:</span>{" "}
            Expected in 1–2 days
          </p>

          <p className="text-sm text-gray-600">
            📍 <span className="font-semibold">Thank you for shopping with us!</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold"
          >
            Continue Shopping
          </button>

          <button
            onClick={() => navigate("/customer/my-orders")}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-lg font-semibold"
          >
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
}
