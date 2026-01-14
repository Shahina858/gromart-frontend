// utils/helpers.js

// Format date utility
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Example: capitalize first letter
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Merge two objects safely
export const mergeObjects = (obj1, obj2) => ({ ...obj1, ...obj2 });
