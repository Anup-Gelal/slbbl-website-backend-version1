import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8080/api/v1";
const IMAGE_BASE = "http://localhost:8080/uploads/about/slides/";
const ITEMS_PER_PAGE = 6;

const AdminAboutSlides = () => {
  const [slides, setSlides] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchSlides = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/about/slides`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSlides(res.data || []);
    } catch (err) {
      setError("Failed to load slides");
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const resetForm = () => {
    setImageFile(null);
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile && !editingId) {
      setError("Please select an image.");
      return;
    }

    const formData = new FormData();
    if (imageFile) formData.append("image", imageFile);

    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`${API_BASE}/admin/about/slides/${editingId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccess("Slide updated successfully.");
      } else {
        await axios.post(`${API_BASE}/admin/about/slides`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccess("Slide added successfully.");
      }
      resetForm();
      fetchSlides();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save slide.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this slide?")) return;
    try {
      await axios.delete(`${API_BASE}/admin/about/slides/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Slide deleted.");
      fetchSlides();
    } catch (err) {
      setError("Delete failed");
    }
  };

  const startEditing = (slide) => {
    setEditingId(slide.id);
    setImageFile(null);
    setSuccess("");
    setError("");
  };

  const filteredSlides = slides.filter((s) =>
    s.image_url.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredSlides.length / ITEMS_PER_PAGE);
  const paginatedSlides = filteredSlides.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Manage About Slides</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block font-medium text-gray-700">
            {editingId ? "Replace Slide Image" : "Slide Image"}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full"
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 text-white px-5 py-2 rounded hover:bg-green-800"
          >
            {editingId ? "Update Slide" : "Add Slide"}
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

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search image filename..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded bg-white"
        />
      </div>

      {/* Slide Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedSlides.map((slide) => (
          <div key={slide.id} className="border p-4 rounded shadow text-center">
            <img
              src={`${IMAGE_BASE}${slide.image_url}`}
              alt="slide"
              className="w-full h-48 object-contain mb-2"
            />
            <div className="flex justify-center gap-2">
              <button
                onClick={() => startEditing(slide)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(slide.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

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

export default AdminAboutSlides;
