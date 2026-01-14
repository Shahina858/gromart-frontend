import React, { useEffect, useState } from "react";
import API from "../../services/api";
import OrderTimeline from "../../components/OrderTimeline";

/* =========================
   DELIVERY DATE HELPER
========================= */
const getExpectedDeliveryDate = (createdAt, status) => {
  if (!createdAt) return "N/A";

  const baseDate = new Date(createdAt);
  let daysToAdd = 0;

  switch (status) {
    case "placed":
      daysToAdd = 5;
      break;
    case "packed":
      daysToAdd = 3;
      break;
    case "out_for_delivery":
      daysToAdd = 1;
      break;
    case "delivered":
      return `Delivered on ${baseDate.toLocaleDateString()}`;
    default:
      daysToAdd = 5;
  }

  const expected = new Date(baseDate);
  expected.setDate(expected.getDate() + daysToAdd);

  return expected.toLocaleDateString();
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/my");
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("❌ Fetch orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (id) => {
    if (!window.confirm("Cancel this order?")) return;

    try {
      const res = await API.put(`/orders/${id}/cancel`);
      alert(res.data.message);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Cancel failed");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading orders...</p>;
  }

  if (!orders.length) {
    return (
      <p className="text-center mt-10 text-gray-500">
        You have no orders yet.
      </p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 space-y-6">
      <h2 className="text-3xl font-bold">📦 My Orders</h2>

      {orders.map((order) => {
        const expectedDate = getExpectedDeliveryDate(
          order.createdAt,
          order.deliveryStatus
        );

        return (
          <div
            key={order._id}
            className="bg-white p-6 rounded-xl shadow border space-y-4"
          >
            {/* HEADER */}
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Order ID: {order._id}
                </p>
                <p className="text-sm text-gray-500">
                  Ordered on{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className="font-bold text-green-600 text-lg">
                ₹{order.totalPrice}
              </p>
            </div>

            {/* ITEMS */}
            <div className="space-y-2 border-t pt-3">
              {order.orderItems.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.product?.name} × {item.quantity}
                  </span>
                  <span>
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* TIMELINE */}
            <OrderTimeline status={order.deliveryStatus} />

            {/* FOOTER */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm capitalize">
                  Status:{" "}
                  <b className="text-blue-600">
                    {order.deliveryStatus.replace(/_/g, " ")}
                  </b>
                </p>

                <p className="text-sm text-gray-500">
                  📅 Expected Delivery:{" "}
                  <span className="font-medium">
                    {expectedDate}
                  </span>
                </p>
              </div>

              {order.deliveryStatus === "placed" && (
                <button
                  onClick={() => cancelOrder(order._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
