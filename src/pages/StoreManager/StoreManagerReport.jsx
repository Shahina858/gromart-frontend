import React, { useEffect, useMemo, useState } from "react";
import API from "../../services/api";
import {
  FaChartLine,
  FaTruck,
  FaMoneyBillWave,
  FaSearch,
} from "react-icons/fa";

export default function StoreManagerReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("All");
  const [vendor, setVendor] = useState("All");
  const [payment, setPayment] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("None");

  /* ================= FETCH ================= */
  useEffect(() => {
    API.get("/store-manager/products-report")
      .then(res => setData(res.data || []))
      .catch(() => alert("Failed to load report"))
      .finally(() => setLoading(false));
  }, []);

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    let d = [...data];

    if (status !== "All") {
      d = d.filter(i => i.deliveryStatus === status);
    }

    if (vendor !== "All") {
      d = d.filter(i => i.vendorName === vendor);
    }

    if (payment !== "All") {
      d = d.filter(i => i.paymentMethod === payment);
    }

    if (search) {
      const t = search.toLowerCase();
      d = d.filter(i =>
        i.productName?.toLowerCase().includes(t) ||
        i.vendorName?.toLowerCase().includes(t)
      );
    }

    if (sort === "ProfitHigh") d.sort((a, b) => b.profit - a.profit);
    if (sort === "SalesHigh") d.sort((a, b) => b.quantitySold - a.quantitySold);

    return d;
  }, [data, status, vendor, payment, search, sort]);

  /* ================= SUMMARY ================= */
  const totalSales = filtered.reduce(
    (s, i) => s + i.sellingPrice * i.quantitySold,
    0
  );

  const totalProfit = filtered.reduce(
    (s, i) => s + i.profit,
    0
  );

  if (loading) return <p className="text-center mt-10">Loading…</p>;

  /* ================= UI ================= */
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">
        🧾 Product Sales Report
      </h1>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Summary icon={<FaMoneyBillWave />} title="Sales" value={`₹${totalSales}`} />
        <Summary icon={<FaChartLine />} title="Profit" value={`₹${totalProfit}`} />
        <Summary icon={<FaTruck />} title="Products" value={filtered.length} />
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded shadow flex flex-wrap gap-3 mb-6">
        <Search value={search} onChange={setSearch} />

        <Select
          value={status}
          onChange={setStatus}
          options={[
            "All",
            "placed",
            "packed",
            "out_for_delivery",
            "delivered",
            "cancelled",
          ]}
        />

        <Select
          value={vendor}
          onChange={setVendor}
          options={[
            "All",
            ...new Set(data.map(i => i.vendorName).filter(Boolean)),
          ]}
        />

        <Select
          value={payment}
          onChange={setPayment}
          options={["All", "ONLINE", "COD"]}
        />

        <Select
          value={sort}
          onChange={setSort}
          options={["None", "ProfitHigh", "SalesHigh"]}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Vendor</th>
              <th className="p-3">Sold</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Cost</th>
              <th className="p-3">Price</th>
              <th className="p-3">Profit</th>
              <th className="p-3">Status</th>
              <th className="p-3">Payment</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((i, idx) => (
              <tr key={idx} className="border-b">
                <td className="p-3">{i.productName}</td>
                <td className="p-3 text-center">{i.vendorName}</td>
                <td className="p-3 text-center">{i.quantitySold}</td>
                <td className="p-3 text-center">{i.remainingStock}</td>
                <td className="p-3 text-center">₹{i.costPrice}</td>
                <td className="p-3 text-center">₹{i.sellingPrice}</td>
                <td className="p-3 text-center text-green-600 font-semibold">
                  ₹{i.profit}
                </td>
                <td className="p-3 text-center">{i.deliveryStatus}</td>
                <td className="p-3 text-center">{i.paymentMethod}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ===== SMALL COMPONENTS ===== */

const Summary = ({ icon, title, value }) => (
  <div className="bg-white p-4 rounded shadow flex gap-3 items-center">
    <div className="text-xl text-blue-600">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

const Search = ({ value, onChange }) => (
  <div className="flex items-center border rounded px-3">
    <FaSearch className="text-gray-400 mr-2" />
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Search"
      className="py-2 outline-none"
    />
  </div>
);

const Select = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={e => onChange(e.target.value)}
    className="border rounded px-3 py-2"
  >
    {options.map(o => (
      <option key={o} value={o}>
        {o}
      </option>
    ))}
  </select>
);
