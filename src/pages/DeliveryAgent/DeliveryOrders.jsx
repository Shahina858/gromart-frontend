import React, { useEffect, useState } from "react";
import API from "../../services/api";

export default function DeliveryOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/orders/delivery/my")
      .then((res) => setOrders(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-6 text-gray-500">Loading deliveries...</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🚚 My Deliveries</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">No deliveries assigned.</p>
      ) : (
        orders.map((o) => (
          <div key={o._id} className="bg-white p-4 rounded shadow mb-4">
            <p className="font-medium">Order ID: {o._id}</p>
            <p>Total: ₹{o.totalPrice}</p>
            <p className="capitalize">Status: {o.status}</p>
          </div>
        ))
      )}
    </div>
  );
}
