import React, { useState, useEffect } from "react";
import axios from "axios";
import { SectionWrapper } from "../hoc";

const API_BASE = "https://slbbl-website-backend-version1.onrender.com/api/v1";

const Modal = ({ staff, onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
      >
        ✕
      </button>
      <img
        src={`https://slbbl-website-backend-version1.onrender.com/${staff.image}`}
        alt={staff.name}
        className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
      />
      <h2 className="text-xl font-bold text-center text-green-700 mb-2">{staff.name}</h2>
      <p className="text-center text-green-700 mb-1">{staff.designation}</p>
      <p className="text-center text-green-700 mb-4">{staff.department}</p>
      <p className="text-green-700 leading-relaxed">
        {staff.bio || "No additional bio available."}
      </p>
      {staff.email && (
        <p className="mt-4 text-center">
          <a href={`mailto:${staff.email}`} className="text-blue-600 hover:underline">
            {staff.email}
          </a>
        </p>
      )}
    </div>
  </div>
);

const HeadOfficeStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [filter, setFilter] = useState("");
  const [modalStaff, setModalStaff] = useState(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get(`${API_BASE}/head-office-staff`);
        setStaffList(response.data || []);
      } catch (err) {
        console.error("Failed to fetch staff:", err);
      }
    };

    fetchStaff();
  }, []);

  const filtered = staffList.filter(
    (s) =>
      s.name.toLowerCase().includes(filter.toLowerCase()) ||
      s.designation.toLowerCase().includes(filter.toLowerCase())
  );

  const departments = [...new Set(filtered.map((s) => s.department))];

  return (
    <>
      <div className="py-10 px-4 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-green-800 mb-6">
          Head Office Staff
        </h1>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by name or designation..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-green-900 placeholder-green-500"
          />
        </div>

        {departments.map((dept) => (
          <section key={dept} className="mb-12">
            <h2 className="text-2xl font-semibold text-green-800 mb-4">{dept}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filtered
                .filter((s) => s.department === dept)
                .map((staff) => (
                  <div
                    key={staff.id}
                    onClick={() => setModalStaff(staff)}
                    className="cursor-pointer bg-white/10 backdrop-blur-md border border-green-800 p-5 rounded-2xl shadow-lg flex flex-col items-center text-center hover:bg-white/20 transition"
                  >
                    {staff.image && (
                      <img
                        src={`https://slbbl-website-backend-version1.onrender.com/${staff.image}`}
                        alt={staff.name}
                        className="w-20 h-20 rounded-full object-cover mb-3"
                      />
                    )}
                    <h3 className="text-lg font-bold text-green-800">{staff.name}</h3>
                    <p className="text-sm text-green-700">{staff.designation}</p>
                  </div>
                ))}
            </div>
          </section>
        ))}
      </div>

      {modalStaff && <Modal staff={modalStaff} onClose={() => setModalStaff(null)} />}
    </>
  );
};

export default SectionWrapper(HeadOfficeStaff, "headofficestaff");
