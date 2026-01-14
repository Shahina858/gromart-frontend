import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GuestOnly() {
  const { user } = useAuth();

  if (user) {
    if (user.role === "customer") return <Navigate to="/customer/home" replace />;
    if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (user.role === "delivery") return <Navigate to="/delivery/dashboard" replace />;
    if (user.role === "manager") return <Navigate to="/manager/dashboard" replace />;
  }

  return <Outlet />;
}
