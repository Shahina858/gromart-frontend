import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowUpDown,
  Heart,
  ShoppingCart,
  ChevronRight,
  Star,
  Eye,
  Package,
  X,
} from "lucide-react";
import API from "../../services/api";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

/* ---------------- STATIC CATEGORY IMAGES ---------------- */

import allImg from "../../assets/categories/all.jfif";
import fruitsVegImg from "../../assets/categories/fruits&vegitables.jpeg";
import diaryImg from "../../assets/categories/diary and backery.jpeg";
import beveragesImg from "../../assets/categories/beverages.jpeg";
import snacksImg from "../../assets/categories/snacks.jpeg";
import householdImg from "../../assets/categories/household.jpeg";
import stationaryImg from "../../assets/categories/stationary.jfif";
import meatImg from "../../assets/categories/meaaat.jfif";
import fishImg from "../../assets/categories/fishhhh.jfif";

/* ---------------- CATEGORY CONFIG ---------------- */

const CATEGORY_IMAGE_MAP = {
  all: allImg,
  "fruits & vegitables": fruitsVegImg,
  diary: diaryImg,
  beverages: beveragesImg,
  snacks: snacksImg,
  household: householdImg,
  stationary: stationaryImg,
  meat: meatImg,
  fish: fishImg,
};

const CATEGORY_LABELS = {
  all: "All",
  household: "Household",
  stationary: "Stationary",
  diary: "Diary",
  beverages: "Beverages",
  snacks: "Snacks",
  "fruits & vegitables": "Fruits & Vegetables",
  meat: "Meat",
  fish: "Fish",
};

const ALLOWED_CATEGORIES = Object.keys(CATEGORY_IMAGE_MAP).filter(
  (c) => c !== "all"
);

/* ---------------- HELPERS ---------------- */

const normalizeCategory = (cat) => {
  if (!cat || typeof cat !== "string") return null;

  let value = cat.toLowerCase().trim();

  if (value === "" || value === "undefined") return null;
  if (value.includes("meat")) return "meat";
  if (value.includes("fish")) return "fish";

  return value;
};

const FALLBACK_IMAGE = "/placeholder.png"; // put this in /public

/* ---------------- MAIN COMPONENT ---------------- */

