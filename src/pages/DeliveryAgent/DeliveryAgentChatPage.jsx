// src/pages/DeliveryAgentChatPage.jsx
import React, { useEffect, useState } from "react";
import ChatBox from "../../components/ChatBox";
import { getChatUsers } from "../../services/chatServices";

export default function DeliveryAgentChatPage() {
  const userRaw = localStorage.getItem("user");
  const currentUser = userRaw ? JSON.parse(userRaw) : null;

  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState("customer"); // customer | admin
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ===============================
     ✅ FETCH CONTACTS (NO LOOP)
  ================================ */
  useEffect(() => {
    if (!currentUser?._id) return;

    setLoading(true);

    getChatUsers(filter)
      .then((res) => {
        setContacts(res.data || []);
      })
      .catch((err) => {
        console.error("Chat users fetch error:", err);
        setContacts([]);
      })
      .finally(() => setLoading(false));
  }, [filter, currentUser?._id]);

  /* ===============================
     ✅ RESET SELECTED ONLY ON FILTER CHANGE
  ================================ */
  useEffect(() => {
    setSelected(null);
  }, [filter]);

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Contacts */}
      <div className="bg-white shadow-xl px-4 py-5 rounded-xl h-[80vh] overflow-auto">
        <h2 className="text-xl font-bold mb-4">Contacts</h2>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter("customer")}
            className={`px-3 py-1 rounded ${
              filter === "customer"
                ? "bg-blue-600 text-white"
                : "bg-gray-100"
            }`}
          >
            Customers
          </button>

          <button
            onClick={() => setFilter("admin")}
            className={`px-3 py-1 rounded ${
              filter === "admin"
                ? "bg-blue-600 text-white"
                : "bg-gray-100"
            }`}
          >
            Admin
          </button>
        </div>

        {/* List */}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : contacts.length === 0 ? (
          <p className="text-center text-gray-500 italic">No contacts</p>
        ) : (
          contacts.map((c) => (
            <button
              key={c._id}
              onClick={() => setSelected(c)}
              className={`w-full text-left p-3 mb-2 border rounded transition ${
                selected?._id === c._id
                  ? "bg-blue-50 border-blue-300"
                  : "hover:bg-gray-100"
              }`}
            >
              <p className="font-semibold truncate">{c.name}</p>
              <p className="text-xs text-gray-500">{c.role}</p>
            </button>
          ))
        )}
      </div>

      {/* Chat */}
      <div className="col-span-2 bg-white shadow-xl rounded-xl h-[80vh] p-4">
        <ChatBox chatUser={selected} />
      </div>
    </div>
  );
}
