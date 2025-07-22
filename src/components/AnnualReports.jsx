import React, { useState, useEffect } from "react";
import { SectionWrapper } from "../hoc";
import axios from "axios";

const API_BASE = "http://localhost:8080/api/v1";

const AnnualReportCard = ({ reportName, fileLink }) => (
  <div className="w-full sm:w-[360px] bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 p-6 rounded-lg shadow-lg hover:shadow-xl transition">
    <h3 className="text-xl font-semibold text-white mb-2">{reportName}</h3>
    <a
      href={fileLink}
      target="_blank"
      rel="noopener noreferrer"
      className="text-white hover:text-indigo-200 font-medium"
    >
      View Report
    </a>
  </div>
);

const AnnualReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchYear, setSearchYear] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(`${API_BASE}/annual-reports`);
        setReports(res.data || []);
      } catch (err) {
        console.error("Failed to fetch annual reports", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const filtered = reports.filter((r) =>
    searchYear ? r.reportName.includes(searchYear) : true
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const sliced = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen mt-20">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
        Annual Reports
      </h2>
      <p className="text-lg text-gray-800 text-center max-w-2xl mx-auto mb-8">
        Browse through our latest Annual Reports.
      </p>

      {loading ? (
        <p className="text-center mt-10 text-gray-500">Loading...</p>
      ) : (
        <>
          <div className="flex justify-center gap-4 mb-8">
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                Year
              </label>
              <input
                id="year"
                type="text"
                value={searchYear}
                onChange={(e) => {
                  setSearchYear(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="e.g. 2081"
                className="mt-1 p-2 bg-blue-100 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-8 justify-center">
            {sliced.length > 0 ? (
              sliced.map((r, idx) => (
                <AnnualReportCard
                  key={r.id || `${r.reportName}-${idx}`}
                  reportName={r.reportName}
                  fileLink={r.fileLink}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 mt-8">No reports found.</p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-700 text-white rounded-l-md disabled:opacity-50"
              >
                Prev
              </button>
              <span className="px-4 py-2 text-lg text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-blue-700 text-white rounded-r-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SectionWrapper(AnnualReports, "annual-reports");
