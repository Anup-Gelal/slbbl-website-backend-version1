import React, { useEffect, useState } from 'react';
import { SectionWrapper } from '@/hoc';
import axios from 'axios';
import { FaEye, FaDownload } from 'react-icons/fa';

const API_BASE = 'https://slbbl-website-backend-version1.onrender.com/api/v1';
const ITEMS_PER_PAGE = 5;

const NoticeCard = ({ noticeData }) => (
  <div className="w-full sm:w-[360px] bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 p-6 rounded-lg shadow-lg transition-all hover:shadow-xl">
    <img
      src={noticeData.image}
      alt={noticeData.noticeName}
      className="w-full h-48 object-cover rounded-t-lg mb-4"
    />
    <h3 className="text-xl font-semibold text-white mb-2">{noticeData.noticeName}</h3>
    <p className="text-white font-medium">{noticeData.dateOfIssue}</p>
    <div className="mt-4 flex gap-4">
      <a
        href={noticeData.details}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 bg-white text-blue-700 font-semibold rounded hover:bg-blue-100 transition"
      >
        <FaEye /> View
      </a>
      <a
        href={noticeData.details}
        download
        className="flex items-center gap-2 px-4 py-2 bg-white text-blue-700 font-semibold rounded hover:bg-blue-100 transition"
      >
        <FaDownload /> Download
      </a>
    </div>
  </div>
);

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios.get(`${API_BASE}/notices`)
      .then(res => setNotices(res.data || []))
      .catch(() => console.error('Failed to fetch notices'))
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(notices.length / ITEMS_PER_PAGE);
  const currentNotices = notices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen mt-20">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Notices</h2>
      <p className="text-lg text-gray-800 text-center max-w-2xl mx-auto mb-8">
        Browse through the latest notices issued by the organization.
      </p>

      <div className="flex flex-wrap gap-8 justify-center">
        {loading ? (
          <p className="text-center mt-10 text-gray-500">Loading notices...</p>
        ) : (
          currentNotices.map((notice, idx) => (
            <NoticeCard key={notice.id || idx} noticeData={notice} />
          ))
        )}
      </div>

      <div className="flex justify-center mt-8 gap-2">
        <button
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-700 text-white rounded-l-md disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-lg text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-700 text-white rounded-r-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SectionWrapper(Notices, 'notices');


{/*
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../utils/motion';
import { SectionWrapper } from '@/hoc';
import { notice } from '@/constants';

const NoticeCard = ({ noticeData, index, openModal }) => {
  return (
    <motion.div
      variants={fadeIn('up', 'spring', index * 0.5, 0.75)}
      className="w-full sm:w-[360px] bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 p-6 rounded-lg shadow-lg transition-all hover:shadow-xl"
    >
      <img
        src={noticeData.image}
        alt={noticeData.noticeName}
        className="w-full h-48 object-cover rounded-t-lg mb-4"
      />
      <h3 className="text-xl font-semibold text-white mb-2">{noticeData.noticeName}</h3>
      <p className="text-white font-medium">{noticeData.dateOfIssue}</p>
      <button
        onClick={() => openModal(noticeData)}
        className="text-white mt-4 hover:text-indigo-200"
      >
        Click to View More Details
      </button>
    </motion.div>
  );
};

const Notices = () => {
  const [selectedNotice, setSelectedNotice] = useState(null); // Track the selected notice
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  const openModal = (noticeData) => {
    setSelectedNotice(noticeData); // Set the selected notice data
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedNotice(null); // Reset the selected notice
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen mt-20">
      <motion.h2
        variants={fadeIn('up', 'spring', 0.5, 0.75)}
        className="text-2xl font-bold text-blue-700 mb-6 text-center"
      >
        Notices
      </motion.h2>

      <motion.p
        variants={fadeIn('up', 'spring', 1, 1.5)}
        className="text-lg text-gray-800 text-center max-w-2xl mx-auto mb-8"
      >
        Browse through the latest notices issued by the organization.
      </motion.p>

     
      <div className="flex flex-wrap gap-8 justify-center">
        {notice.map((noticeItem, index) => (
          <NoticeCard key={index} noticeData={noticeItem} index={index} openModal={openModal} />
        ))}
      </div>

     
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-4/5 md:w-1/2">
            <img
              src={selectedNotice.image}
              alt={selectedNotice.noticeName}
              className="w-full h-96 object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">{selectedNotice.noticeName}</h2>
            <p className="text-lg text-gray-800 mb-4">{selectedNotice.dateOfIssue}</p>
            <p className="text-gray-700 mb-6">{selectedNotice.details}</p>
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionWrapper(Notices, 'notices');
*/}