// src/utils/calculateTotal.js

export default function calculateTotal(cartItems) {
  return cartItems.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );
}
