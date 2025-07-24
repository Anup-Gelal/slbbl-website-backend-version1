import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8080/api/v1";
const ITEMS_PER_PAGE = 6;

const initialForm = {
  title: "",
  description: "",
  iconFile: null,
};

const ServiceAdminPage = () => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const token = localStorage.getItem("token");

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/services`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(res.data || []);
    } catch (err) {
      setError("Failed to load services");
    }
  };

  useEffect(() => {
    fetchServices();
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
        await axios.put(`${API_BASE}/admin/services/${editingId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccess("Service updated successfully.");
      } else {
        await axios.post(`${API_BASE}/admin/services`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccess("Service created successfully.");
      }
      resetForm();
      fetchServices();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save service");
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (s) => {
    setForm({
      title: s.title,
      description: s.description,
      iconFile: null,
    });
    setEditingId(s.id);
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      await axios.delete(`${API_BASE}/admin/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Service deleted successfully.");
      fetchServices();
    } catch (err) {
      setError("Failed to delete service");
    }
  };

  // Filter services by search query
  const filteredServices = services.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Manage Services</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      {/* Service Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <div>
          <label className="block font-medium text-gray-700">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleInputChange}
            required
            className="w-full border px-3 py-2 rounded bg-white"
            placeholder="Service title"
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
            placeholder="Service description"
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
            {editingId ? "Update" : "Create"} Service
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
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded bg-white"
        />
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedServices.map((s) => (
          <div key={s.id} className="border p-4 rounded shadow">
            <h3 className="font-bold text-lg text-blue-700">{s.title}</h3>
            <p className="text-sm text-gray-700 mb-2">{s.description}</p>
            {s.icon && (
              <img
                src={`http://localhost:8080/${s.icon.replace(/^\/+/, "")}`}
                alt={s.title}
                className="w-16 h-16 object-contain"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            )}
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => startEditing(s)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
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

export default ServiceAdminPage;
