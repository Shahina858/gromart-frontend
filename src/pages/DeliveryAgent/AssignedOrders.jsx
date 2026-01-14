import React, { useEffect, useState } from "react";
import API from "../../services/api";

export default function AssignedOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  /* =========================
     FETCH ASSIGNED ORDERS
  ========================= */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/delivery/list");
        setOrders(res.data || []);
      } catch (err) {
        console.error("❌ Error fetching assigned orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  /* =========================
     UPDATE DELIVERY STATUS
  ========================= */
  const updateStatus = async (id, status) => {
    try {
      const res = await API.put(`/delivery/update/${id}`, {
        status,
      });

      setOrders((prev) =>
        prev.map((o) =>
          o._id === id
            ? { ...o, deliveryStatus: res.data.deliveryStatus }
            : o
        )
      );

      alert(`✅ Order marked as ${status.replaceAll("_", " ")}`);
    } catch (err) {
      console.error("❌ Status update failed:", err);
      alert(err.response?.data?.message || "Failed to update order status");
    }
  };

  /* =========================
     LOADING STATE
  ========================= */
  if (loading) {
    return (
      <p className="text-center mt-10 text-xl font-semibold">
        Loading assigned orders...
      </p>
    );
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-lg mt-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        📦 Assigned Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No assigned orders.
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o._id}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition flex justify-between items-center"
            >
              <div>
                <p className="text-lg font-semibold">Order #{o._id}</p>
                <p className="text-sm text-gray-500">
                  Customer: {o.user?.name || "N/A"}
                </p>
                <p className="text-sm">
                  Status: <b>{o.deliveryStatus}</b>
                </p>
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  disabled={o.deliveryStatus !== "placed"}
                  onClick={() => updateStatus(o._id, "packed")}
                  className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
                >
                  Packed
                </button>

                <button
                  disabled={o.deliveryStatus !== "packed"}
                  onClick={() =>
                    updateStatus(o._id, "out_for_delivery")
                  }
                  className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                  Out for Delivery
                </button>

                <button
                  disabled={o.deliveryStatus !== "out_for_delivery"}
                  onClick={() => updateStatus(o._id, "delivered")}
                  className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  Delivered
                </button>

                <button
                  onClick={() => setSelected(o)}
                  className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================
         ORDER DETAIL MODAL
      ========================= */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg space-y-4">
            <h3 className="text-xl font-bold">Order Details</h3>

            <p>
  <b>Customer:</b> {selected.user?.name || "N/A"}
</p>

<p>
  <b>Phone:</b> {selected.shippingAddress?.phone || "N/A"}
</p>

<p>
  <b>Address:</b> {selected.shippingAddress?.address || "N/A"}
</p>


            <button
              onClick={() => setSelected(null)}
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
