import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


// Contexts
// import { AuthProvider } from "./context/AuthContext";
import { AuthProvider } from "./context/AuthContext";

import { CartProvider } from "./context/CartContext";
import { PantryProvider } from "./context/PantryContext";
import { MealPlannerProvider } from "./context/MealPlannerContext";
import { ChatProvider } from "./context/ChatContext";
import { WishlistProvider } from "./context/WishlistContext";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
          <PantryProvider>
            <MealPlannerProvider>
              <ChatProvider>
                <App />
              </ChatProvider>
            </MealPlannerProvider>
          </PantryProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
