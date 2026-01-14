import React, { useEffect, useState } from "react";
import API from "../../services/api";

/* =========================
   DATE FORMATTER
========================= */
const formatDate = (date) =>
  new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function DeliveryDashboard() {
  const [summary, setSummary] = useState({
    assigned: 0,
    packed: 0,
    outForDelivery: 0,
    completed: 0,
  });

  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest"); // newest | oldest

  /* =========================
     FETCH DATA
  ========================= */
  const fetchData = async () => {
    try {
      const summaryRes = await API.get("/delivery/dashboard");
      const ordersRes = await API.get("/delivery/list");

      setSummary(summaryRes.data || {});
      setDeliveries(ordersRes.data || []);
    } catch (e) {
      console.error("❌ Delivery fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* =========================
     SORTED DELIVERIES
  ========================= */
  const sortedDeliveries = [...deliveries].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  /* =========================
     UPDATE STATUS
  ========================= */
  const updateStatus = async (id, status) => {
    if (!window.confirm(`Mark order as ${status.replaceAll("_", " ")}?`)) return;

    try {
      await API.put(`/delivery/update/${id}`, { status });
      fetchData();
    } catch (err) {
      alert("Failed to update status");
      console.error(err);
    }
  };

  /* =========================
     LOADING
  ========================= */
  if (loading) {
    return (
      <div className="text-center py-10 text-xl font-semibold">
        Loading delivery dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">
        🚚 Delivery Agent Dashboard
      </h2>

      {/* =========================
         SUMMARY
      ========================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          ["Assigned", summary.assigned, "bg-blue-100 text-blue-700"],
          ["Packed", summary.packed, "bg-yellow-100 text-yellow-700"],
          [
            "Out for Delivery",
            summary.outForDelivery,
            "bg-purple-100 text-purple-700",
          ],
          ["Delivered", summary.completed, "bg-green-100 text-green-700"],
        ].map(([label, value, color]) => (
          <div
            key={label}
            className={`p-4 rounded-xl font-bold shadow ${color}`}
          >
            <div className="text-sm">{label}</div>
            <div className="text-2xl">{value || 0}</div>
          </div>
        ))}
      </div>

      {/* =========================
         DELIVERY LIST
      ========================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            📦 Assigned Deliveries
          </h3>

          {/* SORT DROPDOWN */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border px-3 py-2 rounded text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {sortedDeliveries.length === 0 ? (
          <p className="text-center text-gray-500">
            No deliveries assigned.
          </p>
        ) : (
          <table className="w-full text-left">
            <thead className="border-b text-gray-700">
              <tr>
                <th className="py-2">Order ID</th>
                <th>Customer</th>
                <th>Address</th>
                <th>Placed On</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedDeliveries.map((d) => (
                <tr
                  key={d._id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="py-2">{d._id}</td>

                  <td>{d.user?.name || "N/A"}</td>

                  <td>{d.shippingAddress?.address || "N/A"}</td>

                  <td className="text-sm text-gray-600">
                    {formatDate(d.createdAt)}
                  </td>

                  <td className="capitalize">
                    {d.deliveryStatus.replaceAll("_", " ")}
                  </td>

                  <td className="text-right space-x-2">
                    {d.deliveryStatus === "placed" && (
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                        onClick={() => updateStatus(d._id, "packed")}
                      >
                        Pack
                      </button>
                    )}

                    {d.deliveryStatus === "packed" && (
                      <button
                        className="bg-purple-600 text-white px-3 py-1 rounded"
                        onClick={() =>
                          updateStatus(d._id, "out_for_delivery")
                        }
                      >
                        Start
                      </button>
                    )}

                    {d.deliveryStatus === "out_for_delivery" && (
                      <button
                        className="bg-green-600 text-white px-3 py-1 rounded"
                        onClick={() => updateStatus(d._id, "delivered")}
                      >
                        Complete
                      </button>
                    )}

                    <button
                      className="bg-gray-600 text-white px-3 py-1 rounded"
                      onClick={() => setSelectedDelivery(d)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* =========================
         MODAL
      ========================= */}
      {selectedDelivery && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-2">
            <h3 className="text-xl font-bold mb-3">
              Order Details
            </h3>

            <p>
              <b>Name:</b> {selectedDelivery.user?.name || "N/A"}
            </p>

            <p>
              <b>Phone:</b>{" "}
              {selectedDelivery.shippingAddress?.phone || "N/A"}
            </p>

            <p>
              <b>Address:</b>{" "}
              {selectedDelivery.shippingAddress?.address || "N/A"}
            </p>

            <p>
              <b>Placed On:</b>{" "}
              {formatDate(selectedDelivery.createdAt)}
            </p>

            <button
              onClick={() => setSelectedDelivery(null)}
              className="mt-4 w-full bg-red-500 text-white py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
