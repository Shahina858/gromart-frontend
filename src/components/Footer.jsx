import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* 🏪 Brand Info */}
        <div>
          <h2 className="text-white text-xl font-semibold mb-3">GroMart AI</h2>
          <p className="text-sm leading-relaxed">
            Your smart shopping companion powered by AI — helping you plan meals, manage your pantry, and shop effortlessly.
          </p>
        </div>

        {/* 🔗 Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white transition">Home</a></li>
            <li><a href="/shop" className="hover:text-white transition">Shop</a></li>
            <li><a href="/pantry" className="hover:text-white transition">Pantry</a></li>
            <li><a href="/meal-planner" className="hover:text-white transition">Meal Planner</a></li>
            <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
          </ul>
        </div>

        {/* 📞 Contact */}
        <div>
          <h3 className="text-white font-semibold mb-3">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li>Email: <a href="mailto:support@gromart.ai" className="hover:text-white transition">support@gromart.ai</a></li>
            <li>Phone: <a href="tel:+919876543210" className="hover:text-white transition">+91 98765 43210</a></li>
            <li>Address: Palakkad, Kerala, India</li>
          </ul>
        </div>

        {/* 🌐 Social Media */}
        <div>
          <h3 className="text-white font-semibold mb-3">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white transition"><FaFacebookF /></a>
            <a href="#" className="hover:text-white transition"><FaTwitter /></a>
            <a href="#" className="hover:text-white transition"><FaInstagram /></a>
            <a href="#" className="hover:text-white transition"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      {/* ⚡ Bottom Bar */}
      <div className="border-t border-gray-700 mt-6 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} <span className="text-white font-semibold">GroMart AI</span> — Built with ❤️ by Team GroMart
      </div>
    </footer>
  );
}
