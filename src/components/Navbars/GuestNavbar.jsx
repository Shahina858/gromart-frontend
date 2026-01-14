import { Link, useNavigate } from "react-router-dom";
import { Home, LogIn, ShoppingBag } from "lucide-react";

export default function GuestNavbar() {
  const navigate = useNavigate();

  return (
    <nav className="bg-gradient-to-r from-[#3b3a36] to-[#6e675f] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          🛒 GroMart AI
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-[#e6c27a]"
          >
            <Home size={16} /> Home
          </Link>

          <Link
            to="/products"
            className="flex items-center gap-1 hover:text-[#e6c27a]"
          >
            <ShoppingBag size={16} /> Products
          </Link>

          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-1 bg-[#e6c27a] text-black px-3 py-1 rounded-md hover:bg-[#d4b373]"
          >
            <LogIn size={16} /> Login
          </button>
        </div>
      </div>
    </nav>
  );
}
