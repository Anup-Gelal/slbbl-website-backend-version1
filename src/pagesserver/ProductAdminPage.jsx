import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://slbbl-website-backend-version1.onrender.com/api/v1";

const initialForm = {
  title: "",
  description: "",
  iconFile: null,
};

const ITEMS_PER_PAGE = 6;

const ProductAdminPage = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data || []);
    } catch (err) {
      setError("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "iconFile") {
      setForm((f) => ({ ...f, iconFile: files[0] }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    if (form.iconFile) formData.append("icon", form.iconFile);

    try {
      if (editingId) {
        await axios.put(`${API_BASE}/admin/products/${editingId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccess("Product updated successfully.");
      } else {
        await axios.post(`${API_BASE}/admin/products`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccess("Product created successfully.");
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (p) => {
    setForm({
      title: p.title,
      description: p.description,
      iconFile: null,
    });
    setEditingId(p.id);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${API_BASE}/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Product deleted successfully.");
      fetchProducts();
    } catch (err) {
      setError("Failed to delete product");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Manage Products</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <div>
          <label className="block font-medium text-gray-700">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleInputChange}
            required
            className="w-full border px-3 py-2 rounded bg-white"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleInputChange}
            required
            rows={3}
            className="w-full border px-3 py-2 rounded bg-white text-green-800"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">
            Icon Image {editingId && " (upload to change)"}
          </label>
          <input
            type="file"
            name="iconFile"
            accept="image/*"
            onChange={handleInputChange}
            className="w-full"
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 text-white px-5 py-2 rounded hover:bg-green-800"
          >
            {editingId ? "Update" : "Create"} Product
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-5 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded bg-white"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedProducts.map((p) => (
          <div key={p.id} className="border p-4 rounded shadow">
            <h3 className="font-bold text-lg text-blue-700">{p.title}</h3>
            <p className="text-sm text-gray-700 mb-2">{p.description}</p>
            {p.icon && (
              <img
                src={`http://localhost:8080/${p.icon}`}
                alt={p.title}
                className="w-16 h-16 object-contain"
              />
            )}
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => startEditing(p)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
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
                  ? "bg-green-700 text-white"
                  : "bg-white text-green-700 border-green-700"
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
