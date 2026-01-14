import React, { useEffect, useState } from "react";
import API from "../../services/api";

const FALLBACK_IMAGE = "/placeholder.png"; // put in /public

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    price: "",
    stock: "",
    description: "",
    category: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  /* =========================
     FETCH INVENTORY
  ========================= */
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get("/store-manager/inventory");
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("❌ Fetch error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* =========================
     INPUT CHANGE
  ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* =========================
     IMAGE SELECT
  ========================= */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setForm((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  /* =========================
     RESET FORM
  ========================= */
  const resetForm = () => {
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setEditing(null);
    setForm({
      title: "",
      price: "",
      stock: "",
      description: "",
      category: "",
      image: null,
    });
    setPreview(null);
  };

  /* =========================
     SAVE PRODUCT
  ========================= */
  const save = async () => {
    try {
      const data = new FormData();
      data.append("title", form.title.trim());
      data.append("price", Number(form.price));
      data.append("stock", Number(form.stock));
      data.append("description", form.description.trim());
      data.append("category", form.category.trim());

      if (form.image instanceof File) {
        data.append("image", form.image);
      }

      if (editing) {
        await API.put(`/products/${editing._id}`, data);
      } else {
        await API.post("/products", data);
      }

      await fetchProducts();
      resetForm();
      alert("✅ Product saved successfully!");
    } catch (err) {
      console.error("❌ Save error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to save product");
    }
  };

  /* =========================
     EDIT PRODUCT
  ========================= */
  const startEdit = (p) => {
    setEditing(p);
    setForm({
      title: p.title || "",
      price: p.price ?? "",
      stock: p.stock ?? 0,
      description: p.description || "",
      category: p.category || "",
      image: null,
    });

    // backend image URL
    setPreview(
      p.image
        ? p.image.startsWith("http")
          ? p.image
          : `http://localhost:5000/${p.image}`
        : null
    );
  };

  /* =========================
     DELETE PRODUCT
  ========================= */
  const remove = async (p) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await API.delete(`/products/${p._id}`);
      setProducts((prev) => prev.filter((x) => x._id !== p._id));
    } catch (err) {
      console.error("❌ Delete error:", err.response?.data || err.message);
      alert("Failed to delete product");
    }
  };

  /* =========================
     IMAGE RESOLVER
  ========================= */
 const resolveImage = (img) => {
  if (!img || typeof img !== "string" || img.trim() === "") return null;
  if (img.startsWith("http")) return img;
  return `${API_BASE}/${img.replace(/^\/+/, "")}`;
};

  return (
    <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow-lg mt-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        🛒 Product Management
      </h2>

      {/* FORM */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3 mb-6">
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="border p-2 rounded-md"
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="border p-2 rounded-md"
        />

        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          className="border p-2 rounded-md"
        />

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 rounded-md"
        />

        <input
          name="category"
          placeholder="Category (eg: snacks, meat)"
          value={form.category}
          onChange={handleChange}
          className="border p-2 rounded-md"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border p-2 rounded-md"
        />

        <button
          onClick={save}
          className="bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800"
        >
          {editing ? "Update" : "Add"}
        </button>
      </div>

      {/* IMAGE PREVIEW */}
      {preview && (
        <img
          src={preview}
          alt="preview"
          onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
          className="w-48 h-36 object-cover rounded-lg border mb-6"
        />
      )}

      {/* PRODUCTS */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-400 italic">
          No products available
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <div
              key={p._id}
              className="border rounded-xl p-4 shadow hover:shadow-md transition"
            >
              {resolveImage(p.image) ? (
  <img src={resolveImage(p.image)} alt={p.title} />
) : (
  <div className="h-40 flex items-center justify-center bg-gray-100 text-gray-400">
    No Image
  </div>
)}

              <h3 className="font-semibold mt-2">{p.title}</h3>
              <p className="text-gray-700">₹{p.price}</p>

              <p
                className={
                  p.stock === 0 ? "text-red-600" : "text-green-600"
                }
              >
                Stock: {p.stock}
              </p>

              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => startEdit(p)}
                  className="border px-3 py-1 rounded hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(p)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
