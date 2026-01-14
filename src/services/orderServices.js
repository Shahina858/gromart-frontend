import api from "./api";
export const createOrder = (order) => api.post("/orders", order);
export const getOrdersByUser = (userId) => api.get(`/orders/${userId}`);
