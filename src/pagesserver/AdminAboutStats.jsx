import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8080/api/v1";
const IMAGE_BASE = "http://localhost:8080/uploads/about/stats/";
const ITEMS_PER_PAGE = 6;

const AdminAboutStats = () => {
  const [stats, setStats] = useState([]);
  const [form, setForm] = useState({ title: "", value: "", iconFile: null });
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/about/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data || []);
    } catch (err) {
      setError("Failed to load stats");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const resetForm = () => {
    setForm({ title: "", value: "", iconFile: null });
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.value || (!form.iconFile && !editingId)) {
      setError("Please fill out the form.");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("value", form.value);
    if (form.iconFile) formData.append("icon", form.iconFile);

    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`${API_BASE}/admin/about/stats/${editingId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccess("Stat updated successfully.");
      } else {
        await axios.post(`${API_BASE}/admin/about/stats`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccess("Stat created successfully.");
      }
      resetForm();
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save stat.");
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (s) => {
    setForm({ title: s.title, value: s.value, iconFile: null });
    setEditingId(s.id);
    setSuccess("");
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this stat?")) return;
    try {
      await axios.delete(`${API_BASE}/admin/about/stats/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Stat deleted.");
      fetchStats();
    } catch (err) {
      setError("Delete failed");
    }
  };

  const filteredStats = stats.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredStats.length / ITEMS_PER_PAGE);
  const paginatedStats = filteredStats.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Manage Stats</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block font-medium text-gray-700">Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border px-3 py-2 rounded bg-white"
            required
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Value</label>
          <input
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
            className="w-full border px-3 py-2 rounded bg-white"
            required
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">
            Icon Image {editingId && " (upload to change)"}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, iconFile: e.target.files[0] })}
            className="w-full"
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 text-white px-5 py-2 rounded hover:bg-green-800"
          >
            {editingId ? "Update Stat" : "Add Stat"}
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

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search stats..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded bg-white"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedStats.map((s) => (
          <div key={s.id} className="border p-4 rounded shadow">
            <h3 className="font-bold text-lg text-blue-700">{s.title}</h3>
            <p className="text-sm text-gray-700 mb-2">{s.value}</p>
            {s.icon_url && (
              <img
                src={`${IMAGE_BASE}${s.icon_url}`}
                alt={s.title}
                className="w-16 h-16 object-contain"
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

export default AdminAboutStats;
