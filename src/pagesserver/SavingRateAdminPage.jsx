import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://slbbl-website-backend-version1.onrender.com/api/v1";
const ITEMS_PER_PAGE = 6;

const initialForm = {
  name: "",
  minSaving: "",
  interestRate: "",
  remarks: "",
};

const AdminSavingInterestRates = () => {
  const [rates, setRates] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const token = localStorage.getItem("token");

  // Fetch all rates from server
  const fetchRates = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/saving-interest-rates`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRates(res.data || []);
    } catch (err) {
      setError("Failed to load saving interest rates");
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  // Controlled form input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit add or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Convert minSaving to number or null
    const minSavingParsed = form.minSaving.trim() === "" ? null : parseFloat(form.minSaving);

    // Prepare payload
    const payload = {
      name: form.name.trim(),
      minSaving: minSavingParsed,
      interestRate: form.interestRate.trim() || null,
      remarks: form.remarks.trim() || null,
    };

    try {
      if (editingId) {
        // Update existing
        await axios.put(`${API_BASE}/admin/saving-interest-rates/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Interest rate updated successfully.");
      } else {
        // Create new
        await axios.post(`${API_BASE}/admin/saving-interest-rates`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Interest rate added successfully.");
      }
      resetForm();
      fetchRates();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save interest rate");
    }
  };

  // Start editing existing rate
  const startEditing = (r) => {
    setForm({
      name: r.name,
      minSaving: r.minSaving !== null && r.minSaving !== undefined ? r.minSaving.toString() : "",
      interestRate: r.interestRate || "",
      remarks: r.remarks || "",
    });
    setEditingId(r.id);
    setError("");
    setSuccess("");
  };

  // Delete rate
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this rate?")) return;
    try {
      await axios.delete(`${API_BASE}/admin/saving-interest-rates/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Interest rate deleted successfully.");
      fetchRates();
    } catch (err) {
      setError("Failed to delete interest rate");
    }
  };

  // Filter rates by search query (case-insensitive)
  const filteredRates = rates.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredRates.length / ITEMS_PER_PAGE);
  const paginatedRates = filteredRates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Manage Saving Interest Rates</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      {/* Form for Add/Edit */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="block font-medium text-gray-700">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleInputChange}
            required
            className="w-full border px-3 py-2 rounded bg-white"
            placeholder="Account name"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Minimum Saving (optional)</label>
          <input
            name="minSaving"
            value={form.minSaving}
            onChange={handleInputChange}
            type="number"
            step="0.01"
            min="0"
            className="w-full border px-3 py-2 rounded bg-white"
            placeholder="Minimum saving amount"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Interest Rate (optional)</label>
          <input
            name="interestRate"
            value={form.interestRate}
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded bg-white"
            placeholder="e.g. 7.5%, 9 Years - 1.5, etc."
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Remarks (optional)</label>
          <textarea
            name="remarks"
            value={form.remarks}
            onChange={handleInputChange}
            rows={3}
            className="w-full border px-3 py-2 rounded bg-white"
            placeholder="Additional remarks"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800"
          >
            {editingId ? "Update" : "Add"} Interest Rate
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Search input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by account name..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded bg-white"
        />
      </div>

      {/* List table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-green-700 text-white">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
            <th className="border border-gray-300 px-4 py-2 text-right">Min Saving</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Interest Rate</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Remarks</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRates.map((r) => (
            <tr key={r.id} className="hover:bg-green-50">
              <td className="border border-gray-300 px-4 py-2">{r.name}</td>
              <td className="border border-gray-300 px-4 py-2 text-right">
                {r.minSaving !== null && r.minSaving !== undefined ? r.minSaving.toFixed(2) : "-"}
              </td>
              <td className="border border-gray-300 px-4 py-2">{r.interestRate || "-"}</td>
              <td className="border border-gray-300 px-4 py-2">{r.remarks || "-"}</td>
              <td className="border border-gray-300 px-4 py-2 text-center space-x-2">
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
              </td>
            </tr>
          ))}
          {paginatedRates.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                No matching records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

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

export default AdminSavingInterestRates;
