import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://slbbl-website-backend-version1.onrender.com/api/v1";
const ITEMS_PER_PAGE = 6;

const initialForm = {
  product: "",
  rate: "",
  serviceCharge: "",
  remarks: "",
};

const AdminLoanInterestRates = () => {
  const [rates, setRates] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const token = localStorage.getItem("token");

  const fetchRates = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/loan-interest-rates`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRates(res.data || []);
    } catch {
      setError("Failed to load loan interest rates.");
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const payload = {
      product: form.product.trim(),
      rate: form.rate.trim(),
      serviceCharge: form.serviceCharge.trim(),
      remarks: form.remarks.trim(),
    };

    try {
      if (editingId) {
        await axios.put(`${API_BASE}/admin/loan-interest-rates/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Loan interest rate updated successfully.");
      } else {
        await axios.post(`${API_BASE}/admin/loan-interest-rates`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Loan interest rate added successfully.");
      }
      resetForm();
      fetchRates();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save loan interest rate");
    }
  };

  const startEditing = (r) => {
    setForm({
      product: r.product,
      rate: r.rate,
      serviceCharge: r.serviceCharge || "",
      remarks: r.remarks || "",
    });
    setEditingId(r.id);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this rate?")) return;
    try {
      await axios.delete(`${API_BASE}/admin/loan-interest-rates/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Loan interest rate deleted successfully.");
      fetchRates();
    } catch {
      setError("Failed to delete loan interest rate");
    }
  };

  const filteredRates = rates.filter((r) =>
    r.product.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRates.length / ITEMS_PER_PAGE);
  const paginatedRates = filteredRates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Manage Loan Interest Rates</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="block font-medium text-gray-700">Product</label>
          <input
            name="product"
            value={form.product}
            onChange={handleInputChange}
            required
            className="w-full border px-3 py-2 rounded bg-white"
            placeholder="Loan product name"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Interest Rate</label>
          <input
            name="rate"
            value={form.rate}
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded bg-white"
            placeholder="e.g. 15%"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Service Charge</label>
          <input
            name="serviceCharge"
            value={form.serviceCharge}
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded bg-white"
            placeholder="e.g. 1.5%"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Remarks</label>
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
          <button type="submit" className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800">
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

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by product..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded bg-white"
        />
      </div>

      {/* Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-green-700 text-white">
          <tr>
            <th className="border px-4 py-2 text-left">Product</th>
            <th className="border px-4 py-2 text-left">Interest Rate</th>
            <th className="border px-4 py-2 text-left">Service Charge</th>
            <th className="border px-4 py-2 text-left">Remarks</th>
            <th className="border px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRates.map((r) => (
            <tr key={r.id} className="hover:bg-green-50">
              <td className="border px-4 py-2">{r.product}</td>
              <td className="border px-4 py-2">{r.rate}</td>
              <td className="border px-4 py-2">{r.serviceCharge || "-"}</td>
              <td className="border px-4 py-2">{r.remarks || "-"}</td>
              <td className="border px-4 py-2 text-center space-x-2">
                <button onClick={() => startEditing(r)} className="text-blue-600 hover:underline">
                  Edit
                </button>
                <button onClick={() => handleDelete(r.id)} className="text-red-600 hover:underline">
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {paginatedRates.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">No matching records found.</td>
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

export default AdminLoanInterestRates;
