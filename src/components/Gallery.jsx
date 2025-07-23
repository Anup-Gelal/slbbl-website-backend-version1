import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const API_BASE = "https://slbbl-website-backend-version1.onrender.com/api/v1";
const ITEMS_PER_PAGE = 6;

const GalleryCard = ({ title, date, images, openImageModal }) => (
  <motion.div
    className="w-full sm:w-[400px] bg-white shadow-xl rounded-xl overflow-hidden transition-all transform hover:scale-105 hover:shadow-2xl"
    whileHover={{ scale: 1.05 }}
  >
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-800 text-center">{title}</h3>
      <p className="text-gray-500 text-center">{date}</p>
    </div>
    <div
      className="grid grid-cols-2 gap-2 cursor-pointer p-4"
      onClick={() => openImageModal(images)}
    >
      {images && images.length > 0 ? (
        images.map((img, i) => (
          <img
            key={i}
            src={`https://slbbl-website-backend-version1.onrender.com${img}`}
            alt={`${title}-img-${i}`}
            className="rounded-lg object-cover w-full h-28"
          />
        ))
      ) : (
        <img src="/fallback-image.jpg" alt="Fallback" className="rounded-lg object-cover w-full h-28" />
      )}
    </div>
  </motion.div>
);

const Gallery = () => {
  const [galleries, setGalleries] = useState([]);
  const [modalImages, setModalImages] = useState(null);
  const [modalIndex, setModalIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const res = await axios.get(`${API_BASE}/galleries`);
        const normalized = (res.data || []).map((g) => ({
          ...g,
          image:
            Array.isArray(g.imagePaths)
              ? g.imagePaths.map((p) =>
                  p.startsWith("/") ? p : `/${p.replace(/^uploads\/?/, "uploads/")}`
                )
              : [],
          Date: g.Date || g.date || "",
        }));
        setGalleries(normalized);
      } catch (err) {
        console.error("Failed to fetch galleries:", err);
      }
    };
    fetchGalleries();
  }, []);

  const openImageModal = (images, index = 0) => {
    if (images && images.length > 0) {
      setModalImages(images);
      setModalIndex(index);
    }
  };

  const closeModal = () => {
    setModalImages(null);
    setModalIndex(0);
  };

  const nextImage = () => {
    if (!modalImages) return;
    setModalIndex((prev) => (prev + 1) % modalImages.length);
  };

  const prevImage = () => {
    if (!modalImages) return;
    setModalIndex((prev) => (prev === 0 ? modalImages.length - 1 : prev - 1));
  };

  const filtered = galleries.filter((g) =>
    g.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const displayed = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen mt-20">
      <h2 className="text-3xl font-bold text-blue-700 mb-10 text-center tracking-wide">
        SLBBL Gallery
      </h2>

      <div className="mb-8 text-center">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 bg-white"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayed.map((item, i) => (
          <GalleryCard
            key={i}
            title={item.title}
            date={item.Date}
            images={item.image}
            openImageModal={(imgs) => openImageModal(item.image)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-12 gap-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-800 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {modalImages && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-[9999]"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-4xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white p-3 bg-gray-700 rounded-full hover:bg-gray-900 transition duration-300"
              onClick={prevImage}
            >
              <ChevronLeft size={40} />
            </button>

            <img
              src={`https://slbbl-website-backend-version1.onrender.com${modalImages[modalIndex]}`}
              alt={`Slide ${modalIndex + 1}`}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-lg"
            />

            <button
              className="absolute right-5 top-1/2 transform -translate-y-1/2 text-white p-3 bg-gray-700 rounded-full hover:bg-gray-900 transition duration-300"
              onClick={nextImage}
            >
              <ChevronRight size={40} />
            </button>

            <div className="flex justify-center gap-3 mt-4 overflow-x-auto px-1">
              {modalImages.map((img, i) => (
                <img
                  key={i}
                  src={`https://slbbl-website-backend-version1.onrender.com${img}`}
                  alt={`thumb-${i}`}
                  onClick={() => setModalIndex(i)}
                  className={`w-16 h-16 object-cover rounded-md cursor-pointer border-4 ${
                    i === modalIndex ? "border-blue-500" : "border-transparent"
                  }`}
                />
              ))}
            </div>

            <button
              className="absolute top-5 right-5 text-white bg-red-600 rounded-full p-2 hover:bg-red-700 transition duration-300"
              onClick={closeModal}
            >
              <X size={30} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;