import React from "react";
import { Outlet } from "react-router-dom";
import DeliveryNavbar from "../components/Navbars/DeliveryNavbar";
import DeliveryFooter from "../components/DeliveryFooter";

export default function DeliveryLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-100 to-beige-50 text-gray-900">
      {/* 🌟 Navbar — visible on all user pages */}
      <DeliveryNavbar />

      {/* 🌿 Main content area */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* 🌟 Footer — visible on all user pages */}
      <DeliveryFooter/>
    </div>
  );
}
