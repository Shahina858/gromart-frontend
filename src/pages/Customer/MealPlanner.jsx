import React, { useEffect, useState } from "react";
import MealPlannerForm from "./MealPlannerForm";

export default function MealPlanner() {
  const [mealPlans, setMealPlans] = useState([]);

  /* ================= LOAD ALL PLANS ================= */
  useEffect(() => {
    const stored = localStorage.getItem("savedMealPlans");
    if (stored) {
      setMealPlans(JSON.parse(stored));
    }
  }, []);

  /* ================= SAVE NEW PLAN ================= */
  const handleSubmit = async (meals) => {
    const newPlan = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      meals,
    };

    const updatedPlans = [newPlan, ...mealPlans];

    setMealPlans(updatedPlans);
    localStorage.setItem("savedMealPlans", JSON.stringify(updatedPlans));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        🍱 AI Meal Planner
      </h1>

      {/* FORM */}
      <MealPlannerForm handleSubmit={handleSubmit} />

      {/* SAVED PLANS LIST */}
      <div className="max-w-5xl mx-auto mt-14">
        <h2 className="text-2xl font-semibold mb-6">
          📚 Saved Meal Plans
        </h2>

        {mealPlans.length === 0 && (
          <p className="text-gray-500 text-center">
            No meal plans saved yet
          </p>
        )}

        <div className="space-y-6">
          {mealPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-2xl shadow border p-6"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">
                  Meal Plan –{" "}
                  {new Date(plan.createdAt).toLocaleDateString()}
                </h3>
                <span className="text-sm text-gray-500">
                  {plan.meals.length} meals
                </span>
              </div>

              {/* MEALS */}
              <div className="grid gap-4">
                {plan.meals.map((meal, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 border rounded-xl p-4"
                  >
                    {/* IMAGE */}
                    {meal.image && (
                      <img
                        src={meal.image}
                        alt={meal.name}
                        className="w-28 h-20 object-cover rounded-lg"
                      />
                    )}

                    {/* INFO */}
                    <div className="flex-1">
                      <h4 className="font-semibold">{meal.name}</h4>

                      {meal.category && (
                        <p className="text-xs text-gray-600">
                          🍽 {meal.category} · 🌍 {meal.area}
                        </p>
                      )}

                      <ul className="list-disc pl-5 text-sm mt-1">
                        {meal.ingredients.slice(0, 5).map((ing, i) => (
                          <li key={i}>{ing}</li>
                        ))}
                        {meal.ingredients.length > 5 && (
                          <li className="italic text-gray-400">
                            + more ingredients
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
