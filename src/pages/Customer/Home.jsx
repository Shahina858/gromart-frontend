import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Truck, Leaf, Heart, Star, Smartphone, 
  ArrowRight, ShoppingBag, Search, ChevronRight, ChevronLeft, ShieldCheck 
} from "lucide-react";

// --- LOCAL IMPORTS ---
// Ensure these paths match your project structure
import fruitsandvegetables from "../../assets/categories/fruits&vegitables.jpeg";
import diaryandbackery from "../../assets/categories/diary and backery.jpeg";
import snacks from "../../assets/categories/snacks.jpeg";
import beverages from "../../assets/categories/beverages.jpeg";
import household from "../../assets/categories/household.jpeg";
import personalCare from "../../assets/categories/personalcare.jpeg";
import tataSalt from "../../assets/categories/tata salt.jpg";
import amulButter from "../../assets/categories/amul butter.jpg";
import maggieNoodles from "../../assets/categories/maggiie.jpg";
import pepsi from "../../assets/categories/pepsi.jpg";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 overflow-x-hidden selection:bg-emerald-200">
      
      {/* 🧭 Navbar
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-emerald-100 px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-2xl font-extrabold text-emerald-700 tracking-tight flex items-center gap-1">
          GroMart<span className="w-2 h-2 rounded-full bg-lime-500 mt-2"></span>
        </h1>
        <div className="hidden md:flex bg-gray-100 rounded-full px-4 py-2 w-1/3 items-center text-gray-500 focus-within:ring-2 focus-within:ring-emerald-400 transition-all">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search for milk, apple, bread..." 
              className="bg-transparent border-none outline-none ml-2 w-full text-sm"
            />
        </div>
        <div className="flex gap-4 text-sm font-semibold text-gray-600 items-center">
            <span className="cursor-pointer hover:text-emerald-600 transition">Login</span>
            <span className="cursor-pointer bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-5 py-2 rounded-full hover:shadow-lg hover:shadow-emerald-200 transition-all flex items-center gap-2">
              <ShoppingBag size={16} /> Cart (0)
            </span>
        </div>
      </nav> */}

      {/* 🎬 Animated Hero Slideshow */}
      <section className="relative w-full h-[600px] md:h-[650px] overflow-hidden bg-[#F0FDF4]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="absolute inset-0 flex flex-col md:flex-row items-center justify-between px-6 md:px-20 max-w-7xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Text Content */}
            <div className="z-10 flex-1 mt-10 md:mt-0 text-center md:text-left order-2 md:order-1">
              <motion.span 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`inline-block px-4 py-1.5 mb-4 text-xs font-bold uppercase tracking-wider rounded-full ${heroSlides[currentSlide].badgeColor}`}
              >
                {heroSlides[currentSlide].badge}
              </motion.span>
              <motion.h1 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6 text-emerald-950"
              >
                {heroSlides[currentSlide].title} <br/>
                <span className="text-emerald-600">{heroSlides[currentSlide].highlight}</span>
              </motion.h1>
              <motion.p 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-gray-600 mb-8 max-w-lg mx-auto md:mx-0"
              >
                {heroSlides[currentSlide].desc}
              </motion.p>
              <motion.div 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
                >
                  Shop Now <ArrowRight size={20} />
                </Link>
              </motion.div>
            </div>

            {/* Image Content - Updated logic for real photos */}
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              className="flex-1 relative flex justify-center items-center h-full order-1 md:order-2"
            >
               {/* Abstract Blob Background behind image */}
               <div className={`absolute w-[350px] h-[350px] md:w-[500px] md:h-[500px] rounded-full blur-3xl opacity-40 -z-10 ${heroSlides[currentSlide].blobColor}`}></div>
               
               {/* Real Image with rounded corners */}
               <img 
                 src={heroSlides[currentSlide].image} 
                 alt="Hero" 
                 className="w-full max-w-md md:max-w-lg h-[250px] md:h-[400px] object-cover rounded-[2rem] shadow-2xl hover:scale-[1.02] transition-transform duration-500 border-4 border-white"
               />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === idx ? "bg-emerald-600 w-8" : "bg-emerald-300 hover:bg-emerald-400"
              }`}
            />
          ))}
        </div>
      </section>

      {/* 🏷️ Categories */}
      <section className="px-6 md:px-16 py-20 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
                <p className="text-gray-500 mt-2">Freshest picks for your daily needs.</p>
            </div>
            <div className="hidden md:flex gap-2">
                <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-100"><ChevronLeft size={20}/></button>
                <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-100"><ChevronRight size={20}/></button>
            </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
            >
              <div className={`h-40 w-full rounded-[2rem] flex items-center justify-center mb-4 transition-all duration-300 shadow-sm group-hover:shadow-xl border border-transparent group-hover:border-emerald-100 ${cat.bgColor} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-24 h-24 object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-110 relative z-10"
                />
              </div>
              <h3 className="text-center font-bold text-gray-700 group-hover:text-emerald-600 transition-colors">
                {cat.name}
              </h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🔥 Best Sellers */}
      <section className="bg-white py-20 px-6 md:px-16 relative overflow-hidden">
        {/* Decorative Bg Elements */}
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-gray-50 to-white"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col sm:flex-row items-end justify-between mb-10 gap-4">
              <div>
                  <h2 className="text-3xl font-bold text-gray-900">Weekly Top Picks 🌟</h2>
                  <p className="text-gray-500 mt-1">Grab the best deals before they are gone.</p>
              </div>
              <Link to="/products" className="text-emerald-600 font-bold flex items-center gap-1 hover:gap-2 transition-all hover:text-emerald-700">
                  View All <ArrowRight size={18} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {products.map((p, index) => (
                  <ProductCard key={p.name} product={p} index={index} />
              ))}
            </div>
        </div>
      </section>

      {/* 🚚 Features Grid (Dark Theme) */}
      <section className="py-24 px-6 md:px-16 bg-[#0f2923] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-900 rounded-full blur-[120px] opacity-30 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why India Loves GroMart</h2>
            <p className="text-emerald-200/60 mb-16 max-w-2xl mx-auto">We don't just deliver groceries; we deliver trust, hygiene, and happiness.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <FeatureCard
                    icon={<Truck className="text-lime-400" size={40} />}
                    title="15 Minute Delivery"
                    desc="Our hyper-local delivery partners ensure your order reaches you while it's still fresh."
                    delay={0}
                />
                <FeatureCard
                    icon={<Leaf className="text-emerald-400" size={40} />}
                    title="Organic & Fresh"
                    desc="Directly sourced from local farms. No cold storage, no preservatives."
                    delay={0.2}
                />
                <FeatureCard
                    icon={<ShieldCheck className="text-teal-400" size={40} />}
                    title="Quality Guarantee"
                    desc="Not happy with the quality? We offer a no-questions-asked instant refund."
                    delay={0.4}
                />
            </div>
        </div>
      </section>

      {/* 💬 Testimonials */}
      <section className="py-20 px-6 md:px-16 bg-lime-50/50">
        <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Community Love 💚</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((r, i) => (
                <motion.div
                key={r.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-[2rem] shadow-lg shadow-emerald-900/5 border border-white relative"
                >
                <div className="absolute -top-4 right-8 bg-lime-400 text-emerald-900 p-2 rounded-xl rotate-12">
                    <Star size={20} fill="currentColor" />
                </div>
                <p className="text-gray-600 italic mb-6 leading-relaxed font-medium">"{r.text}"</p>
                <div className="flex items-center gap-4 border-t border-gray-100 pt-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-bold text-white shadow-md">
                        {r.name[0]}
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm">{r.name}</h4>
                        <p className="text-xs text-emerald-600 font-semibold">Verified Buyer</p>
                    </div>
                </div>
                </motion.div>
            ))}
            </div>
        </div>
      </section>

      {/* 📱 App Download Banner */}
      <section className="px-6 md:px-16 pb-20 pt-10">
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-emerald-800 to-teal-700 rounded-[3rem] p-8 md:p-16 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            
            <div className="md:w-1/2 z-10">
                <span className="bg-white/20 backdrop-blur text-sm font-semibold px-4 py-1 rounded-full mb-4 inline-block">📲 Coming Soon</span>
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Groceries in your pocket.</h2>
                <p className="text-emerald-100 text-lg mb-8 leading-relaxed">
                  Experience lightning-fast checkout and real-time order tracking. Download the GroMart app today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button className="flex items-center gap-3 bg-white text-emerald-900 px-6 py-3 rounded-2xl hover:bg-lime-400 transition-all font-bold shadow-lg">
                        <Smartphone size={24} />
                        <div className="text-left">
                            <p className="text-[10px] uppercase tracking-wide opacity-80">Download on</p>
                            <p className="text-sm leading-none">App Store</p>
                        </div>
                    </button>
                    <button className="flex items-center gap-3 bg-emerald-950/50 border border-emerald-500/30 text-white px-6 py-3 rounded-2xl hover:bg-emerald-900 transition-all">
                        <div className="text-left">
                            <p className="text-[10px] uppercase tracking-wide opacity-80">Get it on</p>
                            <p className="text-sm leading-none">Google Play</p>
                        </div>
                    </button>
                </div>
            </div>
            
            <div className="md:w-1/3 mt-12 md:mt-0 z-10 relative">
                <motion.div 
                    animate={{ y: [0, -15, 0] }} 
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl"
                >
                    <div className="flex items-center gap-4 mb-6">
                         <div className="w-14 h-14 bg-lime-400 rounded-2xl flex items-center justify-center text-emerald-900 font-bold text-xl shadow-lg">GM</div>
                         <div>
                            <p className="font-bold text-lg">GroMart App</p>
                            <p className="text-xs text-lime-300">★★★★★ 4.9 Rating</p>
                         </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-2 bg-white/20 rounded-full w-3/4"></div>
                      <div className="h-2 bg-white/20 rounded-full w-full"></div>
                      <div className="h-2 bg-white/20 rounded-full w-5/6"></div>
                    </div>
                    <button className="mt-6 w-full bg-white text-emerald-900 font-bold py-2 rounded-xl text-sm">Install Now</button>
                </motion.div>
            </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// ------------------- Components -------------------

