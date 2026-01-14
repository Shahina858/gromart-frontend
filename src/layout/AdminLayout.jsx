import React from "react";
import AdminNavbar from "../components/Navbars/AdminNavbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div>
      <AdminNavbar />
      <main className="min-h-screen p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
