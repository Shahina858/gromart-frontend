import React, { createContext, useState, useContext } from "react";

export const MealPlannerContext = createContext();

export const useMealPlanner = () => useContext(MealPlannerContext);

export const MealPlannerProvider = ({ children }) => {
  const [meals, setMeals] = useState([]);

  const addMeal = (meal) => setMeals((prev) => [...prev, meal]);
  const removeMeal = (id) => setMeals((prev) => prev.filter((m) => m.id !== id));

  return (
    <MealPlannerContext.Provider value={{ meals, addMeal, removeMeal }}>
      {children}
    </MealPlannerContext.Provider>
  );
};
