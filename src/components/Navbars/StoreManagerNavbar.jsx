import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  FaStore,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";

export default function StoreManagerNavbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();               // ✅ central logout
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-gray-200 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* 🏪 Logo */}
        <Link to="/manager/dashboard" className="flex items-center space-x-2">
          <FaStore className="text-green-400 text-2xl" />
          <span className="text-xl font-semibold text-white">
            StoreManager
          </span>
        </Link>

        {/* 🔗 Desktop Nav Links */}
        <div className="hidden md:flex space-x-6 text-sm font-medium">
          <Link to="/manager/dashboard" className="hover:text-green-400">Dashboard</Link>
          <Link to="/manager/inventory" className="hover:text-green-400">Inventory</Link>
          <Link to="/manager/storeinventory" className="hover:text-green-400">Store Management</Link>
          <Link to="/manager/orders" className="hover:text-green-400">Orders</Link>
          <Link to="/manager/customers" className="hover:text-green-400">Customers</Link>
          <Link to="/manager/chatpage" className="hover:text-green-400">Chat</Link>
          <Link to="/manager/reports" className="hover:text-green-400">Reports</Link>
        </div>

        {/* 👤 Profile + Logout */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full">
            <FaUserCircle className="text-xl text-gray-300" />
            <span className="text-sm font-medium text-white">
              {user?.name || "User"}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1.5 rounded transition"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
