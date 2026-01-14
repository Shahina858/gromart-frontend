import React from "react";

export default function DeliveryFooter() {
  return (
    <footer className="bg-gray-800 text-gray-300 text-center py-4 mt-10">
      <p className="text-sm">
        © {new Date().getFullYear()} <span className="text-green-400 font-semibold">Smart AI Grocery App</span>. 
        All rights reserved.
      </p>
      <p className="text-xs mt-1">
        Designed for seamless shopping & delivery experience.
      </p>
    </footer>
  );
}
