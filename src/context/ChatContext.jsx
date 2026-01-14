import React, { createContext, useState, useContext } from "react";

export const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState({});

  const sendMessage = (chatId, text) => {
    setMessages((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), { sender: "You", text }],
    }));
  };

  const receiveMessage = (chatId, text) => {
    setMessages((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), { sender: "Other", text }],
    }));
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, receiveMessage }}>
      {children}
    </ChatContext.Provider>
  );
};
