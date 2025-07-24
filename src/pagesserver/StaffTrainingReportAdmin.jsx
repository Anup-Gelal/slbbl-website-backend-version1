import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8080/api/v1";
const ITEMS_PER_PAGE = 6;

const initialForm = {
  reportName: "",
  file: null,
};

const AdminStaffTrainingReports = () => {
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const token = localStorage.getItem("token");

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/staff-training-reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(res.data || []);
    } catch {
      setError("Failed to load reports.");
    }
  };

  useEffect(() => {
    fetchReports();
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

    if (!form.reportName || (!form.file && !editingId)) {
      setError("Please provide a name and select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("reportName", form.reportName);
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
          `${API_BASE}/admin/staff-training-reports/${editingId}`,
          formData,
          config
        );
        setSuccess("Report updated.");
      } else {
        await axios.post(
          `${API_BASE}/admin/staff-training-reports`,
          formData,
          config
        );
        setSuccess("Report added.");
      }
      resetForm();
      fetchReports();
    } catch (err) {
      setError(err.response?.data?.error || "Save failed.");
    }
  };

  const startEditing = (r) => {
    setForm({ reportName: r.reportName, file: null });
    setEditingId(r.id);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this report?")) return;
    try {
      await axios.delete(`${API_BASE}/admin/staff-training-reports/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Deleted.");
      fetchReports();
    } catch {
      setError("Delete failed.");
    }
  };

  const filtered = reports.filter((r) =>
    r.reportName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const displayed = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">
        Manage Staff Training Reports
      </h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 mb-8"
        encType="multipart/form-data"
      >
        <div>
          <label className="block font-medium text-gray-700">Report Name</label>
          <input
            name="reportName"
            value={form.reportName}
            onChange={handleInputChange}
            required
            className="w-full border px-3 py-2 rounded bg-white"
            placeholder="Staff Training Report ..."
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Upload PDF File</label>
          <input
            name="file"
            type="file"
            accept=".pdf"
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded"
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
            className="bg-indigo-700 text-white px-6 py-2 rounded hover:bg-indigo-800"
          >
            {editingId ? "Update" : "Add"} Report
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

      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search by name..."
          className="w-full px-4 py-2 border rounded bg-white"
        />
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-indigo-700 text-white">
          <tr>
            <th className="border px-4 py-2 text-left">Name</th>
            <th className="border px-4 py-2">Link</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayed.map((r) => (
            <tr key={r.id} className="hover:bg-indigo-50">
              <td className="border px-4 py-2">{r.reportName}</td>
              <td className="border px-4 py-2 text-center">
                <a
                  href={r.fileLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View
                </a>
              </td>
              <td className="border px-4 py-2 text-center space-x-2">
                <button
                  onClick={() => startEditing(r)}
                  className="text-indigo-600 hover:underline"
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
          {!displayed.length && (
            <tr>
              <td colSpan="3" className="text-center py-4 text-gray-500">
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded border ${
                currentPage === i + 1
                  ? "bg-indigo-700 text-white"
                  : "bg-white text-indigo-700 border-indigo-700"
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

export default AdminStaffTrainingReports;
