import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const API_BASE = "https://slbbl-website-backend-version1.onrender.com/api/v1";

const ScrollingNotices = () => {
  const [notices, setNotices] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const marqueeRef = useRef(null);

  const fetchNotices = async () => {
    try {
      const response = await axios.get(`${API_BASE}/scrolling-notices`);
      console.log("API response for notices:", response.data);

      // Defensive: check if response.data is an array
      if (Array.isArray(response.data)) {
        setNotices(response.data);
      } else if (response.data && Array.isArray(response.data.notices)) {
        // If your API nests notices inside an object
        setNotices(response.data.notices);
      } else {
        // fallback to empty array or whatever makes sense
        setNotices([]);
      }
    } catch (error) {
      console.error("Failed to fetch notices:", error);
      setNotices([]);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  useEffect(() => {
    if (marqueeRef.current) {
      marqueeRef.current.style.animationPlayState = isPaused ? "paused" : "running";
    }
  }, [isPaused]);

  // Only map if notices is an array
  if (!Array.isArray(notices)) {
    return <p>Loading notices...</p>;
  }

  return (
    <div className="bg-indigo-600 text-white py-2">
      <div
        className="overflow-hidden whitespace-nowrap"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div
          ref={marqueeRef}
          className="flex gap-10 animate-marquee"
        >
          {notices.map((notice, index) => (
            <p key={index} className="text-sm md:text-base text-yellow-500">
              {notice.notice_text || notice} &nbsp;|&nbsp;
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollingNotices;
