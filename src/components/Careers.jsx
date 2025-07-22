import React, { useEffect, useState } from "react";
import axios from "axios";
import { SectionWrapper } from "../hoc";

const API_BASE = "http://localhost:8080/api/v1";
const ITEMS_PER_PAGE = 5;

const VacancyCard = ({ vacancyDate, postedDate, expiryDate, fileLink }) => (
  <div className="w-full sm:w-[360px] bg-gradient-to-r from-green-400 via-blue-500 to-indigo-600 p-6 rounded-lg shadow-lg transition-all hover:shadow-xl">
    <h3 className="text-xl font-semibold text-white mb-2">Vacancy Date: {vacancyDate}</h3>
    <p className="text-sm text-white mb-1">Posted: {postedDate}</p>
    <p className="text-sm text-white mb-4">Expires: {expiryDate}</p>
    <a
      href={`http://localhost:8080${fileLink}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-white hover:text-indigo-200 font-medium"
    >
      View PDF
    </a>
  </div>
);

const Careers = () => {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const res = await axios.get(`${API_BASE}/vacancies`);
        setVacancies(res.data || []);
      } catch (err) {
        setError("Failed to fetch vacancies.");
      } finally {
        setLoading(false);
      }
    };

    fetchVacancies();
  }, []);

  const totalPages = Math.ceil(vacancies.length / ITEMS_PER_PAGE);
  const indexOfLast = currentPage * ITEMS_PER_PAGE;
  const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
  const currentVacancies = vacancies.slice(indexOfFirst, indexOfLast);

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen mt-20">
      <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
        Career Opportunities
      </h2>

      <p className="text-lg text-green-800 text-center max-w-2xl mx-auto mb-8">
        Browse and apply to our current job openings.
      </p>

      {loading ? (
        <p className="text-center text-gray-600">Loading vacancies...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-8 justify-center">
            {currentVacancies.map((vacancy) => (
              <VacancyCard
                key={vacancy.id}
                vacancyDate={vacancy.vacancy_date}
                postedDate={vacancy.posted_date}
                expiryDate={vacancy.expiry_date}
                fileLink={vacancy.file_link}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-indigo-700 text-white rounded-l-md disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-lg text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-indigo-700 text-white rounded-r-md disabled:opacity-50"
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

export default SectionWrapper(Careers, "careers");


{/*
import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../utils/motion"; // Assuming you have your framer-motion animations set up
import { SectionWrapper } from "../hoc";

import { vacancies } from "@/constants";

const CareerCard = ({ vacancyDate, postedDate, index, fileLink }) => {
  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.5, 0.75)}
      className="w-full sm:w-[360px] bg-white p-6 rounded-lg shadow-lg transition-all hover:shadow-xl"
    >
      <h3 className="text-xl font-semibold text-blue-700 mb-2">Vacancy {vacancyDate}</h3>
      <p className="text-sm text-gray-700 mb-4">Posted on: {postedDate}</p>
      <a
        href={fileLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-indigo-600 hover:text-indigo-700 font-medium"
      >
        Click to View Details
      </a>
    </motion.div>
  );
};

const Careers = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen mt-20">
      <motion.h2
        variants={fadeIn("up", "spring", 0.5, 0.75)}
        className="text-2xl font-bold text-blue-700 mb-6 text-center"
      >
        Career Opportunities
      </motion.h2>

      <motion.p
        variants={fadeIn("up", "spring", 1, 1.5)}
        className="text-lg text-gray-800 text-center max-w-2xl mx-auto mb-8"
      >
        Explore the latest job vacancies and apply for exciting career opportunities.
      </motion.p>

      <div className="flex flex-wrap gap-8 justify-center">
        {vacancies.map((vacancy, index) => (
          <CareerCard
            key={index}
            vacancyDate={vacancy.vacancyDate}
            postedDate={vacancy.postedDate}
            index={index}
            fileLink={vacancy.fileLink}
          />
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(Careers, "careers");
 */}