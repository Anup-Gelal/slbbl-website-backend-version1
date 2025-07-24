import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8080/api/v1";

const provinces = [
  "Koshi",
  "Madhesh",
  "Bagmati",
  "Lumbini",
  "Gandaki",
  "Karnali",
  "Sudurpashchim",
];

const initialForm = {
  province: "",
  name: "",
  address: "",
  manager: "",
  contact: "",
  email: "",
};

const BranchesAdminPage = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/admin/branches`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBranches(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err) {
      setError("Failed to load branches");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (editingId) {
        await axios.put(`${API_BASE}/admin/branches/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Branch updated successfully.");
      } else {
        await axios.post(`${API_BASE}/admin/branches`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Branch added successfully.");
      }
      resetForm();
      fetchBranches();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save branch");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this branch?")) return;
    setLoading(true);
    setError("");
    try {
      await axios.delete(`${API_BASE}/admin/branches/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Branch deleted successfully.");
      if (editingId === id) resetForm();
      fetchBranches();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete branch");
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (branch) => {
    setForm({
      province: branch.province,
      name: branch.name,
      address: branch.address,
      manager: branch.manager,
      contact: branch.contact,
      email: branch.email,
    });
    setEditingId(branch.id);
    setError("");
    setSuccess("");
  };

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  const filteredBranches = (branches || [])
    .filter(
      (b) =>
        b.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.manager?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.province?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField]?.toLowerCase?.() || "";
      const bValue = b[sortField]?.toLowerCase?.() || "";
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filteredBranches.length / itemsPerPage);
  const currentData = filteredBranches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h1 className="text-3xl font-bold mb-6 text-green-700">Manage Branches</h1>

      {error && <p className="text-red-600 mb-4 font-medium">{error}</p>}
      {success && <p className="text-green-600 mb-4 font-medium">{success}</p>}

      <form onSubmit={handleSubmit} className="mb-10 space-y-4">
        <div>
          <label className="block text-green-800 font-semibold mb-1">Province</label>
          <select
            name="province"
            value={form.province}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
          >
            <option value="" disabled>
              Select province
            </option>
            {provinces.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-green-800 font-semibold mb-1">Branch Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
          />
        </div>
        <div>
          <label className="block text-green-800 font-semibold mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
          />
        </div>
        <div>
          <label className="block text-green-800 font-semibold mb-1">Manager</label>
          <input
            type="text"
            name="manager"
            value={form.manager}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
          />
        </div>
        <div>
          <label className="block text-green-800 font-semibold mb-1">Contact</label>
          <input
            type="text"
            name="contact"
            value={form.contact}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
          />
        </div>
        <div>
          <label className="block text-green-800 font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-6 rounded"
          >
            {loading ? "Saving..." : editingId ? "Update Branch" : "Add Branch"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              disabled={loading}
              className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mb-6 flex items-center justify-between">
        <input
          type="text"
          placeholder="Search by name, manager or province..."
          className="px-4 py-2 border border-gray-300 rounded bg-white w-full max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : currentData.length === 0 ? (
        <p className="text-center text-gray-500">No branches found.</p>
      ) : (
        <div>
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-green-100 text-green-800">
                <th
                  onClick={() => handleSort("province")}
                  className="cursor-pointer border px-3 py-2"
                >
                  Province
                </th>
                <th
                  onClick={() => handleSort("name")}
                  className="cursor-pointer border px-3 py-2"
                >
                  Name
                </th>
                <th
                  onClick={() => handleSort("manager")}
                  className="cursor-pointer border px-3 py-2"
                >
                  Manager
                </th>
                <th className="border px-3 py-2">Address</th>
                <th className="border px-3 py-2">Contact</th>
                <th className="border px-3 py-2">Email</th>
                <th className="border px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((b) => (
                <tr key={b.id} className="hover:bg-green-50">
                  <td className="border px-3 py-2">{b.province}</td>
                  <td className="border px-3 py-2">{b.name}</td>
                  <td className="border px-3 py-2">{b.manager}</td>
                  <td className="border px-3 py-2">{b.address}</td>
                  <td className="border px-3 py-2">{b.contact}</td>
                  <td className="border px-3 py-2">{b.email}</td>
                  <td className="border px-3 py-2 space-x-2">
                    <button
                      onClick={() => startEditing(b)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded border ${
                  currentPage === i + 1
                    ? "bg-green-700 text-white"
                    : "bg-white text-green-800 border-green-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchesAdminPage;
