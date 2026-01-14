import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import safeStorage from "../utils/safeStorage";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  /* =========================
     LOAD USER ON REFRESH
  ========================= */
  useEffect(() => {
    try {
      const savedUser = safeStorage.getItem("user");

      if (!savedUser || savedUser === "undefined") return;

      const parsedUser = JSON.parse(savedUser);

      // ✅ Ensure required fields exist
      if (parsedUser?._id) {
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("❌ Failed to load user from storage:", error);
      safeStorage.removeItem("user");
    }
  }, []);

  /* =========================
     LOGIN
  ========================= */
  const login = (token, userData) => {
    if (!token || !userData) {
      console.error("❌ Invalid login payload");
      return;
    }

    try {
      // 🔥 IMPORTANT: userData MUST include phone
      safeStorage.setItem("token", token);
      safeStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (e) {
      console.warn("⚠️ Could not save auth data", e);
    }
  };

  /* =========================
     LOGOUT
  ========================= */
  const logout = () => {
    try {
      safeStorage.clear();
    } catch (e) {
      console.warn("⚠️ Could not clear storage on logout", e);
    }

    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
