import React from "react";
import { Outlet } from "react-router-dom";
// import AdminNavbar from "../components/AdminNavbar";
import StoreManagerNavbar from "../components/Navbars/StoreManagerNavbar";

export default function StoreLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* ✅ Admin Navbar on top of every admin page */}
      <StoreManagerNavbar/>

      {/* ✅ Admin Page Content */}
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
}
