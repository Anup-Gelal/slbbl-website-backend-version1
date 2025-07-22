import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://slbbl-website-backend-version1.onrender.com/api/v1";
const ITEMS_PER_PAGE = 6;

const AdminScrollingNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [form, setForm] = useState({ notice_text: "" });
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch notices
  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/admin/scrolling-notices`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Scrolling Notices API response:", res.data);
      // Adjust here depending on actual response structure:
      // If API returns array directly:
      // setNotices(res.data || []);
      // If API returns { notices: [...] }
      setNotices(Array.isArray(res.data) ? res.data : res.data.notices || []);
      setError("");
    } catch (err) {
      setError("Failed to fetch scrolling notices.");
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // Form handlers
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.notice_text.trim()) {
      setError("Notice text cannot be empty.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (editingId) {
        await axios.put(`${API_BASE}/admin/scrolling-notices/${editingId}`, form, config);
        setError("");
      } else {
        await axios.post(`${API_BASE}/admin/scrolling-notices`, form, config);
      }
      setForm({ notice_text: "" });
      setEditingId(null);
      fetchNotices();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save notice.");
    } finally {
      setLoading(false);
    }
  };

  // Edit existing notice
  const startEditing = (notice) => {
    setEditingId(notice.id);
    setForm({ notice_text: notice.notice_text });
    setError("");
  };

  // Delete notice
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;
    setLoading(true);
    try {
      await axios.delete(`${API_BASE}/admin/scrolling-notices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotices();
      setError("");
    } catch {
      setError("Failed to delete notice.");
    } finally {
      setLoading(false);
    }
  };

  // Filter and paginate
  const filtered = Array.isArray(notices)
    ? notices.filter((n) =>
        n.notice_text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">{editingId ? "Edit Notice" : "Add New Notice"}</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          name="notice_text"
          value={form.notice_text}
          onChange={handleInputChange}
          placeholder="Notice text"
          rows={3}
          className="w-full border px-3 py-2 rounded mb-3 bg-white"
          required
        />
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            {editingId ? "Update" : "Create"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ notice_text: "" });
                setError("");
              }}
              className="bg-gray-400 text-white px-6 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <input
        type="text"
        placeholder="Search notices..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full border px-3 py-2 rounded mb-4 bg-white"
      />

      {loading && <p>Loading...</p>}

      {!loading && paginated.length === 0 && <p>No notices found.</p>}

      <ul className="space-y-3">
        {paginated.map((notice) => (
          <li key={notice.id} className="border p-3 rounded flex justify-between items-center">
            <p className="flex-1">{notice.notice_text}</p>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => startEditing(notice)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(notice.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

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

export default AdminScrollingNotices;
