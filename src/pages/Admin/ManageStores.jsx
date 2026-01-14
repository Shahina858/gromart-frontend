import React, { useEffect, useMemo, useState } from "react";
import API from "../../services/api";
import {
  Store,
  ShoppingBag,
  DollarSign,
  Search,
} from "lucide-react";

export default function AdminStoreWiseSales() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("revenue"); // revenue | orders

  /* =========================
     FETCH STORE-WISE SALES
  ========================= */
  useEffect(() => {
    fetchStoreSales();
  }, []);

  const fetchStoreSales = async () => {
    try {
      const res = await API.get("/admin/store-wise-sales");
      setData(res.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch store-wise sales", err);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     FILTER + SORT
  ========================= */
  const filtered = useMemo(() => {
    let list = [...data];

    if (search) {
      list = list.filter((s) =>
        s.storeName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortBy === "revenue") {
      list.sort((a, b) => b.totalRevenue - a.totalRevenue);
    }

    if (sortBy === "orders") {
      list.sort((a, b) => b.totalOrders - a.totalOrders);
    }

    return list;
  }, [data, search, sortBy]);

  const totalRevenue = filtered.reduce(
    (sum, s) => sum + s.totalRevenue,
    0
  );

  const totalOrders = filtered.reduce(
    (sum, s) => sum + s.totalOrders,
    0
  );

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading store-wise sales...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Store /> Store-wise Sales
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Revenue & order performance by store
        </p>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <SummaryCard
          icon={<DollarSign />}
          label="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
        />
        <SummaryCard
          icon={<ShoppingBag />}
          label="Total Orders"
          value={totalOrders}
        />
      </div>

      {/* CONTROLS */}
      <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-4 mb-6">
        <div className="flex items-center border rounded px-3">
          <Search size={16} className="text-gray-400 mr-2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search store..."
            className="outline-none py-2"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="revenue">Sort by Revenue</option>
          <option value="orders">Sort by Orders</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="p-3 text-left">Rank</th>
              <th className="p-3 text-left">Store</th>
              <th className="p-3 text-center">Orders</th>
              <th className="p-3 text-center">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((s, i) => (
                <tr
                  key={s.storeId}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3 font-semibold">{i + 1}</td>
                  <td className="p-3">{s.storeName}</td>
                  <td className="p-3 text-center">
                    {s.totalOrders}
                  </td>
                  <td className="p-3 text-center font-semibold text-green-600">
                    ₹{s.totalRevenue.toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="p-6 text-center text-gray-400"
                >
                  No stores found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =========================
   SMALL COMPONENTS
========================= */

const SummaryCard = ({ icon, label, value }) => (
  <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
    <div className="p-3 bg-gray-100 rounded-lg">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </div>
);
