import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://slbbl-website-backend-version1.onrender.com/api/v1";
const IMAGE_BASE = "https://slbbl-website-backend-version1.onrender.com/uploads/";
const ITEMS_PER_PAGE = 6;

const AdminAboutMessages = () => {
  const [messages, setMessages] = useState([]);
  const [form, setForm] = useState({ description: "", imageFile: null });
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/about/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data || []);
    } catch (err) {
      setError("Failed to load messages");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const resetForm = () => {
    setForm({ description: "", imageFile: null });
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description || (!form.imageFile && !editingId)) {
      setError("Please fill out the form.");
      return;
    }

    const formData = new FormData();
    formData.append("description", form.description);
    if (form.imageFile) formData.append("image", form.imageFile);

    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`${API_BASE}/admin/about/messages/${editingId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccess("Message updated successfully.");
      } else {
        await axios.post(`${API_BASE}/admin/about/messages`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccess("Message created successfully.");
      }
      resetForm();
      fetchMessages();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save message.");
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (msg) => {
    setForm({ description: msg.description, imageFile: null });
    setEditingId(msg.id);
    setSuccess("");
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await axios.delete(`${API_BASE}/admin/about/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Message deleted.");
      fetchMessages();
    } catch (err) {
      setError("Delete failed");
    }
  };

  const filteredMessages = messages.filter((m) =>
    m.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredMessages.length / ITEMS_PER_PAGE);
  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Manage CEO Messages</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block font-medium text-gray-700">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            required
            className="w-full border px-3 py-2 rounded bg-white text-green-800"
          ></textarea>
        </div>
        <div>
          <label className="block font-medium text-gray-700">
            Image {editingId && " (upload to change)"}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, imageFile: e.target.files[0] })}
            className="w-full"
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 text-white px-5 py-2 rounded hover:bg-green-800"
          >
            {editingId ? "Update Message" : "Add Message"}
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

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded bg-white"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedMessages.map((msg) => (
          <div key={msg.id} className="border p-4 rounded shadow">
            <p className="text-gray-800 mb-2">{msg.description}</p>
            {msg.image_url && (
              <img
                src={`${IMAGE_BASE}${msg.image_url}`}
                alt="CEO"
                className="w-full h-48 object-cover rounded"
              />
            )}
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => startEditing(msg)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(msg.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

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

export default AdminAboutMessages;
