import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8080/api/v1";

const initialForm = {
  name: "",
  designation: "",
  department: "",
  email: "",
  phone: "",
  imageFile: null,
};

const HeadOfficeStaffAdminPage = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/admin/head-office-staff`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaffList(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load head office staff");
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
    if (name === "imageFile") {
      setForm((f) => ({ ...f, imageFile: files[0] }));
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
    formData.append("name", form.name);
    formData.append("designation", form.designation);
    formData.append("department", form.department);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    if (form.imageFile) {
      formData.append("image", form.imageFile);
    }

    try {
      if (editingId) {
        await axios.put(`${API_BASE}/admin/head-office-staff/${editingId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccess("Staff updated successfully.");
      } else {
        await axios.post(`${API_BASE}/admin/head-office-staff`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccess("Staff added successfully.");
      }
      resetForm();
      fetchStaff();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) return;
    setLoading(true);
    setError("");
    try {
      await axios.delete(`${API_BASE}/admin/head-office-staff/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Staff deleted successfully.");
      if (editingId === id) resetForm();
      fetchStaff();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete staff member");
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (staff) => {
    setForm({
      name: staff.name,
      designation: staff.designation,
      department: staff.department,
      email: staff.email,
      phone: staff.phone,
      imageFile: null,
    });
    setEditingId(staff.id);
    setError("");
    setSuccess("");
  };

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  const filteredStaff = staffList
    .filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField]?.toLowerCase?.() || "";
      const bValue = b[sortField]?.toLowerCase?.() || "";
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  const currentData = filteredStaff.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h1 className="text-3xl font-bold mb-6 text-green-700">Manage Head Office Staff</h1>

      {error && <p className="text-red-600 mb-4 font-medium">{error}</p>}
      {success && <p className="text-green-600 mb-4 font-medium">{success}</p>}

      <form onSubmit={handleSubmit} className="mb-10 space-y-4">
        <div>
          <label className="block text-green-800 font-semibold mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
          />
        </div>

        <div>
          <label className="block text-green-800 font-semibold mb-1">Designation</label>
          <input
            type="text"
            name="designation"
            value={form.designation}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
          />
        </div>

        <div>
          <label className="block text-green-800 font-semibold mb-1">Department</label>
          <input
            type="text"
            name="department"
            value={form.department}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
          />
        </div>

        <div>
          <label className="block text-green-800 font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
          />
        </div>

        <div>
          <label className="block text-green-800 font-semibold mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
          />
        </div>

        <div>
          <label className="block text-green-800 font-semibold mb-1">
            Image {editingId ? "(upload only to change)" : ""}
          </label>
          <input
            type="file"
            name="imageFile"
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
            {loading ? "Saving..." : editingId ? "Update Staff" : "Add Staff"}
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
          placeholder="Search by name, designation, department, email or phone..."
          className="px-4 py-2 border border-gray-300 rounded bg-white w-full max-w-xl"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading && <p className="text-center">Loading...</p>}

      {!loading && currentData.length === 0 && (
        <p className="text-center text-gray-500">No staff members found.</p>
      )}

      {currentData.length > 0 && (
        <div>
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-green-100 text-green-800">
                <th
                  onClick={() => handleSort("name")}
                  className="cursor-pointer border border-gray-300 px-3 py-2"
                >
                  Name
                </th>
                <th
                  onClick={() => handleSort("designation")}
                  className="cursor-pointer border border-gray-300 px-3 py-2"
                >
                  Designation
                </th>
                <th
                  onClick={() => handleSort("department")}
                  className="cursor-pointer border border-gray-300 px-3 py-2"
                >
                  Department
                </th>
                <th
                  onClick={() => handleSort("email")}
                  className="cursor-pointer border border-gray-300 px-3 py-2"
                >
                  Email
                </th>
                <th
                  onClick={() => handleSort("phone")}
                  className="cursor-pointer border border-gray-300 px-3 py-2"
                >
                  Phone
                </th>
                <th className="border border-gray-300 px-3 py-2">Image</th>
                <th className="border border-gray-300 px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((staff) => (
                <tr key={staff.id} className="hover:bg-green-50">
                  <td className="border border-gray-300 px-3 py-2">{staff.name}</td>
                  <td className="border border-gray-300 px-3 py-2">{staff.designation}</td>
                  <td className="border border-gray-300 px-3 py-2">{staff.department}</td>
                  <td className="border border-gray-300 px-3 py-2">{staff.email}</td>
                  <td className="border border-gray-300 px-3 py-2">{staff.phone}</td>
                  <td className="border border-gray-300 px-3 py-2">
                    {staff.image ? (
                      <img
                        src={`http://localhost:8080/${staff.image}`}
                        alt={staff.name}
                        className="w-16 h-16 object-contain rounded"
                      />
                    ) : (
                      <span className="text-sm text-gray-500">No Image</span>
                    )}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 space-x-2">
                    <button
                      onClick={() => startEditing(staff)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(staff.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
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

export default HeadOfficeStaffAdminPage;
