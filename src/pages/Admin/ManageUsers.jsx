import React, { useEffect, useMemo, useState } from "react";
import API from "../../services/api";

const TABS = [
  { key: "customer", label: "Customers" },
  { key: "storeManager", label: "Store Managers" },
  { key: "deliveryAgent", label: "Delivery Agents" },
];

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("customer");
  const [loading, setLoading] = useState(true);

  /* =============================
      FETCH USERS
  ============================= */
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await API.get("/admin/users");
        setUsers(res.data || []);
      } catch (err) {
        console.error("❌ Failed to load users", err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  /* =============================
      GROUP USERS
  ============================= */
  const grouped = useMemo(() => {
    return {
      customer: users.filter((u) => u.role === "customer"),
      storeManager: users.filter((u) => u.role === "storeManager"),
      deliveryAgent: users.filter((u) => u.role === "deliveryAgent"),
    };
  }, [users]);

  /* =============================
      TOGGLE ACTIVE
  ============================= */
  const toggleActive = async (id) => {
    try {
      const res = await API.patch(`/admin/users/${id}`);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, active: res.data.active } : u
        )
      );
    } catch (err) {
      console.error("❌ Toggle error:", err);
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading users…</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800">User Management</h2>
        <p className="text-gray-500 text-sm">
          Manage customers, stores & delivery agents
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-3 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all
              ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            {tab.label}
            <span className="ml-2 text-xs opacity-80">
              ({grouped[tab.key].length})
            </span>
          </button>
        ))}
      </div>

      {/* USER GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {grouped[activeTab].length === 0 ? (
          <p className="text-gray-500 col-span-full text-center">
            No users found
          </p>
        ) : (
          grouped[activeTab].map((u) => (
            <div
              key={u._id}
              className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition p-5"
            >
              {/* USER INFO */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">{u.name}</h3>
                  <p className="text-sm text-gray-500">{u.email}</p>
                </div>

                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium
                    ${
                      u.active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                >
                  {u.active ? "Active" : "Blocked"}
                </span>
              </div>

              {/* ROLE */}
              <div className="mt-3 text-xs text-gray-500 uppercase tracking-wide">
                Role: {u.role}
              </div>

              {/* ACTION */}
              <div className="mt-4">
                <button
                  onClick={() => toggleActive(u._id)}
                  className={`w-full py-2 rounded-lg font-medium text-sm transition
                    ${
                      u.active
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                >
                  {u.active ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
