import React, { useEffect, useState } from "react";
import API from "../../services/api";

import ProductCard from "../../components/ProductCard";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("/admin/products")
      .then((r) => setProducts(r.data || []))
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Manage Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <ProductCard key={p._id || p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
