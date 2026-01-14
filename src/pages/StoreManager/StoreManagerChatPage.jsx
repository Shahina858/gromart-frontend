// src/pages/StoreManagerChatPage.jsx
import React, { useEffect, useState } from "react";
import ChatBox from "../../components/ChatBox";
import { getChatUsers } from "../../services/chatServices";

export default function StoreManagerChatPage() {
  const userRaw = localStorage.getItem("user");
  const currentUser = userRaw ? JSON.parse(userRaw) : null;

  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState("customer"); // customer | admin | deliveryAgent
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Load contacts safely (NO LOOP)
  useEffect(() => {
    if (!currentUser) return;

    let alive = true;
    setLoading(true);

    getChatUsers(filter)
      .then((res) => {
        if (alive) setContacts(res.data || []);
      })
      .catch((err) => {
        console.error("Load contacts error:", err);
        if (alive) setContacts([]);
      })
      .finally(() => alive && setLoading(false));

    // ✅ Reset selected chat when filter changes
    setSelected(null);

    return () => {
      alive = false;
    };
  }, [filter]); // ✅ ONLY filter — currentUser does NOT change

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      
      {/* CONTACT LIST */}
      <div className="bg-white shadow-xl px-4 py-5 rounded-xl h-[80vh] overflow-auto">
        <h2 className="text-xl font-bold mb-4">Contacts</h2>

        <div className="flex flex-wrap gap-2 mb-4">
          {[
            ["customer", "Customers"],
            ["admin", "Admin"],
            ["deliveryAgent", "Delivery"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1 rounded text-sm ${
                filter === key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : contacts.length === 0 ? (
          <p className="text-center text-gray-400 italic">No contacts</p>
        ) : (
          contacts.map((c) => (
            <div
              key={c._id}
              onClick={() => setSelected(c)}
              className={`p-3 mb-2 border rounded cursor-pointer transition ${
                selected?._id === c._id
                  ? "bg-blue-50 border-blue-400"
                  : "hover:bg-gray-100"
              }`}
            >
              <p className="font-semibold truncate">{c.name}</p>
              <p className="text-xs text-gray-500 capitalize">{c.role}</p>
            </div>
          ))
        )}
      </div>

      {/* CHAT BOX */}
      <div className="md:col-span-2 bg-white shadow-xl rounded-xl h-[80vh] p-4">
        <ChatBox chatUser={selected} />
      </div>
    </div>
  );
}