function ProductCard({ product, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300 group overflow-hidden relative"
    >
      {/* Discount Badge */}
      <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md z-10 shadow-sm">
        15% OFF
      </div>

      {/* Image Area */}
      <div className="w-full h-48 bg-gray-50 flex items-center justify-center overflow-hidden relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Hover Overlay Button */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-white/90 to-transparent">
            <button className="w-full bg-emerald-600 text-white font-semibold px-4 py-2 rounded-xl shadow-lg hover:bg-emerald-700 transition-colors text-sm flex items-center justify-center gap-2">
                Add to Cart <ShoppingBag size={14}/>
            </button>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 pt-2">
        <h3 className="text-gray-800 font-bold text-sm md:text-base truncate">{product.name}</h3>
        <p className="text-xs text-gray-400 mb-2">1 kg</p>
        <div className="flex items-center justify-between">
            <div className="flex flex-col">
                <span className="text-emerald-700 font-extrabold text-lg">₹{product.price}</span>
                <span className="text-gray-400 text-xs line-through">₹{parseInt(product.price) + 20}</span>
            </div>
            <button className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-emerald-100 hover:text-emerald-600 transition-colors">
                <Heart size={18} />
            </button>
        </div>
      </div>
    </motion.div>
  );
}

function FeatureCard({ icon, title, desc, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay, duration: 0.5 }}
      className="flex flex-col items-center p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
    >
      <div className="mb-6 p-4 bg-emerald-800/50 rounded-2xl shadow-inner">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-emerald-100/70 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 pt-16 pb-8 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        
        {/* Brand Section */}
        <div className="col-span-1 md:col-span-1">
          <h3 className="text-2xl font-extrabold text-white mb-4">GroMart<span className="text-emerald-500">.</span></h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your neighborhood grocery store, now online. Committed to freshness, speed, and safety.
          </p>
        </div>
        
        {/* Categories Links */}
        <div>
          <h4 className="font-bold text-white mb-4">Categories</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="hover:text-emerald-400 transition-colors cursor-pointer">Fruits & Veg</li>
            <li className="hover:text-emerald-400 transition-colors cursor-pointer">Dairy & Bakery</li>
            <li className="hover:text-emerald-400 transition-colors cursor-pointer">Snacks</li>
            <li className="hover:text-emerald-400 transition-colors cursor-pointer">Beverages</li>
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="font-bold text-white mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="hover:text-emerald-400 transition-colors cursor-pointer">About Us</li>
            <li className="hover:text-emerald-400 transition-colors cursor-pointer">Careers</li>
            <li className="hover:text-emerald-400 transition-colors cursor-pointer">Privacy Policy</li>
            <li className="hover:text-emerald-400 transition-colors cursor-pointer">Terms of Service</li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h4 className="font-bold text-white mb-4">Contact</h4>
          <p className="text-sm text-gray-400 mb-2">support@gromart.in</p>
          <p className="text-sm text-gray-400 mb-2">+91 98765 43210</p>
          <div className="flex gap-4 mt-4">
            <div className="w-9 h-9 bg-gray-800 rounded-full hover:bg-blue-600 hover:text-white transition-colors cursor-pointer flex items-center justify-center">
                <span className="text-xs font-bold">FB</span>
            </div>
            <div className="w-9 h-9 bg-gray-800 rounded-full hover:bg-pink-600 hover:text-white transition-colors cursor-pointer flex items-center justify-center">
                <span className="text-xs font-bold">IG</span>
            </div>
            <div className="w-9 h-9 bg-gray-800 rounded-full hover:bg-blue-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center">
                <span className="text-xs font-bold">TW</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} GroMart. All rights reserved. Designed with 💚.
      </div>
    </footer>
  );
}

