import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  /* CLOSE PROFILE ON OUTSIDE CLICK */
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* NAV LINKS */
  const navItems = [
    { to: "/", label: "Home" },
    { to: "/customer/products", label: "Products" },
    { to: "/customer/cart", label: "Cart" },
    { to: "/customer/wishlist", label: "Wishlist" },
    { to: "/customer/pantry", label: "Pantry" },
    { to: "/customer/meal-planner", label: "Meal Planner" },
    { to: "/customer/checkout", label: "Checkout" },
    { to: "/customer/my-orders", label: "Orders" },
    { to: "/customer/chat", label: "Chat" },
  ];

  const linkClass = ({ isActive }) =>
    `text-[14.5px] font-medium px-4 py-2 rounded-full transition-all duration-200
     ${
       isActive
         ? "bg-green-100 text-green-700"
         : "text-gray-700 hover:bg-green-50 hover:text-green-700"
     }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="text-xl font-extrabold tracking-tight">
          <span className="text-green-600">Gro</span>
          <span className="text-gray-900">Mart</span>
          <span className="text-green-500"> AI</span>
        </Link>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-8">

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* PROFILE */}
          {user ? (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition"
              >
                <span className="w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="hidden sm:block text-sm font-medium text-gray-800">
                  {user.name}
                </span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b bg-gray-50">
                    <p className="font-semibold text-gray-800">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      navigate("/customer/profile");
                      setProfileOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-green-50 transition"
                  >
                    Profile
                  </button>

                  <button
                    onClick={() => {
                      navigate("/customer/change-password");
                      setProfileOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-green-50 transition"
                  >
                    Change Password
                  </button>

                  <div className="border-t" />

                  <button
                    onClick={() => {
                      logout();
                      setProfileOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
            >
              Login
            </button>
          )}

          {/* MOBILE MENU */}
          <button
            className="lg:hidden text-gray-700 text-sm"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            Menu
          </button>
        </div>
      </div>

      {/* MOBILE NAV */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t shadow-sm">
          <div className="px-6 py-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-700 transition"
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
