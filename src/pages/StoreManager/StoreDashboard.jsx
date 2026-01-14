import React, { useEffect, useState } from "react";
import API from "../../services/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  RefreshCcw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* =====================================================
   STORE DASHBOARD
===================================================== */
export default function StoreDashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [data, setData] = useState({
    stats: { sales: 0, orders: 0, products: 0, customers: 0 },
    revenueData: [],
    recentOrders: [],
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // 🔒 SAFETY: do not call API without token
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await API.get("/store-manager/dashboard");

      setData({
        stats: res.data.stats,
        revenueData: res.data.revenueData || [],
        recentOrders: res.data.recentOrders || [],
      });
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message;

      console.error("Dashboard fetch failed:", err);

      // 🔥 HANDLE BACKEND ERRORS CLEANLY
      if (status === 401) {
        localStorage.clear();
        navigate("/login");
      } else if (status === 403 || status === 400) {
        setError(message || "You are not authorized to access this store.");
      } else {
        setError("Failed to load dashboard. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line
  }, []);

  /* =====================
     STATES
  ===================== */
  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-red-600 font-semibold mb-4">{error}</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-orange-600 text-white px-6 py-2 rounded-lg"
        >
          Go to Login
        </button>
      </div>
    );
  }

  /* =====================
     UI
  ===================== */
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Store Overview</h1>
          <p className="text-gray-500 text-sm">
            Real-time data from your store
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-2 bg-white border px-4 py-2 rounded-lg hover:bg-gray-50 text-sm shadow mt-4 md:mt-0"
        >
          <RefreshCcw size={16} /> Refresh
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Sales"
          value={`₹${data.stats.sales.toLocaleString()}`}
          icon={<DollarSign className="text-emerald-600" />}
          bg="bg-emerald-50"
        />
        <StatCard
          title="Total Orders"
          value={data.stats.orders}
          icon={<ShoppingBag className="text-blue-600" />}
          bg="bg-blue-50"
        />
        <StatCard
          title="Products"
          value={data.stats.products}
          icon={<Package className="text-orange-600" />}
          bg="bg-orange-50"
        />
        <StatCard
          title="Customers"
          value={data.stats.customers}
          icon={<Users className="text-purple-600" />}
          bg="bg-purple-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* REVENUE CHART */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow border">
          <h3 className="text-lg font-bold mb-6">Revenue Analytics</h3>

          {data.revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.revenueData}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  fill="url(#rev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyBox text="No revenue data available" />
          )}
        </div>

        {/* RECENT ORDERS */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="text-lg font-bold mb-6">Recent Orders</h3>

          {data.recentOrders.length > 0 ? (
            data.recentOrders.map(order => (
              <div
                key={order._id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border mb-3"
              >
                <div>
                  <p className="text-sm font-semibold">
                    {order.user?.name || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-500">
                    #{order._id.slice(-6)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold">₹{order.totalPrice}</p>
                  <StatusBadge status={order.deliveryStatus} />
                </div>
              </div>
            ))
          ) : (
            <EmptyBox text="No recent orders found" />
          )}
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   SMALL COMPONENTS
===================================================== */

function StatCard({ title, value, icon, bg }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow border">
      <div className={`p-3 rounded-lg inline-block ${bg}`}>{icon}</div>
      <p className="text-gray-500 text-sm mt-4">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-gray-100">
      {status?.replaceAll("_", " ")}
    </span>
  );
}

function EmptyBox({ text }) {
  return (
    <div className="h-40 flex items-center justify-center text-gray-400">
      {text}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-6 animate-pulse">
      <div className="h-8 bg-gray-200 w-1/4 mb-8 rounded" />
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  );
}
