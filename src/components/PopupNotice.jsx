import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "https://slbbl-website-backend-version1.onrender.com/api/v1";

const PopupNotice = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE}/popup-notice/latest`)
      .then((res) => {
        if (res.data && res.data.image_url) {
          setNotice(res.data);
          setIsVisible(true); // show popup if notice exists
        }
      })
      .catch((err) => {
        console.error("Failed to fetch popup notice:", err);
      });
  }, []);

  if (!isVisible || !notice) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="mb-4">
          <img
            src={`https://slbbl-website-backend-version1.onrender.com/${notice.image_url}`}
            alt={notice.notice_name}
            className="w-full h-auto rounded"
          />
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PopupNotice;
