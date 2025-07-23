import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://slbbl-website-backend-version1.onrender.com/api/v1";

const initialForm = {
  title: "",
  iconBg: "",
  description: "",
  iconFile: null,
};

const ManagementAdminPage = () => {
  const [managements, setManagements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchManagements();
  }, []);

  const fetchManagements = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/admin/managements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setManagements(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err) {
      setError("Failed to load Management Teams");
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
    const { name, value, files } = e.target;
    if (name === "iconFile") {
      setForm((f) => ({ ...f, iconFile: files[0] }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("icon_bg", form.iconBg);
    formData.append("description", form.description);
    if (form.iconFile) {
      formData.append("icon", form.iconFile);
    }

    try {
      if (editingId) {
        await axios.put(`${API_BASE}/admin/managements/${editingId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccess("Management Team member updated successfully.");
      } else {
        await axios.post(`${API_BASE}/admin/managements`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccess("Management Team member added successfully.");
      }
      resetForm();
      fetchManagements();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Management team member?")) return;
    setLoading(true);
    setError("");
    try {
      await axios.delete(`${API_BASE}/admin/managements/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Management Team member deleted successfully.");
      if (editingId === id) resetForm();
      fetchManagements();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete management team member");
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (member) => {
    setForm({
      title: member.title,
      iconBg: member.iconBg,
      description: member.description,
      iconFile: null,
    });
    setEditingId(member.id);
    setError("");
    setSuccess("");
  };

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  const filteredManagements = (managements || [])
    .filter(
      (m) =>
        m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField]?.toLowerCase?.() || "";
      const bValue = b[sortField]?.toLowerCase?.() || "";
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filteredManagements.length / itemsPerPage);
  const currentData = filteredManagements.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h1 className="text-3xl font-bold mb-6 text-green-700">Manage Management Team</h1>

      {error && <p className="text-red-600 mb-4 font-medium">{error}</p>}
      {success && <p className="text-green-600 mb-4 font-medium">{success}</p>}

      <form onSubmit={handleSubmit} className="mb-10 space-y-4">
        <div>
          <label className="block text-green-800 font-semibold mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
          />
        </div>
        <div>
          <label className="block text-green-800 font-semibold mb-1">Icon Background Color (hex without #)</label>
          <input
            type="text"
            name="iconBg"
            value={form.iconBg}
            onChange={handleInputChange}
            placeholder="e.g. E6DEDD"
            className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
          />
        </div>
        <div>
          <label className="block text-green-800 font-semibold mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleInputChange}
            required
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
          />
        </div>
        <div>
          <label className="block text-green-800 font-semibold mb-1">
            Icon Image {editingId ? "(upload only to change)" : ""}
          </label>
          <input
            type="file"
            name="iconFile"
            accept="image/*"
            onChange={handleInputChange}
            className="w-full"
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-6 rounded"
          >
            {loading ? "Saving..." : editingId ? "Update Member" : "Add Member"}
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
          placeholder="Search by title or description..."
          className="px-4 py-2 border border-gray-300 rounded bg-white w-full max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : currentData.length === 0 ? (
        <p className="text-center text-gray-500">No management team members found.</p>
      ) : (
        <div>
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-green-100 text-green-800">
                <th onClick={() => handleSort("title")} className="cursor-pointer border px-3 py-2">Title</th>
                <th onClick={() => handleSort("description")} className="cursor-pointer border px-3 py-2">Description</th>
                <th className="border px-3 py-2">Icon Bg</th>
                <th className="border px-3 py-2">Icon Preview</th>
                <th className="border px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((m) => (
                <tr key={m.id} className="hover:bg-green-50">
                  <td className="border px-3 py-2">{m.title}</td>
                  <td className="border px-3 py-2">{m.description}</td>
                  <td className="border px-3 py-2">{m.iconBg}</td>
                  <td className="border px-3 py-2">
                    {m.icon ? (
                      <img
                        src={`https://slbbl-website-backend-version1.onrender.com/uploads/${m.icon}`}
                        alt={m.title}
                        className="w-16 h-16 object-contain rounded"
                      />
                    ) : (
                      <span className="text-sm text-gray-500">No Icon</span>
                    )}
                  </td>
                  <td className="border px-3 py-2 space-x-2">
                    <button
                      onClick={() => startEditing(m)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
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
                  currentPage === i + 1 ? "bg-green-700 text-white" : "bg-white text-green-800 border-green-700"
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

export default ManagementAdminPage;
