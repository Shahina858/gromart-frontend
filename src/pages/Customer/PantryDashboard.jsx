import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

/* =========================
   CATEGORY → EXPIRY DAYS
========================= */

const CATEGORY_EXPIRY_DAYS = {
  dairy: 2,                    // milk, curd, paneer
  meat: 3,                     // chicken, mutton
  fish: 3,                     // fish, prawns
  "fruits & vegitables": 5,    // fruits & vegetables
  snacks: 180,                 // ~6 months
  beverages: 180,              // ~6 months
  stationary: 365,             // ~1 year
  household: 365,              // ~1 year
};

/* =========================
   CATEGORY NORMALIZER
========================= */

const normalizeCategory = (cat) => {
  if (!cat || typeof cat !== "string") return null;

  const value = cat.toLowerCase().trim();

  if (value.includes("dairy") || value.includes("milk")) return "dairy";
  if (value.includes("meat") || value.includes("chicken")) return "meat";
  if (value.includes("fish") || value.includes("prawn")) return "fish";
  if (value.includes("snack")) return "snacks";
  if (value.includes("beverage") || value.includes("drink")) return "beverages";
  if (value.includes("station")) return "stationary";
  if (value.includes("house")) return "household";
  if (value.includes("fruit") || value.includes("veg"))
    return "fruits & vegitables";

  return null;
};

/* =========================
   GET EXPIRY DAYS BY CATEGORY
========================= */

const getExpiryDaysByCategory = (category) => {
  const normalized = normalizeCategory(category);
  return CATEGORY_EXPIRY_DAYS[normalized] ?? 7; // default = 7 days
};

/* =========================
   EXPIRY CALCULATION
========================= */

const getExpiryInfo = (orderDate, expiryDays) => {
  const order = new Date(orderDate);
  const expiry = new Date(order);
  expiry.setDate(expiry.getDate() + expiryDays);

  const today = new Date();
  const daysLeft = Math.ceil(
    (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    expiryDate: expiry,
    daysLeft,
    status:
      daysLeft < 0
        ? "expired"
        : daysLeft <= 2
        ? "expiring"
        : "fresh",
  };
};

/* =========================
   MAIN COMPONENT
========================= */

export default function PantryDashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    API.get("/pantry/from-orders")
      .then((res) => setItems(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Pantry fetch failed", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">
          🧺 Smart Pantry (From Delivered Orders)
        </h2>

        {loading ? (
          <div className="text-center text-gray-600">Loading pantry...</div>
        ) : items.length === 0 ? (
          <div className="text-center text-gray-500">
            No delivered products yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item) => {
              const expiry = getExpiryInfo(
                item.orderDate,
                getExpiryDaysByCategory(item.category)
              );

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 flex flex-col"
                >
                  {/* PRODUCT IMAGE */}
                  <img
                    src={
                      item.image
                        ? item.image.startsWith("http")
                          ? item.image
                          : `http://localhost:5000/${item.image}`
                        : "/placeholder.png"
                    }
                    alt={item.name}
                    onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                    className="h-32 w-full object-contain mb-4"
                  />

                  {/* PRODUCT INFO */}
                  <h3 className="text-lg font-semibold">{item.name}</h3>

                  <p className="text-sm text-gray-500">
                    Category:{" "}
                    <span className="capitalize font-medium">
                      {normalizeCategory(item.category) || "general"}
                    </span>
                  </p>

                  <p className="text-sm text-gray-500">
                    Ordered on:{" "}
                    {new Date(item.orderDate).toLocaleDateString()}
                  </p>

                  <p className="text-sm">
                    Expires on:{" "}
                    <span className="font-medium">
                      {expiry.expiryDate.toLocaleDateString()}
                    </span>
                  </p>

                  {/* STATUS BADGE */}
                  <span
                    className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-semibold self-start ${
                      expiry.status === "expired"
                        ? "bg-red-100 text-red-700"
                        : expiry.status === "expiring"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {expiry.status === "expired"
                      ? "Expired"
                      : expiry.status === "expiring"
                      ? `Expiring in ${expiry.daysLeft} day(s)`
                      : `Fresh (${expiry.daysLeft} days left)`}
                  </span>

                  {/* BUY AGAIN */}
                  <button
                    className="mt-auto w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg mt-4"
                    onClick={() =>
                      navigate(`/products/${item.productId}`)
                    }
                  >
                    Buy Again
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
