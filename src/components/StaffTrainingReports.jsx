import React, { useEffect, useState } from "react";
import axios from "axios";
import { SectionWrapper } from "../hoc";

const API_BASE = "https://slbbl-website-backend-version1.onrender.com/api/v1";
const ITEMS_PER_PAGE = 5;

const TrainingReportCard = ({ reportName, fileLink }) => (
  <div className="w-full sm:w-[360px] bg-gradient-to-r from-green-400 via-yellow-300 to-yellow-400 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all">
    <h3 className="text-xl font-semibold text-white mb-2">{reportName}</h3>
    <a
      href={fileLink}
      target="_blank"
      rel="noopener noreferrer"
      className="text-white hover:text-indigo-200 font-medium"
    >
      Click to View Details
    </a>
  </div>
);

const StaffTrainingReports = () => {
  const [reports, setReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${API_BASE}/staff-training-reports`)
      .then((res) => setReports(res.data || []))
      .catch(() => setError("Failed to fetch training reports."));
  }, []);

  const totalPages = Math.ceil(reports.length / ITEMS_PER_PAGE);
  const displayed = reports.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen mt-20">
      <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
        Staff Training Reports
      </h2>
      <p className="text-lg text-gray-800 text-center max-w-2xl mx-auto mb-8">
        Browse through our Staff Training Reports.
      </p>

      {error && <p className="text-red-600 text-center">{error}</p>}

      <div className="flex flex-wrap gap-8 justify-center">
        {displayed.map((r) => (
          <TrainingReportCard
            key={r.id}
            reportName={r.report_name || r.reportName}
            fileLink={r.file_link || r.fileLink}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-green-700 text-white rounded-l-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-lg text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-green-700 text-white rounded-r-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SectionWrapper(StaffTrainingReports, "staff-training-reports");
