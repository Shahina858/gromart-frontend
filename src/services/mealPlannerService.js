// src/services/mealPlannerService.js
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

// 🍽 Get ingredients from backend (TheMealDB)
export const getIngredients = async (mealName) => {
  const res = await axios.get(`${API_BASE}/meal-planner/ingredients/${mealName}`);
  return res.data;
};

// 📦 Fetch saved plan
export const generatePlan = async (userId) => {
  const res = await axios.get(`${API_BASE}/meal-planner/${userId}`);
  return res.data;
};

// ➕ Create meal plan
export const createPlan = async (userId, payload) => {
  const res = await axios.post(`${API_BASE}/meal-planner/${userId}`, payload);
  return res.data;
};

// ✏ Update meal plan
export const updatePlan = async (planId, payload) => {
  const res = await axios.put(`${API_BASE}/meal-planner/${planId}`, payload);
  return res.data;
};
// Suggest meals by keyword
export const suggestMeals = async (query) => {
  if (!query) return [];

  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.meals ? data.meals.map((m) => m.strMeal) : [];
};
// export const suggestMeals = async (query) => {
//   const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
//   const data = await res.json();
//   return data.meals ? data.meals.map((m) => m.strMeal) : [];
// };


