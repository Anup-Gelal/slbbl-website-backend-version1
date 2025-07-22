import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://slbbl-website-backend-version1.onrender.com/api/v1";
const ITEMS_PER_PAGE = 6;

const initialForm = {
  name: "",
  role: "",
  phone: "",
  email: "",
  image: null,
};

const AdminSpokespersons = () => {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const token = localStorage.getItem("token");

  const fetchSpokespersons = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/footer-spokespersons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setList(res.data || []);
    } catch {
      setError("Failed to load spokespersons.");
    }
  };

  useEffect(() => {
    fetchSpokespersons();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || (!form.image && !editingId)) {
      setError("Please provide a name and select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("role", form.role);
    formData.append("phone", form.phone);
    formData.append("email", form.email);
    if (form.image) formData.append("image", form.image);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };
      if (editingId) {
        await axios.put(
          `${API_BASE}/admin/footer-spokespersons/${editingId}`,
          formData,
          config
        );
        setSuccess("Spokesperson updated.");
      } else {
        await axios.post(`${API_BASE}/admin/footer-spokespersons`, formData, config);
        setSuccess("Spokesperson added.");
      }
      resetForm();
      fetchSpokespersons();
    } catch (err) {
      setError(err.response?.data?.error || "Save failed.");
    }
  };

  const startEditing = (item) => {
    setForm({
      name: item.name || "",
      role: item.role || "",
      phone: item.phone || "",
      email: item.email || "",
      image: null,
    });
    setEditingId(item.id);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this spokesperson?")) return;
    try {
      await axios.delete(`${API_BASE}/admin/footer-spokespersons/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Deleted.");
      fetchSpokespersons();
    } catch {
      setError("Delete failed.");
    }
  };

  const filtered = list.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const displayed = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">Manage Spokespersons</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 mb-8"
        encType="multipart/form-data"
      >
        <div>
          <label className="block font-medium text-gray-700">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleInputChange}
            required
            className="w-full border px-3 py-2 rounded bg-white"
            placeholder="Name"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Role</label>
          <input
            name="role"
            value={form.role}
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded bg-white"
            placeholder="Role"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded bg-white"
            placeholder="Phone"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded bg-white"
            placeholder="Email"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Upload Image</label>
          <input
            name="image"
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded"
          />
          {editingId && (
            <p className="text-gray-500 text-sm mt-1">
              Leave blank to keep existing image.
            </p>
          )}
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-indigo-700 text-white px-6 py-2 rounded hover:bg-indigo-800"
          >
            {editingId ? "Update" : "Add"} Spokesperson
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
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Image</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayed.map((item) => (
            <tr key={item.id} className="hover:bg-indigo-50">
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2">{item.role}</td>
              <td className="border px-4 py-2">{item.phone}</td>
              <td className="border px-4 py-2">{item.email}</td>
              <td className="border px-4 py-2 text-center">
                {item.imagePath && (
                  <img
                    src={item.imagePath}
                    alt={item.name}
                    className="mx-auto w-12 h-12 rounded-full object-cover"
                  />
                )}
              </td>
              <td className="border px-4 py-2 text-center space-x-2">
                <button
                  onClick={() => startEditing(item)}
                  className="text-indigo-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {!displayed.length && (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
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

export default AdminSpokespersons;
