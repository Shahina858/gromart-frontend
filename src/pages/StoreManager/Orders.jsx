import React, { useEffect, useState } from "react";
import API from "../../services/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/store-manager/orders") // ✅ FIXED
      .then((res) => {
        setOrders(res.data || []);
      })
      .catch((err) => console.error("Order fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading orders...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">📦 Store Orders</h2>

      {orders.length === 0 ? (
        <div className="text-gray-500">No orders found.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">
                    Order #{o._id.slice(-6)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {o.user?.name || "Customer"}
                  </div>
                </div>

                <div className="font-bold text-green-600">
                  ₹{o.totalPrice}
                </div>
              </div>

              <div className="mt-2 text-sm text-gray-600">
                Payment:{" "}
                <span className="font-medium capitalize">
                  {o.paymentMethod} ({o.paymentStatus})
                </span>
              </div>

              <div className="mt-1 text-sm">
                Status:{" "}
                <span className="font-medium capitalize">{o.status}</span>
              </div>

              <div className="mt-3 text-sm text-gray-500">
                Items: {o.orderItems.length}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
