// src/App.jsx
import React, { useContext } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

/* =======================
   LAYOUTS
======================= */
import UserLayout from "./layout/UserLayout";
import AdminLayout from "./layout/AdminLayout";
import DeliveryLayout from "./layout/DeliveryLayout";
import StoreLayout from "./layout/StoreLayout";
import GuestLayout from "./layout/GuestLayout";

/* =======================
   ROUTE GUARDS
======================= */
import GuestOnly from "./routes/GuestOnly";

/* =======================
   CONTEXT
======================= */
import { AuthContext } from "./context/AuthContext";

/* =======================
   COMMON
======================= */
import Footer from "./components/Footer";

/* =======================
   AUTH PAGES
======================= */
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

/* =======================
   CUSTOMER PAGES
======================= */
import Home from "./pages/Customer/Home";
import ProductListing from "./pages/Customer/ProductListing";
import ProductDetail from "./pages/Customer/ProductDetail";
import Cart from "./pages/Customer/Cart";
import Checkout from "./pages/Customer/Checkout";
import Wishlist from "./pages/Customer/Wishlist";
import PantryDashboard from "./pages/Customer/PantryDashboard";
import MealPlanner from "./pages/Customer/MealPlanner";
import ChatPage from "./pages/Customer/ChatPage";
import BankDetails from "./pages/Customer/BankDetails";
import OrderSuccess from "./pages/Customer/OrderSuccess";
import MyOrders from "./pages/Customer/MyOrders";
import Profile from "./pages/Customer/Profile";
import ChangePassword from "./pages/Customer/ChangePassword";

/* =======================
   STORE MANAGER PAGES
======================= */
import StoreDashboard from "./pages/StoreManager/StoreDashboard";
import Inventory from "./pages/StoreManager/Inventory";
import Orders from "./pages/StoreManager/Orders";
import StoreInventoryPage from "./pages/StoreManager/StoreInventoryPage";
import StoreManagerReport from "./pages/StoreManager/StoreManagerReport";
import StoreManagerCustomers from "./pages/StoreManager/StoreManagerCustomer";
import StoreManagerChatPage from "./pages/StoreManager/StoreManagerChatPage";

/* =======================
   DELIVERY AGENT PAGES
======================= */
import DeliveryDashboard from "./pages/DeliveryAgent/DeliveryDashboard";
import AssignedOrders from "./pages/DeliveryAgent/AssignedOrders";
import DeliveryOrders from "./pages/DeliveryAgent/DeliveryOrders";
import DeliveryAgentChatPage from "./pages/DeliveryAgent/DeliveryAgentChatPage";

/* =======================
   ADMIN PAGES
======================= */
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ManageUsers from "./pages/Admin/ManageUsers";
import ManageStores from "./pages/Admin/ManageStores";
import ManageProducts from "./pages/Admin/ManageProducts";
import AdminChatPage from "./pages/Admin/AdminChatPage";

/* =======================
   APP
======================= */
const App = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Show footer only on home page for customers
  const showFooter =
    user?.role === "customer" && location.pathname === "/";

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Routes>
          {/* =======================
              AUTH / PUBLIC
          ======================= */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* =======================
              GUEST ROUTES
          ======================= */}
          <Route element={<GuestOnly />}>
            <Route element={<GuestLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductListing />} />
            </Route>
          </Route>

          {/* =======================
              CUSTOMER ROUTES
          ======================= */}
          <Route element={<UserLayout />}>
            <Route path="/customer/home" element={<Home />} />
            <Route path="/customer/products" element={<ProductListing />} />

            {/* 🔥 IMPORTANT: Product detail route */}
            <Route path="/customer/products/:id" element={<ProductDetail />} />

            <Route path="/customer/cart" element={<Cart />} />
            <Route path="/customer/checkout" element={<Checkout />} />
            <Route path="/customer/wishlist" element={<Wishlist />} />
            <Route path="/customer/pantry" element={<PantryDashboard />} />
            <Route path="/customer/meal-planner" element={<MealPlanner />} />
            <Route path="/customer/chat" element={<ChatPage />} />
            <Route path="/customer/bank-details" element={<BankDetails />} />
            <Route path="/customer/order-success" element={<OrderSuccess />} />
            <Route path="/customer/my-orders" element={<MyOrders />} />
            <Route path="/customer/profile" element={<Profile />} />
            <Route
              path="/customer/change-password"
              element={<ChangePassword />}
            />
          </Route>

          {/* =======================
              STORE MANAGER ROUTES
          ======================= */}
          <Route element={<StoreLayout />}>
            <Route path="/manager/dashboard" element={<StoreDashboard />} />
            <Route path="/manager/inventory" element={<Inventory />} />
            <Route
              path="/manager/storeinventory"
              element={<StoreInventoryPage />}
            />
            <Route path="/manager/orders" element={<Orders />} />
            <Route
              path="/manager/chatpage"
              element={<StoreManagerChatPage />}
            />
            <Route path="/manager/reports" element={<StoreManagerReport />} />
            <Route
              path="/manager/customers"
              element={<StoreManagerCustomers />}
            />
          </Route>

          {/* =======================
              DELIVERY AGENT ROUTES
          ======================= */}
          <Route element={<DeliveryLayout />}>
            <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
            <Route path="/delivery/orders" element={<AssignedOrders />} />
            <Route
              path="/delivery/all-orders"
              element={<DeliveryOrders />}
            />
            <Route
              path="/delivery/chat"
              element={<DeliveryAgentChatPage />}
            />
          </Route>

          {/* =======================
              ADMIN ROUTES
          ======================= */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="stores" element={<ManageStores />} />
            <Route path="products" element={<ManageProducts />} />
            <Route path="chat" element={<AdminChatPage />} />
          </Route>
        </Routes>
      </main>

      {showFooter && <Footer />}
    </div>
  );
};

export default App;
