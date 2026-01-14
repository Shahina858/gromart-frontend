import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Home, Package, MessageSquare } from "lucide-react";

export default function DeliveryNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const linkClasses = (path) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${
      location.pathname === path
        ? "bg-green-600 text-white"
        : "text-gray-700 hover:bg-green-100"
    }`;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link to="/delivery/dashboard" className="text-xl font-bold text-green-700">
          Gromart Delivery 🚚
        </Link>

        {/* Nav Links */}
        <div className="flex space-x-4">
          <Link to="/delivery/dashboard" className={linkClasses("/delivery/dashboard")}>
            <Home size={18} /> Dashboard
          </Link>
          <Link to="/delivery/orders" className={linkClasses("/delivery/orders")}>
            <Package size={18} /> Orders
          </Link>
          <Link to="/delivery/chat" className={linkClasses("/delivery/chat")}>
            <MessageSquare size={18} /> Chat
          </Link>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </nav>
  );
}
