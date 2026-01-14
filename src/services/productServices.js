// Mock API, replace with real API calls if needed
const products = [
  { id: "1", name: "Apple", description: "Fresh red apples", price: 1, image: "https://via.placeholder.com/150" },
  { id: "2", name: "Banana", description: "Yellow bananas", price: 0.5, image: "https://via.placeholder.com/150" },
  { id: "3", name: "Milk", description: "Organic milk", price: 2, image: "https://via.placeholder.com/150" },
];

export const getProducts = async () => {
  return new Promise((resolve) => setTimeout(() => resolve(products), 500));
};

// export const getProductById = async (id) => {
//   return new Promise((resolve) =>
//     setTimeout(() => resolve(products.find((p) => p.id === id)), 500)
//   );
// };


import API from "./api";

export const getProductById = async (id) => {
  try {
    const res = await API.get(`/products/${id}`);
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    return null;
  }
};
