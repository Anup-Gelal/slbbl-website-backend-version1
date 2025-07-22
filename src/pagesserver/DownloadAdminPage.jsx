import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8080/api/v1";
const ITEMS_PER_PAGE = 6;

const initialForm = { title: "", file: null };

const AdminDownloads = () => {
  const [downloads, setDownloads] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const token = localStorage.getItem("token");

  const fetchDownloads = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/footer-downloads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDownloads(res.data || []);
    } catch {
      setError("Failed to load downloads.");
    }
  };

  useEffect(() => {
    fetchDownloads();
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

    if (!form.title || (!form.file && !editingId)) {
      setError("Please provide a title and select a file.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", form.title);
    if (form.file) formData.append("file", form.file);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };
      if (editingId) {
        await axios.put(`${API_BASE}/admin/footer-downloads/${editingId}`, formData, config);
        setSuccess("Download updated.");
      } else {
        await axios.post(`${API_BASE}/admin/footer-downloads`, formData, config);
        setSuccess("Download added.");
      }
      resetForm();
      fetchDownloads();
    } catch {
      setError("Save failed.");
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (item) => {
    setForm({ title: item.title, file: null });
    setEditingId(item.id);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this download?")) return;
    try {
      await axios.delete(`${API_BASE}/admin/footer-downloads/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Deleted.");
      fetchDownloads();
    } catch {
      setError("Delete failed.");
    }
  };

  const filtered = downloads.filter((d) =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const displayed = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">Manage Downloads</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 mb-8"
        encType="multipart/form-data"
      >
        <div>
          <label className="block font-medium text-gray-700">Document Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleInputChange}
            required
            className="w-full border px-3 py-2 rounded bg-white"
            placeholder="Document Title"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Upload File</label>
          <input
            name="file"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded"
            required={!editingId}
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
            disabled={loading}
            className="bg-indigo-700 text-white px-6 py-2 rounded hover:bg-indigo-800"
          >
            {editingId ? "Update" : "Add"} Download
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

      <input
        type="text"
        placeholder="Search by title..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setCurrentPage(1);
        }}
        className="mb-4 w-full border px-3 py-2 rounded bg-white"
      />

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-indigo-700 text-white">
          <tr>
            <th className="border px-4 py-2 text-left">Title</th>
            <th className="border px-4 py-2 text-center">File</th>
            <th className="border px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayed.map((d) => (
            <tr key={d.id} className="hover:bg-indigo-50">
              <td className="border px-4 py-2">{d.title}</td>
              <td className="border px-4 py-2 text-center">
                <a
                  href={d.filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View
                </a>
              </td>
              <td className="border px-4 py-2 text-center space-x-2">
                <button
                  onClick={() => startEditing(d)}
                  className="text-indigo-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(d.id)}
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

export default AdminDownloads;
