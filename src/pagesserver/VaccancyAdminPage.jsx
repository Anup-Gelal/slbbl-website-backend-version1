import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8080/api/v1";
const ITEMS_PER_PAGE = 6;

const initialForm = {
  vacancyDate: "",
  postedDate: "",
  expiryDate: "",
  file: null,
};

const AdminVacancies = () => {
  const [vacancies, setVacancies] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchVacancies();
  }, []);

  const fetchVacancies = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/vacancies`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVacancies(res.data || []);
    } catch {
      setError("Failed to load vacancies.");
    }
  };

  const resetForm = () => {
    setForm(initialForm);
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

    if (!form.vacancyDate || !form.postedDate || !form.expiryDate || !form.file) {
      setError("All fields are required including the PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("vacancy_date", form.vacancyDate);
    formData.append("posted_date", form.postedDate);
    formData.append("expiry_date", form.expiryDate);
    formData.append("file", form.file);

    try {
      await axios.post(`${API_BASE}/admin/vacancies`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess("Vacancy added.");
      resetForm();
      fetchVacancies();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save vacancy.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this vacancy?")) return;
    try {
      await axios.delete(`${API_BASE}/admin/vacancies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Vacancy deleted.");
      fetchVacancies();
    } catch {
      setError("Failed to delete vacancy.");
    }
  };

  const filtered = vacancies.filter((v) =>
    v.vacancy_date.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const displayed = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-green-800 mb-4">
        Manage Vacancies
      </h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium text-gray-700">Vacancy Date (B.S)</label>
            <input
              name="vacancyDate"
              value={form.vacancyDate}
              onChange={handleInputChange}
              required
              placeholder="2081.04.25"
              className="w-full border px-3 py-2 rounded bg-white"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Posted Date (A.D)</label>
            <input
              name="postedDate"
              value={form.postedDate}
              onChange={handleInputChange}
              required
              placeholder="August 9, 2024"
              className="w-full border px-3 py-2 rounded bg-white"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Expiry Date</label>
            <input
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleInputChange}
              required
              placeholder="August 25, 2024"
              className="w-full border px-3 py-2 rounded bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium text-gray-700">Upload PDF</label>
          <input
            type="file"
            accept=".pdf"
            name="file"
            onChange={handleInputChange}
            required
            className="w-full border px-3 py-2 rounded bg-white"
          />
        </div>

        <button
          type="submit"
          className="bg-green-800 text-white px-6 py-2 rounded hover:bg-green-900"
        >
          Add Vacancy
        </button>
      </form>

      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search by vacancy date..."
          className="w-full px-4 py-2 border rounded bg-white"
        />
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-green-700 text-white">
          <tr>
            <th className="border px-4 py-2 text-left">Vacancy Date</th>
            <th className="border px-4 py-2">Posted</th>
            <th className="border px-4 py-2">Expiry</th>
            <th className="border px-4 py-2">Link</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayed.map((v) => (
            <tr key={v.id} className="hover:bg-green-50">
              <td className="border px-4 py-2">{v.vacancy_date}</td>
              <td className="border px-4 py-2">{v.posted_date}</td>
              <td className="border px-4 py-2">{v.expiry_date}</td>
              <td className="border px-4 py-2 text-center">
                <a
                  href={v.file_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View
                </a>
              </td>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={() => handleDelete(v.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {!displayed.length && (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                No vacancies found.
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
                  ? "bg-green-800 text-white"
                  : "bg-white text-green-800 border-green-700"
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

export default AdminVacancies;
