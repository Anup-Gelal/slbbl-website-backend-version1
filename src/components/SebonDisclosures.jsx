import React, { useEffect, useState } from "react";
import axios from "axios";
import { SectionWrapper } from "../hoc";

const API_BASE = "http://localhost:8080/api/v1";
const ITEMS_PER_PAGE = 5;

const DisclosureCard = ({ disclosureName, fileLink }) => (
  <div className="w-full sm:w-[360px] bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 p-6 rounded-lg shadow-lg transition-all hover:shadow-xl">
    <h3 className="text-xl font-semibold text-white mb-2">{disclosureName}</h3>
    <a
      href={fileLink}
      target="_blank"
      rel="noopener noreferrer"
      className="text-white hover:text-teal-200 font-medium"
    >
      Click to View Details
    </a>
  </div>
);

const SEBONDisclosures = () => {
  const [disclosures, setDisclosures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchDisclosures = async () => {
      try {
        const res = await axios.get(`${API_BASE}/sebon-disclosures`);
        setDisclosures(res.data || []);
      } catch (err) {
        setError("Failed to fetch SEBON disclosures.");
      } finally {
        setLoading(false);
      }
    };

    fetchDisclosures();
  }, []);

  const totalPages = Math.ceil(disclosures.length / ITEMS_PER_PAGE);
  const indexOfLast = currentPage * ITEMS_PER_PAGE;
  const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
  const currentDisclosures = disclosures.slice(indexOfFirst, indexOfLast);

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen mt-20">
      <h2 className="text-2xl font-bold text-teal-700 mb-6 text-center">
        SEBON Disclosures
      </h2>

      <p className="text-lg text-gray-800 text-center max-w-2xl mx-auto mb-8">
        Browse through the SEBON Disclosures related to AGM and SGM.
      </p>

      {loading ? (
        <p className="text-center text-gray-600">Loading disclosures...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-8 justify-center">
            {currentDisclosures.map((disclosure) => (
              <DisclosureCard
                key={disclosure.id}
                disclosureName={disclosure.disclosureName}
                fileLink={disclosure.fileLink}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-teal-700 text-white rounded-l-md disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-lg text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-teal-700 text-white rounded-r-md disabled:opacity-50"
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

export default SectionWrapper(SEBONDisclosures, "sebon-disclosures");
