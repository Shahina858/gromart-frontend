import React, { useEffect, useMemo, useState } from "react";
import API from "../../services/api";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  Layers,
  IndianRupee,
} from "lucide-react";

/* =========================
   HELPERS
========================= */
const safeNum = (v) => Number(v) || 0;

const getImageUrl = (path) => {
  if (!path) return "https://via.placeholder.com/60";
  if (path.startsWith("http")) return path;

  const base = import.meta.env.VITE_API_URL
    ?.replace("/api", "")
    .replace(/\/$/, "");

  return `${base}${path}`;
};

export default function StoreInventoryPage() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [restockQty, setRestockQty] = useState({});
  const [restocked, setRestocked] = useState({});
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH REAL DATA
  ========================= */
  const fetchData = async () => {
    try {
      const [invRes, ordersRes] = await Promise.all([
        API.get("/store-manager/inventory"),
        API.get("/store-manager/orders"),
      ]);

      setProducts(invRes.data || []);
      setOrders(ordersRes.data || []);
    } catch (err) {
      console.error("❌ Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* =========================
     RESTOCK (WITH FEEDBACK)
  ========================= */
  const handleRestock = async (productId) => {
    const qty = Number(restockQty[productId]);
    if (!qty || qty < 0) {
      alert("Enter valid stock quantity");
      return;
    }

    try {
      await API.put(`/store-manager/inventory/${productId}/stock`, {
        stock: qty, // absolute stock value
      });

      // show success badge
      setRestocked((prev) => ({ ...prev, [productId]: true }));
      setRestockQty((prev) => ({ ...prev, [productId]: "" }));

      // auto refresh after 2 seconds
      setTimeout(() => {
        setRestocked((prev) => ({ ...prev, [productId]: false }));
        fetchData();
      }, 2000);
    } catch (err) {
      console.error("❌ Restock failed:", err);
    }
  };

  /* =========================
     DERIVED DATA
  ========================= */
  const { stats, topSelling, lowStock, outOfStock } = useMemo(() => {
    const totalProducts = products.length;
    const totalStock = products.reduce(
      (sum, p) => sum + safeNum(p.stock),
      0
    );

    const topSelling = [...products]
      .filter((p) => safeNum(p.sold) > 0)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);

    const lowStock = products.filter(
      (p) => safeNum(p.stock) > 0 && safeNum(p.stock) <= 5
    );

    const outOfStock = products.filter(
      (p) => safeNum(p.stock) === 0
    );

    const totalRevenue = orders.reduce(
      (sum, o) => sum + safeNum(o.totalPrice),
      0
    );

    return {
      stats: {
        totalProducts,
        totalStock,
        totalRevenue,
      },
      topSelling,
      lowStock,
      outOfStock,
    };
  }, [products, orders]);

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600">
        Loading dashboard...
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold">📊 Store Manager Dashboard</h1>

      {/* =========================
         SUMMARY
      ========================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Products" value={stats.totalProducts} icon={Package} />
        <StatCard title="Total Stock" value={stats.totalStock} icon={Layers} />
        <StatCard
          title="Revenue"
          value={`₹${stats.totalRevenue}`}
          icon={IndianRupee}
        />
        <StatCard
          title="Low Stock Alerts"
          value={lowStock.length}
          icon={AlertTriangle}
          danger
        />
      </div>

      {/* =========================
         TOP SELLING
      ========================= */}
      <Section title="🔥 Top Selling Products">
        {topSelling.length === 0 ? (
          <Empty />
        ) : (
          topSelling.map((p) => (
            <Row key={p._id} image={p.image} title={p.title}>
              <span className="text-sm text-gray-600">
                Sold: {p.sold}
              </span>
            </Row>
          ))
        )}
      </Section>

      {/* =========================
         LOW STOCK
      ========================= */}
      <Section title="⚠️ Low Stock Alerts (≤5)">
        {lowStock.length === 0 ? (
          <Empty />
        ) : (
          lowStock.map((p) => (
            <RestockRow
              key={p._id}
              product={p}
              value={restockQty[p._id] || ""}
              onChange={(v) =>
                setRestockQty({ ...restockQty, [p._id]: v })
              }
              onRestock={() => handleRestock(p._id)}
              restocked={restocked[p._id]}
            />
          ))
        )}
      </Section>

      {/* =========================
         OUT OF STOCK
      ========================= */}
      <Section title="❌ Out of Stock">
        {outOfStock.length === 0 ? (
          <Empty />
        ) : (
          outOfStock.map((p) => (
            <RestockRow
              key={p._id}
              product={p}
              value={restockQty[p._id] || ""}
              onChange={(v) =>
                setRestockQty({ ...restockQty, [p._id]: v })
              }
              onRestock={() => handleRestock(p._id)}
              restocked={restocked[p._id]}
            />
          ))
        )}
      </Section>
    </div>
  );
}

/* =========================
   COMPONENTS
========================= */
function StatCard({ title, value, icon: Icon, danger }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow flex items-center gap-4">
      <div
        className={`p-3 rounded-full ${
          danger ? "bg-red-100" : "bg-blue-100"
        }`}
      >
        <Icon className={danger ? "text-red-600" : "text-blue-600"} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function Row({ image, title, children }) {
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-xl border shadow">
      <div className="flex items-center gap-4">
        <img
          src={getImageUrl(image)}
          alt={title}
          className="w-14 h-14 rounded object-cover"
        />
        <p className="font-semibold">{title}</p>
      </div>
      {children}
    </div>
  );
}

function RestockRow({ product, value, onChange, onRestock, restocked }) {
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-xl border shadow">
      <div className="flex items-center gap-4">
        <img
          src={getImageUrl(product.image)}
          alt={product.title}
          className="w-14 h-14 rounded object-cover"
        />
        <div>
          <p className="font-semibold">{product.title}</p>
          <p className="text-sm text-gray-500">
            Stock: {product.stock}
          </p>
          {restocked && (
            <p className="text-green-600 text-sm font-medium">
              ✔ Restocked
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          value={value}
          placeholder="Qty"
          onChange={(e) => onChange(e.target.value)}
          className="w-20 border rounded px-2 py-1"
        />
        <button
          onClick={onRestock}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Restock
        </button>
      </div>
    </div>
  );
}

function Empty() {
  return (
    <p className="text-gray-500 italic">No data available.</p>
  );
}
