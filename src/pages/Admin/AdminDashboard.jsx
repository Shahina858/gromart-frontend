import React, { useEffect, useState } from "react";
import {
  Users,
  Store,
  Package,
  DollarSign,
  BarChart3,
  TrendingUp,
  Clock,
  ShoppingCart,
} from "lucide-react";

import DashboardCard from "../../components/DashboardCard";
import API from "../../services/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AdminDashboard() {
  const [summary, setSummary] = useState({
    users: 0,
    stores: 0,
    orders: 0,
    revenue: 0,
  });

  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [summaryRes, salesRes, productsRes, ordersRes] =
        await Promise.all([
          API.get("/admin/summary"),
          API.get("/admin/sales-stats"),
          API.get("/admin/top-products"),
          API.get("/admin/recent-orders"),
        ]);

      setSummary(summaryRes.data || {});
      setSalesData(salesRes.data || []);
      setTopProducts(productsRes.data || []);
      setRecentOrders(ordersRes.data || []);
    } catch (err) {
      console.error("❌ Dashboard load failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
         Admin Dashboard
      </h1>

      {/* ===================== KPI CARDS ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <DashboardCard title="Users" value={summary.users} icon={<Users />} />
        <DashboardCard title="Stores" value={summary.stores} icon={<Store />} />
        <DashboardCard title="Orders" value={summary.orders} icon={<Package />} />
        <DashboardCard
          title="Revenue"
          value={`₹${summary.revenue?.toLocaleString()}`}
          icon={<DollarSign />}
        />
      </div>

      {/* ===================== ANALYTICS ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Monthly Sales */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <BarChart3 /> Monthly Revenue
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#6366f1"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <TrendingUp /> Top Selling Products
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={topProducts}
                dataKey="sales"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {topProducts.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===================== RECENT ORDERS ===================== */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Clock /> Recent Orders
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Customer</th>
                <th className="p-2 text-left">Product</th>
                <th className="p-2 text-left">Amount</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((o, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{o.customer}</td>
                    <td className="p-2 flex items-center gap-1">
                      <ShoppingCart size={14} /> {o.product}
                    </td>
                    <td className="p-2">₹{o.amount}</td>
                    <td className="p-2">{o.status}</td>
                    <td className="p-2">{o.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-400">
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
