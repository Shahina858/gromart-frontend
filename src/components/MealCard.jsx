import React from "react";

const MealCard = ({ meal }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-md p-4 border hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      
      {/* Image Section */}
      {meal.image && (
        <div className="w-full h-44 overflow-hidden rounded-xl bg-gray-100">
          <img
            src={meal.image}
            alt={meal.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      )}

      {/* Title */}
      <h3 className="mt-3 text-xl font-bold text-gray-900">{meal.name}</h3>

      {/* Category + Cuisine Tags */}
      <div className="flex gap-2 mt-1">
        {meal.category && (
          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-semibold">
            {meal.category}
          </span>
        )}
        {meal.area && (
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
            {meal.area}
          </span>
        )}
      </div>

      {/* Calories */}
      <p className="mt-2 text-sm font-medium text-gray-700">
        🔥 <span className="font-bold">{meal.calories || "N/A"}</span> calories
      </p>

      {/* Ingredients */}
      {meal.ingredients?.length > 0 && (
        <div className="mt-3">
          <h4 className="text-sm font-semibold text-gray-800 mb-1">Ingredients:</h4>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-0.5">
            {meal.ingredients.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Notes */}
      {meal.notes && (
        <p className="italic text-gray-500 text-sm mt-3 line-clamp-2">
          {meal.notes}
        </p>
      )}

      {/* Buttons */}
      <div className="flex gap-3 mt-4">
        <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg shadow-sm transition font-medium">
          ✨ AI Recipe
        </button>
        <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg shadow-sm transition font-medium">
          🔥 Calories
        </button>
      </div>
    </div>
  );
};

export default MealCard;