// ------------------- Data -------------------

// 🎬 HERO SLIDES DATA (REAL IMAGES)
const heroSlides = [
  {
    title: "Freshness",
    highlight: "Delivered Daily",
    desc: "Order farm-fresh fruits and vegetables. Delivered to your doorstep in 30 minutes.",
    badge: "🚀 Free Delivery",
    badgeColor: "bg-emerald-100 text-emerald-700",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80", 
    blobColor: "bg-emerald-200"
  },
  {
    title: "Snack Attack?",
    highlight: "We Got You.",
    desc: "Craving chips or chocolate? Get 50% off on all snacks today only.",
    badge: "🔥 50% OFF",
    badgeColor: "bg-orange-100 text-orange-700",
    image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=800&q=80", 
    blobColor: "bg-orange-200"
  },
  {
    title: "Morning Essentials",
    highlight: "Start Right",
    desc: "Milk, bread, eggs, and butter. Everything you need for the perfect breakfast.",
    badge: "☀️ Morning Special",
    badgeColor: "bg-blue-100 text-blue-700",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80", 
    blobColor: "bg-blue-200"
  }
];

const categories = [
    { name: "Fruits & Veg", image: fruitsandvegetables || "https://cdn-icons-png.flaticon.com/512/1625/1625048.png", bgColor: "bg-green-50" },
    { name: "Dairy & Bakery", image: diaryandbackery || "https://cdn-icons-png.flaticon.com/512/3050/3050158.png", bgColor: "bg-yellow-50" },
    { name: "Snacks", image: snacks || "https://cdn-icons-png.flaticon.com/512/2553/2553691.png", bgColor: "bg-red-50" },
    { name: "Beverages", image: beverages || "https://cdn-icons-png.flaticon.com/512/2405/2405597.png", bgColor: "bg-blue-50" },
    { name: "Household", image: household || "https://cdn-icons-png.flaticon.com/512/3082/3082060.png", bgColor: "bg-purple-50" },
    { name: "Personal Care", image: personalCare || "https://cdn-icons-png.flaticon.com/512/2553/2553644.png", bgColor: "bg-pink-50" },
];

const products = [
  {
    name: "Fresh Red Apples (1kg)",
    price: "120",
    image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Tata Salt 1kg",
    price: "28",
    image:  tataSalt,
  },
  {
    name: "Amul Butter 500g",
    price: "270",
    image: amulButter,
  },
  {
    name: "Maggi Noodles (8 Pack)",
    price: "110",
    image: maggieNoodles,
  },
  {
    name: "Pepsi Soft Drink 1.25L",
    price: "55",
    image: pepsi,
  },
];

const reviews = [
  {
    name: "Aisha Rahman",
    text: "The delivery is insanely fast. I ordered milk and bread, and it was at my door before I finished my coffee!",
  },
  {
    name: "Rahul Menon",
    text: "GroMart has completely replaced my weekend supermarket trips. The vegetable quality is better than local vendors.",
  },
  {
    name: "Priya Sharma",
    text: "I love the app design! It's so easy to find what I need, and the discounts on monthly staples are a lifesaver.",
  },
];