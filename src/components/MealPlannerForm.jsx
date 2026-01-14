import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiLoader, FiSave, FiCheckCircle } from "react-icons/fi";

/* ================= API HELPERS ================= */

const searchMeals = async (query) => {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
  );
  const data = await res.json();
  return data.meals || [];
};

const fetchMealDetails = async (mealName) => {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`
  );
  const data = await res.json();
  return data.meals?.[0];
};

export default function MealPlannerForm({ handleSubmit }) {
  const [meals, setMeals] = useState([
    { name: "", ingredients: [], image: "", category: "", area: "" },
  ]);

  const [loadingIndex, setLoadingIndex] = useState(null);
  const [suggestions, setSuggestions] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  /* ================= INPUT CHANGE ================= */
  const handleChange = async (index, value) => {
    const updated = [...meals];
    updated[index].name = value;
    setMeals(updated);

    if (value.length > 2) {
      const results = await searchMeals(value);
      setSuggestions({ ...suggestions, [index]: results.slice(0, 5) });
    } else {
      setSuggestions({ ...suggestions, [index]: [] });
    }
  };

  /* ================= SELECT SUGGESTION ================= */
  const selectSuggestion = (index, mealName) => {
    const updated = [...meals];
    updated[index].name = mealName;
    setMeals(updated);
    setSuggestions({ ...suggestions, [index]: [] });
  };

  /* ================= FETCH INGREDIENTS ================= */
  const generateIngredients = async (index) => {
    const mealName = meals[index].name.trim();
    if (!mealName) return alert("Please enter a meal name");

    setLoadingIndex(index);

    try {
      const meal = await fetchMealDetails(mealName);
      if (!meal) throw new Error("Meal not found");

      const ingredients = [];
      for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
          ingredients.push(meal[`strIngredient${i}`]);
        }
      }

      const updated = [...meals];
      updated[index] = {
        ...updated[index],
        ingredients,
        image: meal.strMealThumb,
        category: meal.strCategory,
        area: meal.strArea,
      };

      setMeals(updated);
    } catch (err) {
      alert("Failed to fetch ingredients");
    } finally {
      setLoadingIndex(null);
    }
  };

  /* ================= SAVE ================= */
  const submit = async (e) => {
    e.preventDefault();

    const validMeals = meals.filter(
      (m) => m.name.trim() && m.ingredients.length > 0
    );

    if (!validMeals.length) {
      return alert("Please add at least one meal with ingredients");
    }

    try {
      setSaving(true);
      await handleSubmit(validMeals);
      setSuccess("Meal plan saved successfully ✅");
    } catch {
      alert("Failed to save meal plan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6 max-w-4xl mx-auto">
      {meals.map((meal, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white p-5 rounded-xl shadow border space-y-4"
        >
          {/* NAME + AI */}
          <div className="flex gap-3">
            <input
              value={meal.name}
              onChange={(e) => handleChange(idx, e.target.value)}
              placeholder="Dish name (Biryani, Sushi, Pasta)"
              className="flex-1 border rounded-lg p-3 text-sm"
            />
            <button
              type="button"
              onClick={() => generateIngredients(idx)}
              className="bg-purple-600 text-white px-4 rounded-lg"
            >
              {loadingIndex === idx ? (
                <FiLoader className="animate-spin" />
              ) : (
                "✨"
              )}
            </button>
          </div>

          {/* SUGGESTIONS */}
          <AnimatePresence>
            {suggestions[idx]?.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-14 left-0 right-0 bg-white border rounded-lg shadow p-2 z-20"
              >
                {suggestions[idx].map((m) => (
                  <div
                    key={m.idMeal}
                    onClick={() => selectSuggestion(idx, m.strMeal)}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded"
                  >
                    {m.strMeal}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* IMAGE */}
          {meal.image && (
            <img
              src={meal.image}
              alt={meal.name}
              className="w-full h-40 object-cover rounded-lg"
            />
          )}

          {/* META */}
          {meal.category && (
            <p className="text-xs text-gray-600">
              🍽 {meal.category} · 🌍 {meal.area}
            </p>
          )}

          {/* INGREDIENTS */}
          <div className="bg-gray-50 p-3 rounded-lg">
            {meal.ingredients.length ? (
              <ul className="list-disc pl-5 text-sm space-y-1">
                {meal.ingredients.map((i, x) => (
                  <li key={x}>{i}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">
                Click ✨ to fetch ingredients
              </p>
            )}
          </div>
        </motion.div>
      ))}

      {/* FOOTER */}
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() =>
            setMeals([
              ...meals,
              { name: "", ingredients: [], image: "", category: "", area: "" },
            ])
          }
          className="bg-blue-600 text-white px-5 py-3 rounded-lg flex items-center gap-2"
        >
          <FiPlus /> Add Meal
        </button>

        <button
          type="submit"
          disabled={saving}
          className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-60"
        >
          {saving ? (
            <FiLoader className="animate-spin" />
          ) : success ? (
            <FiCheckCircle />
          ) : (
            <FiSave />
          )}
          Save Plan
        </button>
      </div>

      {success && (
        <p className="text-green-600 text-sm font-medium">{success}</p>
      )}
    </form>
  );
}
