import React, { useState, useEffect } from "react";
import { SectionWrapper } from "../hoc";
import axios from "axios";

const IndicatorCard = ({ reportName, fileLink }) => {
  return (
    <div className="w-full sm:w-[360px] bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 p-6 rounded-lg shadow-lg transition-all hover:shadow-xl">
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
};

const PrincipalIndicators = () => {
  const [indicators, setIndicators] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchIndicators = async () => {
      try {
        const res = await axios.get("https://slbbl-website-backend-version1.onrender.com/api/v1/principal-indicators");
        setIndicators(res.data || []);
      } catch (error) {
        console.error("Failed to fetch indicators", error);
      }
    };

    fetchIndicators();
  }, []);

  // Pagination logic
  const indexOfLastIndicator = currentPage * itemsPerPage;
  const indexOfFirstIndicator = indexOfLastIndicator - itemsPerPage;
  const currentIndicators = indicators.slice(indexOfFirstIndicator, indexOfLastIndicator);
  const totalPages = Math.ceil(indicators.length / itemsPerPage);

  // Handlers
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen mt-20">
      <h2 className="text-2xl font-bold text-teal-700 mb-6 text-center">
        Principal Indicators
      </h2>

      <p className="text-lg text-gray-800 text-center max-w-2xl mx-auto mb-8">
        Browse through the Principal Indicators.
      </p>

      {/* Display Cards */}
      <div className="flex flex-wrap gap-8 justify-center">
        {currentIndicators.map((indicator, index) => (
          <IndicatorCard
            key={indicator.id}
            reportName={indicator.reportName}
            fileLink={indicator.fileLink}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-teal-700 text-white rounded-l-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-lg text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-teal-700 text-white rounded-r-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SectionWrapper(PrincipalIndicators, "principal-indicators");
