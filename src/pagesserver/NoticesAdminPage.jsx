import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://slbbl-website-backend-version1.onrender.com/api/v1";
const ITEMS_PER_PAGE = 6;

const initialForm = {
  noticeName: "",
  dateOfIssue: "",
  file: null,
};

const AdminNotices = () => {
  const [notices, setNotices] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const token = localStorage.getItem("token");

  const fetchNotices = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/notices`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotices(res.data || []);
    } catch {
      setError("Failed to load notices.");
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const handleInputChange = e => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setForm(prev => ({ ...prev, file: files[0] }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.noticeName || !form.dateOfIssue || (!form.file && !editingId)) {
      setError("All fields are required (unless file kept during edit).");
      return;
    }

    const formData = new FormData();
    formData.append("noticeName", form.noticeName);
    formData.append("dateOfIssue", form.dateOfIssue);
    if (form.file) formData.append("file", form.file);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };
      if (editingId) {
        await axios.put(
          `${API_BASE}/admin/notices/${editingId}`,
          formData,
          config
        );
        setSuccess("Notice updated successfully.");
      } else {
        await axios.post(
          `${API_BASE}/admin/notices`,
          formData,
          config
        );
        setSuccess("Notice added successfully.");
      }
      resetForm();
      fetchNotices();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save notice.");
    }
  };

  const startEditing = n => {
    setForm({
      noticeName: n.noticeName,
      dateOfIssue: n.dateOfIssue,
      file: null,
    });
    setEditingId(n.id);
    setError("");
    setSuccess("");
  };

  const handleDelete = async id => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;
    try {
      await axios.delete(`${API_BASE}/admin/notices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Notice deleted.");
      fetchNotices();
    } catch {
      setError("Delete failed.");
    }
  };

  const filtered = notices.filter(n =>
    n.noticeName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const displayed = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        Manage Notices
      </h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8" encType="multipart/form-data">
        <div>
          <label className="block font-medium text-gray-700 bg-white">Notice Name</label>
          <input
            name="noticeName"
            value={form.noticeName}
            onChange={handleInputChange}
            required
            className="w-full border px-3 py-2 rounded bg-white"
            placeholder="e.g. Issue Close Notice – FPO 2081‑11‑21"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Date of Issue</label>
          <input
            name="dateOfIssue"
            type="date"
            value={form.dateOfIssue}
            onChange={handleInputChange}
            required
            className="w-full border px-3 py-2 rounded bg-white"
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
          {editingId && (
            <p className="text-gray-500 text-sm mt-1">
              Leave blank to keep existing file.
            </p>
          )}
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800"
          >
            {editingId ? "Update" : "Add"} Notice
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
          placeholder="Search by notice name..."
          value={searchQuery}
          onChange={e => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-4 py-2 border rounded bg-white"
        />
      </div>

      {/* Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-blue-700 text-white">
          <tr>
            <th className="border px-4 py-2 text-left">Name</th>
            <th className="border px-4 py-2 text-left">Issued</th>
            <th className="border px-4 py-2">File</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayed.map(n => (
            <tr key={n.id} className="hover:bg-blue-50">
              <td className="border px-4 py-2">{n.noticeName}</td>
              <td className="border px-4 py-2">{n.dateOfIssue}</td>
              <td className="border px-4 py-2 text-center">
                <a
                  href={n.fileLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View PDF
                </a>
              </td>
              <td className="border px-4 py-2 text-center space-x-2">
                <button onClick={() => startEditing(n)} className="text-blue-600 hover:underline">
                  Edit
                </button>
                <button onClick={() => handleDelete(n.id)} className="text-red-600 hover:underline">
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {displayed.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">
                No records found.
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
                  ? "bg-blue-700 text-white"
                  : "bg-white text-blue-700 border-blue-700"
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

export default AdminNotices;
