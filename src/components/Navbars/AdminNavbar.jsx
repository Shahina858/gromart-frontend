import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Store,
  MessageCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function AdminNavbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  return (
    <>
      {/* ✅ Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900">
        <div className="flex items-center justify-between px-3 py-3">
          <Link
            to="/admin/dashboard"
            className="text-lg font-extrabold text-white truncate"
          >
             Admin<span className="text-amber-400"> Panel</span>
          </Link>

          {/* Desktop */}
          <nav className="hidden md:flex gap-6 text-gray-200">
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/users">Users</Link>
            <Link to="/admin/stores">Stores</Link>
            <Link to="/admin/chat">Chat</Link>
            <button
              onClick={handleLogout}
              className="bg-amber-500 px-3 py-1 rounded text-white"
            >
              Logout
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden p-2 text-white bg-white/10 rounded"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* ✅ Mobile Overlay */}
      {open && (
        <div className="fixed inset-0 z-[9999]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />

          {/* ✅ FULL WIDTH DRAWER */}
          <aside className="absolute top-0 left-0 h-full w-full max-w-none bg-gray-900 text-gray-100 p-6 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="text-xl font-bold">
                GroMart <span className="text-amber-400">AI</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded bg-white/10"
              >
                <X size={22} />
              </button>
            </div>

            {/* Links */}
            <nav className="flex flex-col space-y-6 text-lg">
              <Link onClick={() => setOpen(false)} to="/admin/dashboard">
                Dashboard
              </Link>
              <Link onClick={() => setOpen(false)} to="/admin/users">
                Users
              </Link>
              <Link onClick={() => setOpen(false)} to="/admin/stores">
                Stores
              </Link>
              <Link onClick={() => setOpen(false)} to="/admin/chat">
                Chat
              </Link>

              <button
                onClick={handleLogout}
                className="mt-8 w-fit bg-amber-500 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </nav>
          </aside>
        </div>
      )}

      {/* ✅ Spacer for fixed navbar */}
      <div className="h-[56px]" />
    </>
  );
}
