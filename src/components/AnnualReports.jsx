import React, { useState, useEffect } from "react";
import { SectionWrapper } from "../hoc";
import axios from "axios";

const API_BASE = "https://slbbl-website-backend-version1.onrender.com/api/v1"; // Backend API
const FILE_BASE = "https://slbbl-website-backend-version1.onrender.com"; // File server

const AnnualReportCard = ({ reportName, fileLink }) => {
  const fileUrl = `${FILE_BASE}${fileLink}`;

  return (
    <div className="w-full sm:w-[360px] bg-gradient-to-r from-blue-700 via-gray-600 to-blue-300 p-6 rounded-lg shadow-lg transition-all hover:shadow-xl">
      <h3 className="text-xl font-semibold text-white mb-2">{reportName}</h3>
      <div className="flex flex-col gap-2">
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-green-200 font-medium"
        >
          🔍 View PDF
        </a>
        <a
          href={fileUrl}
          download
          className="text-white hover:text-yellow-200 font-medium"
        >
          ⬇️ Download PDF
        </a>
      </div>
    </div>
  );
};

const AnnualReports = () => {
  const [reports, setReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchYear, setSearchYear] = useState("");
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(`${API_BASE}/annual-reports`);
        setReports(res.data || []);
      } catch (error) {
        console.error("Failed to fetch annual reports", error);
      }
    };

    fetchReports();
  }, []);

  const filteredReports = reports.filter((report) =>
    searchYear ? report.reportName.includes(searchYear) : true
  );

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const currentReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen mt-20">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
        Annual Reports
      </h2>

      <p className="text-lg text-gray-800 text-center max-w-2xl mx-auto mb-8">
        Browse through our latest Annual Reports published each year.
      </p>

      {/* Search Filters */}
      <div className="flex justify-center gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700">Year</label>
          <input
            type="text"
            value={searchYear}
            onChange={(e) => {
              setSearchYear(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="e.g. 2080"
            className="mt-1 p-2 bg-blue-100 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* Report Cards */}
      <div className="flex flex-wrap gap-8 justify-center">
        {currentReports.length > 0 ? (
          currentReports.map((report) => (
            <AnnualReportCard
              key={report.id}
              reportName={report.reportName}
              fileLink={report.fileLink}
            />
          ))
        ) : (
          <p className="text-center text-gray-700">No reports found for selected year.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10 gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-700 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-700 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SectionWrapper(AnnualReports, "annual-reports");
