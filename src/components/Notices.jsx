import React, { useEffect, useState } from "react";
import { SectionWrapper } from "../hoc";
import axios from "axios";
import { FaEye, FaDownload } from "react-icons/fa";

const API_BASE = "http://localhost:8080/api/v1";
const FILE_BASE = "http://localhost:8080";
const ITEMS_PER_PAGE = 6;

// Utility to format date in YYYY-MM-DD
const formatDate = (input) => {
  const date = new Date(input);
  if (isNaN(date)) return "";
  return date.toISOString().split("T")[0];
};

const NoticeCard = ({ notice }) => {
  const fileUrl = `${FILE_BASE}${notice.fileLink}`;

  return (
    <div className="w-full sm:w-[360px] bg-white border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition">
      <h3 className="text-lg font-semibold text-blue-800 mb-2">{notice.noticeName}</h3>

      <p className="text-sm text-gray-500 mb-3">
        प्रकाशित मिति: {formatDate(notice.dateofissue)}
        
      </p>

      {notice.imageUrl && (
        <img
          src={notice.imageUrl}
          alt={notice.noticeName}
          className="w-full h-40 object-cover rounded-md border mb-4"
        />
      )}

      <div className="flex flex-col gap-2">
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          <FaEye /> View Notice
        </a>
        <a
          href={fileUrl}
          download
          className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
        >
          <FaDownload /> Download Notice
        </a>
      </div>
    </div>
  );
};

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const itemsPerPage = ITEMS_PER_PAGE;

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await axios.get(`${API_BASE}/notices`);
        setNotices(res.data || []);
      } catch (error) {
        console.error("Failed to fetch notices", error);
      }
    };

    fetchNotices();
  }, []);

  // Filter by text match (in name or date)
  const filteredNotices = notices.filter((notice) => {
    const keyword = searchText.toLowerCase();
    return (
      notice.noticeName.toLowerCase().includes(keyword) ||
      formatDate(notice.dateofissue).includes(keyword)
    );
  });

  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
  const currentNotices = filteredNotices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen mt-20">
      <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Public Notices</h2>

      <p className="text-lg text-green-800 text-center max-w-2xl mx-auto mb-8">
        Official documents and announcements published by our organization.
      </p>

      {/* Search */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search by name or date (YYYY-MM-DD)"
          className="w-full max-w-md p-2 bg-blue-100 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Cards */}
      <div className="flex flex-wrap gap-8 justify-center">
        {currentNotices.length > 0 ? (
          currentNotices.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} />
          ))
        ) : (
          <p className="text-center text-gray-700">No notices found.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10 gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-green-700 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-green-700 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SectionWrapper(Notices, "notices");

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