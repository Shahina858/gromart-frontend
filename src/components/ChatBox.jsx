// src/components/ChatBox.jsx
import React, { useEffect, useRef, useState } from "react";
import socket from "../utils/socket";
import { getMessages, sendMessageAPI } from "../services/chatServices";
import safeStorage from "../utils/safeStorage";

export default function ChatBox({ chatUser }) {
  let me = null;
  try {
    const raw = safeStorage.getItem("user");
    me = raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn("Could not read current user from storage", e);
    me = null;
  }

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  /* =============================
     JOIN ROOM (ONCE)
  ============================== */
  useEffect(() => {
    if (!me?._id) return;

    socket.emit("join-room", {
      userId: me._id,
      role: me.role,
    });
  }, [me?._id, me?.role]);

  /* =============================
     LOAD CHAT HISTORY
  ============================== */
  useEffect(() => {
    if (!chatUser || !me) {
      setMessages([]);
      return;
    }

    getMessages(me._id, chatUser._id)
      .then((res) => setMessages(res.data || []))
      .catch(() => setMessages([]));
  }, [chatUser?._id, me?._id]);

  /* =============================
     SOCKET RECEIVE (DEDUP ✅)
  ============================== */
  useEffect(() => {
    if (!chatUser || !me) return;

    const handleReceive = (msg) => {
      const isThisChat =
        msg.senderId === chatUser._id &&
        msg.receiverId === me._id;

      if (!isThisChat) return;

      setMessages((prev) => {
        // ✅ STOP DUPLICATES HERE
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    socket.on("receive-message", handleReceive);
    return () => socket.off("receive-message", handleReceive);
  }, [chatUser?._id, me?._id]);

  /* =============================
     AUTO SCROLL
  ============================== */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* =============================
     SEND MESSAGE
  ============================== */
  const handleSend = async () => {
    if (!text.trim() || !chatUser || !me) return;

    const payload = {
      sender: { userId: me._id, role: me.role },
      receiver: { userId: chatUser._id, role: chatUser.role },
      text: text.trim(),
    };

    // ✅ Optimistic message
    const tempMsg = {
      _id: "tmp-" + Date.now(),
      senderId: me._id,
      senderRole: me.role,
      receiverId: chatUser._id,
      receiverRole: chatUser.role,
      text: payload.text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMsg]);
    socket.emit("send-message", payload);
    setText("");

    try {
      await sendMessageAPI(
        me._id,
        me.role,
        chatUser._id,
        chatUser.role,
        payload.text
      );
    } catch (err) {
      console.error("Save message error:", err);
    }
  };

  if (!me) return <p className="p-4 text-gray-500">Please login</p>;
  if (!chatUser) return <p className="p-4 text-gray-500">Select a contact</p>;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h3 className="font-semibold">{chatUser.name}</h3>
        <p className="text-xs text-gray-500 capitalize">{chatUser.role}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((m) => {
          const isMe = m.senderId === me._id;
          return (
            <div
              key={m._id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-[70%] ${
                  isMe
                    ? "bg-blue-600 text-white"
                    : "bg-white border text-gray-800"
                }`}
              >
                <p>{m.text}</p>
                <div className="text-[10px] text-right text-gray-400">
                  {new Date(m.createdAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 border rounded px-4 py-2"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
