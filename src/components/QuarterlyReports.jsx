import React, { useState, useEffect } from "react";
import { SectionWrapper } from "../hoc";
import axios from "axios";

const API_BASE = "https://slbbl-website-backend-version1.onrender.com/api/v1"; // Backend API
const FILE_BASE = "https://slbbl-website-backend-version1.onrender.com"; // File server

const FinancialReportCard = ({ reportName, fileLink }) => {
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

const Financials = () => {
  const [reports, setReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchYear, setSearchYear] = useState("");
  const [searchQuarter, setSearchQuarter] = useState("");
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(`${API_BASE}/financial-reports`);
        setReports(res.data || []);
      } catch (error) {
        console.error("Failed to fetch reports", error);
      }
    };

    fetchReports();
  }, []);

  // Filter reports based on search inputs
  const filteredReports = reports.filter((report) => {
    const yearMatch = searchYear ? report.reportName.includes(searchYear) : true;
    const quarterMatch = searchQuarter ? report.reportName.includes(searchQuarter) : true;
    return yearMatch && quarterMatch;
  });

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const currentReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen mt-20">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
        Financial Reports
      </h2>

      <p className="text-lg text-gray-800 text-center max-w-2xl mx-auto mb-8">
        Browse through our un-audited financial reports for the past quarters.
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
            placeholder="e.g. 2081"
            className="mt-1 p-2 bg-blue-100 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Quarter</label>
          <select
            value={searchQuarter}
            onChange={(e) => {
              setSearchQuarter(e.target.value);
              setCurrentPage(1);
            }}
            className="mt-1 p-2 bg-blue-100 border border-gray-300 rounded-lg"
          >
            <option value="">All</option>
            <option value="1st">1st Quarter</option>
            <option value="2nd">2nd Quarter</option>
            <option value="3rd">3rd Quarter</option>
            <option value="4th">4th Quarter</option>
          </select>
        </div>
      </div>

      {/* Report Cards */}
      <div className="flex flex-wrap gap-8 justify-center">
        {currentReports.length > 0 ? (
          currentReports.map((report) => (
            <FinancialReportCard
              key={report.id}
              reportName={report.reportName}
              fileLink={report.fileLink}
            />
          ))
        ) : (
          <p className="text-center text-gray-700">No reports found for selected filters.</p>
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

export default SectionWrapper(Financials, "financials");

{/*
import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../utils/motion"; // Assuming you have your framer-motion animations set up
import { SectionWrapper } from "../hoc";
import { financialReports } from "@/constants";

const FinancialReportCard = ({ reportName, index, fileLink }) => {
  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.5, 0.75)}
      className="w-full sm:w-[360px] bg-gradient-to-r from-blue-700 via-gray-600 to-light-blue-300 p-6 rounded-lg shadow-lg transition-all hover:shadow-xl"
    >
      <h3 className="text-xl font-semibold text-white mb-2">{reportName}</h3>
      <a
        href={fileLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white hover:text-indigo-200 font-medium"
      >
        Click to View Details
      </a>
    </motion.div>
  );
};

const Financials = () => {
 

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen mt-20">
      <motion.h2
        variants={fadeIn("up", "spring", 0.5, 0.75)}
        className="text-2xl font-bold text-blue-700 mb-6 text-center"
      >
        Financial Reports
      </motion.h2>

      <motion.p
        variants={fadeIn("up", "spring", 1, 1.5)}
        className="text-lg text-gray-800 text-center max-w-2xl mx-auto mb-8"
      >
        Browse through our un-audited financial reports for the past quarters.
      </motion.p>

      <div className="flex flex-wrap gap-8 justify-center">
        {financialReports.map((report, index) => (
          <FinancialReportCard
            key={index}
            reportName={report.reportName}
            index={index}
            fileLink={report.fileLink}
          />
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(Financials, "financials");
*/}