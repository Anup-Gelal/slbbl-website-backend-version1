import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8080/api/v1";
const ITEMS_PER_PAGE = 6;

const initialForm = {
  disclosureName: "",
  file: null,
};

const AdminSebonDisclosures = () => {
  const [disclosures, setDisclosures] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const token = localStorage.getItem("token");

  const fetchDisclosures = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/sebon-disclosures`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDisclosures(res.data || []);
    } catch {
      setError("Failed to load disclosures.");
    }
  };

  useEffect(() => {
    fetchDisclosures();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setForm((prev) => ({ ...prev, file: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.disclosureName || (!form.file && !editingId)) {
      setError("Disclosure name and file are required.");
      return;
    }

    const formData = new FormData();
    formData.append("disclosureName", form.disclosureName);
    if (form.file) formData.append("file", form.file);

    try {
      if (editingId) {
        await axios.put(`${API_BASE}/admin/sebon-disclosures/${editingId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccess("Disclosure updated successfully.");
      } else {
        await axios.post(`${API_BASE}/admin/sebon-disclosures`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccess("Disclosure added successfully.");
      }
      resetForm();
      fetchDisclosures();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save disclosure.");
    }
  };

  const startEditing = (d) => {
    setForm({
      disclosureName: d.disclosureName,
      file: null,
    });
    setEditingId(d.id);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this disclosure?")) return;
    try {
      await axios.delete(`${API_BASE}/admin/sebon-disclosures/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Disclosure deleted successfully.");
      fetchDisclosures();
    } catch {
      setError("Failed to delete disclosure.");
    }
  };

  const filteredDisclosures = disclosures.filter((d) =>
    d.disclosureName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDisclosures.length / ITEMS_PER_PAGE);
  const paginatedDisclosures = filteredDisclosures.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Manage SEBON Disclosures</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8" encType="multipart/form-data">
        <div>
          <label className="block font-medium text-gray-700">Disclosure Name</label>
          <input
            name="disclosureName"
            value={form.disclosureName}
            onChange={handleInputChange}
            required
            className="w-full border px-3 py-2 rounded bg-white"
            placeholder="e.g. Annual Compliance Report – FY 2079/080"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Upload PDF File</label>
          <input
            name="file"
            type="file"
            accept=".pdf"
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded bg-white"
          />
          {editingId && <p className="text-gray-500 text-sm mt-1">Leave blank to keep existing file.</p>}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800"
          >
            {editingId ? "Update" : "Add"} Disclosure
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
          placeholder="Search by disclosure name..."
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
            <th className="border border-gray-300 px-4 py-2 text-left">Disclosure Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Link</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedDisclosures.map((d) => (
            <tr key={d.id} className="hover:bg-green-50">
              <td className="border border-gray-300 px-4 py-2">{d.disclosureName}</td>
              <td className="border border-gray-300 px-4 py-2">
                <a href={d.fileLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  View PDF
                </a>
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center space-x-2">
                <button onClick={() => startEditing(d)} className="text-blue-600 hover:underline">Edit</button>
                <button onClick={() => handleDelete(d.id)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
          {paginatedDisclosures.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center py-4 text-gray-500">No matching records found.</td>
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

export default AdminSebonDisclosures;
