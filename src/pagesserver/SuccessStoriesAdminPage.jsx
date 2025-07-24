import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://slbbl-website-backend-version1.onrender.com/api/v1";
const FILE_BASE = API_BASE.replace(/\/api\/v1\/?$/, '');

const ITEMS_PER_PAGE = 6;

const initialForm = {
  title: "",
  description: "",
  fullDescription: "",
  images: [], // New uploads (FileList)
  existingImages: [], // URLs from backend for editing
};

const AdminSuccessStories = () => {
  const [stories, setStories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const token = localStorage.getItem("token");

  const fetchStories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/success-stories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStories(res.data || []);
    } catch (err) {
      setError("Failed to fetch stories");
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const handleInputChange = e => {
    const { name, value, files } = e.target;
    if (name === "images") {
      // New uploads
      setForm(prev => ({ ...prev, images: files }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!form.title || !form.description || !form.fullDescription) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("fullDescription", form.fullDescription);

    // Append new images if any
    Array.from(form.images).forEach(file => {
      formData.append("images", file);
    });

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };
      if (editingId) {
        await axios.put(`${API_BASE}/admin/success-stories/${editingId}`, formData, config);
        setSuccess("Story updated successfully.");
      } else {
        await axios.post(`${API_BASE}/admin/success-stories`, formData, config);
        setSuccess("Story created successfully.");
      }
      resetForm();
      fetchStories();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save story");
    } finally {
      setLoading(false);
    }
  };

  const startEditing = story => {
    setEditingId(story.id);
    setForm({
      title: story.title,
      description: story.description,
      fullDescription: story.full_description || story.fullDescription || "",
      images: [], // new uploads
      existingImages: story.images || [], // existing URLs for preview
    });
    setError("");
    setSuccess("");
  };

  const handleDelete = async id => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;
    try {
      await axios.delete(`${API_BASE}/admin/success-stories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Deleted successfully.");
      fetchStories();
    } catch {
      setError("Failed to delete story");
    }
  };

  const filtered = stories.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        {editingId ? "Edit Story" : "Add New Story"}
      </h2>

      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4 mb-8">
        <input
          name="title"
          value={form.title}
          onChange={handleInputChange}
          placeholder="Title"
          required
          className="w-full border px-3 py-2 rounded bg-white"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleInputChange}
          placeholder="Short description"
          required
          className="w-full border px-3 py-2 rounded bg-white"
        />
        <textarea
          name="fullDescription"
          value={form.fullDescription}
          onChange={handleInputChange}
          placeholder="Full description"
          required
          className="w-full border px-3 py-2 rounded bg-white"
        />
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          onChange={handleInputChange}
          className="w-full"
        />

        {form.existingImages && form.existingImages.length > 0 && (
          <div className="mt-4">
            <p className="font-semibold mb-2">Existing Images:</p>
            <div className="flex gap-2 overflow-x-auto">
              {form.existingImages.map((img, idx) => (
                <img
                  key={idx}
                  src={`${FILE_BASE}${img}`}
                  alt={`existing-img-${idx}`}
                  className="h-20 rounded object-cover"
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800"
          >
            {editingId ? "Update" : "Create"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-6 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search stories..."
          value={searchQuery}
          onChange={e => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full border px-3 py-2 rounded bg-white"
        />
      </div>

      <div className="space-y-4">
        {paginated.map(s => (
          <div key={s.id} className="border p-4 rounded shadow">
            <h3 className="font-semibold text-lg">{s.title}</h3>
            <p className="text-gray-700">{s.description}</p>
            <div className="flex gap-2 overflow-x-auto mt-2">
              {(s.images && s.images.length > 0) ? (
                s.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={`${FILE_BASE}${img}`}
                    alt={`img-${idx}`}
                    className="h-20 rounded object-cover"
                  />
                ))
              ) : (
                <span className="text-gray-500 italic">No images</span>
              )}
            </div>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => startEditing(s)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
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

export default AdminSuccessStories;
