import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8080/api/v1/admin";
const FILE_BASE = "http://localhost:8080"; // Base URL for images
const ITEMS_PER_PAGE = 6;

// Helper to build correct image URL avoiding duplicated paths
const getImageUrl = (imgPath) => {
  if (!imgPath) return "";
  let path = imgPath.trim();

  // Remove duplicated "/uploads/galleries/uploads/galleries/" prefix if present
  const duplicatePrefix = "/uploads/galleries/uploads/galleries/";
  if (path.toLowerCase().startsWith(duplicatePrefix)) {
    path = path.substring("/uploads/galleries".length);
  }

  // Ensure leading slash
  if (!path.startsWith("/")) {
    path = "/" + path;
  }

  return `${FILE_BASE}${path}`;
};

const initialForm = {
  title: "",
  date: "",
  images: [],
};

const AdminGalleries = () => {
  const [galleries, setGalleries] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const token = localStorage.getItem("token");

  const fetchGalleries = async () => {
    try {
      const res = await axios.get(`${API_BASE}/galleries`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGalleries(res.data || []);
    } catch {
      setError("Failed to fetch galleries");
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setForm((prev) => ({ ...prev, images: files }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!form.title || !form.date) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      if (editingId) {
        // Update gallery metadata only, images not updated here
        await axios.put(
          `${API_BASE}/galleries/${editingId}`,
          { title: form.title, date: form.date },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess("Gallery updated successfully.");
      } else {
        if (form.images.length === 0) {
          setError("Please upload at least one image");
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("date", form.date);
        Array.from(form.images).forEach((file) =>
          formData.append("images", file)
        );

        await axios.post(`${API_BASE}/galleries/upload`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        setSuccess("Gallery created successfully.");
      }

      resetForm();
      fetchGalleries();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save gallery");
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (gallery) => {
    setEditingId(gallery.id);
    setForm({
      title: gallery.title,
      date: gallery.date,
      images: [],
    });
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this gallery?")) return;
    try {
      await axios.delete(`${API_BASE}/galleries/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Deleted successfully.");
      fetchGalleries();
    } catch {
      setError("Failed to delete gallery");
    }
  };

  // Filter and paginate galleries
  const filtered = galleries.filter((g) =>
    g.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        {editingId ? "Edit Gallery" : "Add New Gallery"}
      </h2>

      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="space-y-4 mb-8"
      >
        <input
          name="title"
          value={form.title}
          onChange={handleInputChange}
          placeholder="Title"
          required
          className="w-full border px-3 py-2 rounded bg-white"
        />
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleInputChange}
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

        <div className="flex gap-4">
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

      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search galleries..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full border px-3 py-2 rounded bg-white"
        />
      </div>

      {/* Gallery cards */}
      <div className="space-y-4">
        {paginated.map((gallery) => (
          <div key={gallery.id} className="border p-4 rounded shadow">
            <h3 className="font-semibold text-lg">{gallery.title}</h3>
            <p className="text-gray-700">{gallery.date}</p>
            <div className="flex gap-2 overflow-x-auto mt-2">
              {gallery.imagePaths?.map((img, idx) => (
                <img
                  key={idx}
                  src={getImageUrl(img)}
                  alt={`gallery-${idx}`}
                  className="h-20 rounded object-cover"
                />
              ))}
              {!gallery.imagePaths?.length && (
                <span className="text-gray-500 italic">No images available</span>
              )}
            </div>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => startEditing(gallery)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(gallery.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {paginated.length === 0 && (
          <p className="text-center text-gray-500">No galleries found.</p>
        )}
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

export default AdminGalleries;
