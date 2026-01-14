import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function AdminAssignDelivery({ order }) {
  const [agents, setAgents] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    API.get("/users?role=deliveryAgent").then((res) =>
      setAgents(res.data)
    );
  }, []);

  const assign = async () => {
    await API.put(`/admin/orders/${order._id}/assign`, {
      deliveryAgentId: selected,
    });
    alert("✅ Delivery assigned");
  };

  return (
    <div className="mt-4">
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="border p-2 rounded w-full"
      >
        <option value="">Select Delivery Agent</option>
        {agents.map((a) => (
          <option key={a._id} value={a._id}>
            {a.name}
          </option>
        ))}
      </select>

      <button
        onClick={assign}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Assign Delivery
      </button>
    </div>
  );
}
