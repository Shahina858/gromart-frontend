import API from "./api";

export const getChatUsers = (role) => {
  return API.get(`/chats/contacts/${role}`);
};

export const getMessages = (senderId, receiverId) => {
  return API.get(`/chats/messages/${senderId}/${receiverId}`);
};

export const sendMessageAPI = (
  senderId,
  senderRole,
  receiverId,
  receiverRole,
  text
) => {
  return API.post(`/chats/send`, {
    senderId,
    senderRole,
    receiverId,
    receiverRole,
    text,
  });
};
