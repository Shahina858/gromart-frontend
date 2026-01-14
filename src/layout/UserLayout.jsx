import React from "react";
import { Outlet } from "react-router-dom";
// import Navbar from "../components/Navbar";

import UserNavbar from "../components/Navbars/UserNavbar";

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* ✅ Admin Navbar on top of every admin page */}
      <UserNavbar/>

      {/* ✅ Admin Page Content */}
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
}
