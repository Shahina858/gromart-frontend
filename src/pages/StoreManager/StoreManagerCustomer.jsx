// src/pages/StoreManagerCustomers.jsx

import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaUsers, FaRupeeSign, FaBoxOpen } from "react-icons/fa";
import API from "../../services/api"; // ⭐ FIX: use authenticated API instance

export default function StoreManagerCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    product: "",
    location: "",
    month: "",
    year: "",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ⭐ FIXED: Token automatically attached via API interceptor
  const fetchCustomers = async () => {
    try {
      const res = await API.get("/store-manager/customers");


      

      setCustomers(res.data);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching customers:", error.response?.data || error);

      if (error.response?.status === 401) {
        alert("Session expired! Please log in again.");
      }

      setLoading(false);
    }
  };

  // ⭐ Derived Analytics
  const totalRevenue = customers.reduce(
    (sum, c) =>
      sum +
      c.purchases.reduce((acc, p) => acc + p.price * p.quantity, 0),
    0
  );

  const totalCustomers = customers.length;

  const productSales = {};
  customers.forEach((c) => {
    c.purchases.forEach((p) => {
      productSales[p.productName] =
        (productSales[p.productName] || 0) + p.quantity;
    });
  });

  const mostSold = Object.entries(productSales).sort((a, b) => b[1] - a[1])[0];

  const topCustomers = [...customers]
    .map((c) => ({
      name: c.name,
      total: c.purchases.reduce(
        (acc, p) => acc + p.price * p.quantity,
        0
      ),
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // ⭐ Filtering
  const filteredCustomers = customers.filter((customer) => {
    const matchSearch = customer.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchProduct =
      filter.product === "" ||
      customer.purchases?.some((p) =>
        p.productName
          .toLowerCase()
          .includes(filter.product.toLowerCase())
      );

    const matchLocation =
      filter.location === "" ||
      customer.address
        .toLowerCase()
        .includes(filter.location.toLowerCase());

    const matchMonth =
      filter.month === "" ||
      customer.purchaseHistory?.some(
        (h) =>
          new Date(h.date).getMonth() + 1 ===
          parseInt(filter.month)
      );

    const matchYear =
      filter.year === "" ||
      customer.purchaseHistory?.some(
        (h) =>
          new Date(h.date).getFullYear() ===
          parseInt(filter.year)
      );

    return (
      matchSearch &&
      matchProduct &&
      matchLocation &&
      matchMonth &&
      matchYear
    );
  });

  // ⭐ Export to Excel
  const exportToExcel = () => {
    const data = filteredCustomers.map((c) => ({
      Name: c.name,
      Email: c.email,
      Address: c.address,
      Products: c.purchases
        .map((p) => `${p.productName} (${p.quantity} pcs)`)
        .join(", "),
      TotalSpent: c.purchases.reduce(
        (acc, p) => acc + p.price * p.quantity,
        0
      ),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customers");

    XLSX.writeFile(wb, "Customer_Report.xlsx");
  };

  // ⭐ Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Customer Purchase Report", 14, 15);

    const tableData = filteredCustomers.map((c) => [
      c.name,
      c.email,
      c.address,
      c.purchases
        .map((p) => `${p.productName} (${p.quantity})`)
        .join(", "),
      "₹" +
        c.purchases
          .reduce((acc, p) => acc + p.price * p.quantity, 0)
          .toFixed(2),
    ]);

    doc.autoTable({
      head: [["Name", "Email", "Address", "Products", "Total"]],
      body: tableData,
      startY: 25,
    });

    doc.save("Customer_Report.pdf");
  };

  if (loading)
    return (
      <p className="text-center py-10 text-gray-500">
        Loading customers...
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">

        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          📊 Store Analytics & Customer Reports
        </h1>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 text-white p-5 rounded-lg flex items-center space-x-4">
            <FaUsers className="text-3xl text-green-400" />
            <div>
              <p className="text-sm text-gray-300">Total Customers</p>
              <h2 className="text-xl font-semibold">{totalCustomers}</h2>
            </div>
          </div>

          <div className="bg-gray-900 text-white p-5 rounded-lg flex items-center space-x-4">
            <FaRupeeSign className="text-3xl text-yellow-400" />
            <div>
              <p className="text-sm text-gray-300">Total Revenue</p>
              <h2 className="text-xl font-semibold">
                ₹{totalRevenue.toFixed(2)}
              </h2>
            </div>
          </div>

          <div className="bg-gray-900 text-white p-5 rounded-lg flex items-center space-x-4">
            <FaBoxOpen className="text-3xl text-blue-400" />
            <div>
              <p className="text-sm text-gray-300">Most Sold Product</p>
              <h2 className="text-xl font-semibold">
                {mostSold
                  ? `${mostSold[0]} (${mostSold[1]} pcs)`
                  : "N/A"}
              </h2>
            </div>
          </div>
        </div>

        {/* Top Customers */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">
            🏆 Top 5 Customers
          </h2>
          <ul className="bg-gray-100 border rounded-lg p-4">
            {topCustomers.map((c, index) => (
              <li
                key={index}
                className="flex justify-between py-1"
              >
                <span>
                  {index + 1}. {c.name}
                </span>
                <span className="font-semibold text-green-600">
                  ₹{c.total.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2 w-60"
          />

          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Product"
              value={filter.product}
              onChange={(e) =>
                setFilter({ ...filter, product: e.target.value })
              }
              className="border rounded-lg px-4 py-2 w-40"
            />

            <input
              type="text"
              placeholder="Location"
              value={filter.location}
              onChange={(e) =>
                setFilter({ ...filter, location: e.target.value })
              }
              className="border rounded-lg px-4 py-2 w-40"
            />

            <select
              value={filter.month}
              onChange={(e) =>
                setFilter({ ...filter, month: e.target.value })
              }
              className="border rounded-lg px-4 py-2 w-32"
            >
              <option value="">Month</option>
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("en", {
                    month: "long",
                  })}
                </option>
              ))}
            </select>

            <select
              value={filter.year}
              onChange={(e) =>
                setFilter({ ...filter, year: e.target.value })
              }
              className="border rounded-lg px-4 py-2 w-28"
            >
              <option value="">Year</option>
              {[2024, 2025, 2026].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={exportToExcel}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Excel
            </button>
            <button
              onClick={exportToPDF}
              className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg"
            >
              PDF
            </button>
          </div>
        </div>

        {/* Customer Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 text-sm">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="p-3 border border-gray-300 text-left">
                  Name
                </th>
                <th className="p-3 border border-gray-300 text-left">
                  Email
                </th>
                <th className="p p-3 border border-gray-300 text-left">
                  Address
                </th>
                <th className="p-3 border border-gray-300 text-left">
                  Products
                </th>
                <th className="p-3 border border-gray-300 text-left">
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-500"
                  >
                    No matching data found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr
                    key={c._id}
                    className="hover:bg-gray-100 border-t border-gray-200"
                  >
                    <td className="p-3">{c.name}</td>
                    <td className="p-3">{c.email}</td>
                    <td className="p-3">{c.address}</td>
                    <td className="p-3">
                      {c.purchases.map((p, i) => (
                        <div key={i}>
                          {p.productName} ({p.quantity}) – ₹{p.price}
                        </div>
                      ))}
                    </td>
                    <td className="p-3 text-green-600 font-semibold">
                      ₹
                      {c.purchases
                        .reduce((acc, p) => acc + p.price * p.quantity, 0)
                        .toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
