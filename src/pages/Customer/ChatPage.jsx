import React, { useEffect, useMemo, useState } from "react";
import ChatBox from "../../components/ChatBox";
import { getChatUsers } from "../../services/chatServices";

export default function ChatPage() {
  // ✅ Read once
  const currentUser = useMemo(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  }, []);

  const [contacts, setContacts] = useState([]);
  const [activeFilter, setActiveFilter] = useState("admin");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch contacts ONLY when filter changes
  useEffect(() => {
    if (!currentUser) return;

    let mounted = true;
    setLoading(true);

    getChatUsers(activeFilter)
      .then(res => {
        if (mounted) {
          setContacts(res.data || []);
        }
      })
      .catch(console.error)
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [activeFilter, currentUser]);

  // ✅ Clear selected ONLY when filter changes
  useEffect(() => {
    setSelected(null);
  }, [activeFilter]);

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* CONTACT LIST */}
      <div className="bg-white shadow-xl px-4 py-5 rounded-xl h-[80vh] overflow-auto">
        <h2 className="text-xl font-bold mb-4">Contacts</h2>

        {/* FILTER BUTTONS */}
        <div className="flex gap-2 mb-4">
          {["admin", "deliveryAgent", "storeManager"].map(type => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`px-3 py-1 rounded capitalize transition ${
                activeFilter === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {type.replace("Agent", "")}
            </button>
          ))}
        </div>

        {/* CONTACTS */}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : contacts.length === 0 ? (
          <p className="text-center text-gray-500 italic">No contacts</p>
        ) : (
          contacts.map(c => (
            <div
              key={c._id}
              onClick={() => setSelected(c)}
              className={`p-3 mb-2 border rounded cursor-pointer transition ${
                selected?._id === c._id
                  ? "bg-blue-50 border-blue-300"
                  : "hover:bg-gray-100"
              }`}
            >
              <p className="font-semibold">{c.name}</p>
              <p className="text-xs text-gray-500 capitalize">{c.role}</p>
            </div>
          ))
        )}
      </div>

      {/* CHAT BOX */}
      <div className="col-span-2 bg-white shadow-xl rounded-xl h-[80vh] p-4">
        {selected ? (
          <ChatBox chatUser={selected} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Select a contact to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