export default function ProductListing() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState(["all"]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  /* ---------------- FETCH PRODUCTS ---------------- */

  useEffect(() => {
    API.get("/products")
      .then((res) => {
        const data = res.data?.products || res.data || [];
        setProducts(data);
        setFiltered(data);

        const uniqueCategories = [
          "all",
          ...new Set(
            data
              .map((p) => normalizeCategory(p.category))
              .filter((cat) => ALLOWED_CATEGORIES.includes(cat))
          ),
        ];

        setCategories(uniqueCategories);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ---------------- FILTER LOGIC ---------------- */

  useEffect(() => {
    let list = [...products];

    if (selectedCategory !== "all") {
      list = list.filter(
        (p) => normalizeCategory(p.category) === selectedCategory
      );
    }

    if (search) {
      list = list.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sort === "low") list.sort((a, b) => a.price - b.price);
    if (sort === "high") list.sort((a, b) => b.price - a.price);

    setFiltered(list);
  }, [selectedCategory, search, sort, products]);

  /* ---------------- IMAGE HELPER (SAFE) ---------------- */

  const getImage = (img) => {
    if (!img || typeof img !== "string" || img.trim() === "") return null;
    if (img.startsWith("http")) return img;
    return `http://localhost:5000/${img}`;
  };

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen">

      {/* HEADER */}
      <header className="bg-white border-b px-0 py-10">

        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          Home <ChevronRight size={12} />
          <span className="text-emerald-600">Shop</span>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900">
          Fresh Grocery Shop
        </h1>
        <p className="mt-2 text-gray-500">
          {filtered.length} products available
        </p>
      </header>

      {/* CATEGORIES */}
      {/* <section className="px-6 md:px-16 py-10 flex gap-5 overflow-x-auto"> */}
        <section className="px-0 py-0 flex gap-5 overflow-x-auto">

        {categories.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`min-w-[140px] rounded-2xl p-4 text-center transition
                ${
                  active
                    ? "bg-emerald-50 ring-1 ring-emerald-300"
                    : "bg-white hover:bg-gray-50"
                }`}
            >
              {CATEGORY_IMAGE_MAP[cat] && (
                <img
                  src={CATEGORY_IMAGE_MAP[cat]}
                  alt={cat}
                  className="w-14 h-14 mx-auto rounded-full object-cover bg-gray-100 mb-2"
                />
              )}
              <p className="text-sm font-semibold text-gray-700">
                {CATEGORY_LABELS[cat]}
              </p>
            </button>
          );
        })}
      </section>

      {/* SEARCH & SORT */}
      {/* <div className="sticky top-0 z-30 bg-white/80 backdrop-blur border-y px-6 md:px-16 py-4 flex flex-col md:flex-row gap-4"> */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur border-y px-4 py-4">

        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-12 pr-10 py-3 rounded-xl bg-gray-100 focus:bg-white outline-none"
          />
          {search && (
            <X
              size={16}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setSearch("")}
            />
          )}
        </div>

        <select
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-3 rounded-xl bg-gray-100 text-sm font-medium"
        >
          <option value="default">Featured</option>
          <option value="low">Price: Low → High</option>
          <option value="high">Price: High → Low</option>
        </select>
      </div>

      {/* PRODUCTS */}
      {/* <main className="px-6 md:px-16 py-14"> */}
        {/* <main className="px-4 py-14"> */}
          <main className="px-0 py-14">


        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="h-[340px] bg-gray-200 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filtered.map((p) => (
              <ProductCard
                key={p._id}
                p={p}
                getImage={getImage}
                navigate={navigate}
                addToCart={addToCart}
                addToWishlist={addToWishlist}
                notify={notify}
              />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-400 font-medium">No products found</p>
          </div>
        )}
      </main>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- PRODUCT CARD ---------------- */

function ProductCard({ p, getImage, navigate, addToCart, addToWishlist, notify }) {
 const imgSrc = getImage(p.image);


  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="group bg-white rounded-2xl border border-gray-100 hover:border-emerald-200
                 shadow-sm hover:shadow-lg transition flex flex-col"
    >
      <div className="relative h-44 bg-gray-50 rounded-xl m-4 overflow-hidden flex items-center justify-center">
        {imgSrc ? (
  <img src={imgSrc} alt={p.title} />
) : (
  <div className="h-full flex items-center justify-center text-gray-400">
    No Image
  </div>
)}

        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={() => {
              addToWishlist(p);
              notify("Added to Wishlist ❤️");
            }}
            className="w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center
                       hover:bg-pink-500 hover:text-white transition"
          >
            <Heart size={16} />
          </button>

          <button
            onClick={() => navigate(`/customer/products/${p._id}`)}
            className="w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center
                       hover:bg-emerald-500 hover:text-white transition"
          >
            <Eye size={16} />
          </button>
        </div>
      </div>

      <div className="px-4 pb-4 flex flex-col flex-1">
        <p className="text-xs text-gray-400 capitalize mb-1">
          {CATEGORY_LABELS[normalizeCategory(p.category)] || "General"}
        </p>

        <h3
          onClick={() => navigate(`/customer/products/${p._id}`)}
          className="font-semibold text-gray-800 text-sm line-clamp-2 mb-2 cursor-pointer hover:text-emerald-600"
        >
          {p.title}
        </h3>

        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />
          ))}
          <span className="text-[11px] text-gray-400 ml-1">(4.0)</span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-emerald-600 font-bold text-lg">
            ₹{p.price}
          </span>
          <button
            onClick={() => {
              addToCart(p);
              notify("Added to Cart 🛒");
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white
                       w-10 h-10 rounded-lg flex items-center justify-center"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
