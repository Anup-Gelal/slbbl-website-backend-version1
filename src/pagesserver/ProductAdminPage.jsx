import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://slbbl-website-backend-version1.onrender.com/api/v1";
const ITEMS_PER_PAGE = 6;

const initialForm = {
  title: "",
  iconBg: "",
  description: "",
  iconFile: null,
};

const ProductAdminPage = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/products`);
      setProducts(res.data || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "iconFile") {
      setForm((prev) => ({ ...prev, iconFile: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("iconBg", form.iconBg);
      formData.append("description", form.description);
      if (form.iconFile) {
        formData.append("icon", form.iconFile);
      }

      if (editingId) {
        await axios.put(`${API_BASE}/admin/products/${editingId}`, formData);
      } else {
        const res = await axios.post(`${API_BASE}/admin/products`, formData);
        setProducts((prev) => [...prev, res.data]);
      }

      fetchProducts();
      resetForm();
    } catch (err) {
      console.error("Error submitting product:", err);
      setError("Failed to submit product");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      title: product.title,
      iconBg: product.iconBg,
      description: product.description,
      iconFile: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`${API_BASE}/admin/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const filteredSorted = products
    .filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortAsc) return a.title.localeCompare(b.title);
      else return b.title.localeCompare(a.title);
    });

  const totalPages = Math.ceil(filteredSorted.length / ITEMS_PER_PAGE);
  const paginated = filteredSorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Product Admin</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white border p-4 rounded shadow mb-8"
      >
        <div>
          <label className="block font-semibold">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full bg-white border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Icon Background</label>
          <input
            name="iconBg"
            value={form.iconBg}
            onChange={handleChange}
            className="w-full border bg-white p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border bg-white p-2 rounded"
            rows={3}
          />
        </div>

        <div>
          <label className="block font-semibold">
            Upload Icon {editingId && "(Upload to replace)"}
          </label>
          <input
            type="file"
            name="iconFile"
            accept="image/*"
            onChange={handleChange}
            className="w-full bg-white"
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Saving..." : editingId ? "Update" : "Create"} Product
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Filter and Sort Controls */}
      <div className="mb-4 flex flex-col sm:flex-row gap-4 justify-between">
        <input
          type="text"
          placeholder="Search by title..."
          className="border p-2 rounded bg-white w-full sm:w-1/2 "
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />

        <button
          onClick={() => setSortAsc((prev) => !prev)}
          className="text-sm text-blue-600 underline"
        >
          Sort: {sortAsc ? "A-Z" : "Z-A"}
        </button>
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {paginated.map((p) => (
          <div key={p.id} className="bg-white border rounded p-4 shadow">
            {p.icon && (
              <img
                src={`https://slbbl-website-backend-version1.onrender.com/${p.icon.replace(/^\/+/, "")}`}
                alt={p.title}
                className="w-20 h-20 object-contain mb-2"
              />
            )}
            <h4 className="font-semibold">{p.title}</h4>
            <p className="text-sm text-gray-600">{p.description}</p>
            {p.iconBg && (
              <p className="text-xs mt-1 text-gray-500">Icon BG: {p.iconBg}</p>
            )}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEdit(p)}
                className="text-blue-600 hover:underline text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="text-red-600 hover:underline text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded border ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600 border-blue-600"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductAdminPage;
