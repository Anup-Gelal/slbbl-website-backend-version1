import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://slbbl-website-backend-version1.onrender.com/api/v1";
const ITEMS_PER_PAGE = 6;

const AdminBaseRates = () => {
  const [rates, setRates] = useState([]);
  const [form, setForm] = useState({ month: "", rate: "" });
  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const token = localStorage.getItem("token");

  const fetchRates = async () => {
    try {
      const res = await axios.get(`${API_BASE}/base-rates`);
      setRates(res.data);
    } catch (err) {
      setError("Failed to load base rates");
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const resetForm = () => {
    setForm({ month: "", rate: "" });
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const payload = { ...form, rate: parseFloat(form.rate) };
      if (editingId) {
        await axios.put(`${API_BASE}/admin/base-rates/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Base rate updated successfully.");
      } else {
        await axios.post(`${API_BASE}/admin/base-rates`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Base rate added successfully.");
      }
      resetForm();
      fetchRates();
    } catch (err) {
      setError("Failed to save base rate");
    }
  };

  const startEditing = (r) => {
    setForm({ month: r.month, rate: r.rate });
    setEditingId(r.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this base rate?")) return;
    try {
      await axios.delete(`${API_BASE}/admin/base-rates/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRates();
    } catch {
      setError("Failed to delete");
    }
  };

  const filteredRates = Array.isArray(rates)
    ? rates.filter((r) =>
        r.month.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const totalPages = Math.ceil(filteredRates.length / ITEMS_PER_PAGE);
  const paginatedRates = filteredRates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const renderAverage = (index) => {
    if (index + 2 < filteredRates.length) {
      const r1 = filteredRates[index].rate;
      const r2 = filteredRates[index + 1].rate;
      const r3 = filteredRates[index + 2].rate;
      const avg = ((r1 + r2 + r3) / 3).toFixed(2);
      return (
        <li className="italic text-sm text-gray-500 mt-1 mb-3">
          → Average of {filteredRates[index].month},{" "}
          {filteredRates[index + 1].month}, and {filteredRates[index + 2].month}:{" "}
          <span className="font-semibold">{avg}%</span>
        </li>
      );
    }
    return null;
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Manage Base Rates</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <div>
          <label className="block font-medium text-gray-700">Month</label>
          <input
            type="text"
            name="month"
            value={form.month}
            onChange={handleInputChange}
            placeholder="e.g. Magh 2081"
            className="w-full border px-3 py-2 rounded bg-white"
            required
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Rate (%)</label>
          <input
            type="number"
            name="rate"
            value={form.rate}
            onChange={handleInputChange}
            step="0.01"
            placeholder="e.g. 12.73"
            className="w-full border px-3 py-2 rounded bg-white"
            required
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-green-700 text-white px-5 py-2 rounded hover:bg-green-800"
          >
            {editingId ? "Update" : "Add"} Base Rate
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
          placeholder="Search months..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded bg-white"
        />
      </div>

      {/* Rate List */}
      <ul className="divide-y">
        {paginatedRates.map((r, index) => (
          <React.Fragment key={r.id}>
            <li className="flex justify-between items-center py-2">
              <span>{r.month}</span>
              <span>{r.rate}%</span>
              <div className="flex gap-2">
                <button
                  onClick={() => startEditing(r)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
            {renderAverage(index)}
          </React.Fragment>
        ))}
      </ul>

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

export default AdminBaseRates;
