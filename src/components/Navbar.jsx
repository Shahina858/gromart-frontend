import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AdminNavbar from "./Navbars/AdminNavbar";
import UserNavbar from "./Navbars/UserNavbar";
// import VendorNavbar from "./navbars/VendorNavbar";
import DeliveryNavbar from "./Navbars/DeliveryNavbar";
import StoreManagerNavbar from "./Navbars/StoreManagerNavbar";

export default function Navbar() {
  const { user } = useContext(AuthContext);

  if (!user) return null; // hide navbar when not logged in

  switch (user.role) {
    case "admin":
      return <AdminNavbar />;
    case "vendor":
      return <StoreManagerNavbar />;
    case "delivery":
      return <DeliveryNavbar />;
    default:
      return <UserNavbar />;
  }
}
