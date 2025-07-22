import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://slbbl-website-backend-version1.onrender.com/api/v1";
const ITEMS_PER_PAGE = 6;

const AdminAboutVision = () => {
  const [visions, setVisions] = useState([]);
  const [form, setForm] = useState({ vision: "", objective: "", about: "" });
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchVisions = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/about/vision`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data) {
        const v = res.data;
        setVisions([v]);
        setForm({ vision: v.vision, objective: v.objective, about: v.about });
        setEditingId(v.id || 1);
      }
    } catch (err) {
      setError("Failed to load vision data");
    }
  };

  useEffect(() => {
    fetchVisions();
  }, []);

  const resetForm = () => {
    setForm({ vision: "", objective: "", about: "" });
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.put(`${API_BASE}/admin/about/vision`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setSuccess("Vision & About updated successfully.");
      fetchVisions();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update.");
    } finally {
      setLoading(false);
    }
  };

  const filteredVisions = visions.filter(
    (v) =>
      v.vision.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.objective.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.about.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredVisions.length / ITEMS_PER_PAGE));
  const paginatedVisions = filteredVisions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const startEditing = (v) => {
    setForm({ vision: v.vision, objective: v.objective, about: v.about });
    setEditingId(v.id || 1);
    setSuccess("");
    setError("");
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-green-700 mb-4">
        Manage About Vision & Objective
      </h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-6 mb-6">
        <div>
          <label className="block font-medium text-gray-700 mb-1">Vision</label>
          <textarea
            name="vision"
            value={form.vision}
            onChange={(e) => setForm({ ...form, vision: e.target.value })}
            rows={5}
            required
            className="w-full border px-3 py-2 rounded bg-white text-green-800"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-1">Objective</label>
          <textarea
            name="objective"
            value={form.objective}
            onChange={(e) => setForm({ ...form, objective: e.target.value })}
            rows={5}
            required
            className="w-full border px-3 py-2 rounded bg-white text-green-800"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-1">About</label>
          <textarea
            name="about"
            value={form.about}
            onChange={(e) => setForm({ ...form, about: e.target.value })}
            rows={5}
            required
            className="w-full border px-3 py-2 rounded bg-white text-green-800"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800"
          >
            {loading ? "Saving..." : "Update"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-400 text-white px-5 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search visions..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded bg-white"
        />
      </div>

      <div>
        {paginatedVisions.length === 0 && (
          <p className="text-gray-600">No vision records found.</p>
        )}

        {paginatedVisions.map((v) => (
          <div
            key={v.id}
            className="border p-4 rounded shadow mb-4 cursor-pointer hover:bg-green-50"
            onClick={() => startEditing(v)}
          >
            <h3 className="font-bold text-lg text-blue-700 mb-2">Vision</h3>
            <p className="text-gray-800 mb-2 whitespace-pre-line">{v.vision}</p>
            <h3 className="font-bold text-lg text-blue-700 mb-2">Objective</h3>
            <p className="text-gray-800 mb-2 whitespace-pre-line">{v.objective}</p>
            <h3 className="font-bold text-lg text-blue-700 mb-2">About</h3>
            <p className="text-gray-800 whitespace-pre-line">{v.about}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAboutVision;
