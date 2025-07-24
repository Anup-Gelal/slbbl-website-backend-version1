import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_BASE = "https://slbbl-website-backend-version1.onrender.com/api/v1";

const Footer = () => {
  const [showAllDownloads, setShowAllDownloads] = useState(false);
  const [downloads, setDownloads] = useState([]);
  const [spokespersons, setSpokespersons] = useState([]);

  const fetchDownloads = async () => {
    try {
      const res = await axios.get(`${API_BASE}/footer-downloads`);
      setDownloads(res.data || []);
    } catch {
      // silently fail or add error handling
    }
  };

  const fetchSpokespersons = async () => {
    try {
      const res = await axios.get(`${API_BASE}/footer-spokespersons`);
      setSpokespersons(res.data || []);
    } catch {
      // silently fail or add error handling
    }
  };

  useEffect(() => {
    fetchDownloads();
    fetchSpokespersons();
  }, []);

  return (
    <footer className="bg-gray-900 text-white py-10 mt-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {/* Downloads Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">Downloads</h3>
          <ul className="space-y-2">
            {downloads.length === 0 && (
              <li className="text-gray-400">No downloads available.</li>
            )}
            {downloads
              .slice(0, showAllDownloads ? downloads.length : 4)
              .map((d) => (
                <li key={d.id}>
                  <a href={d.filePath} download className="hover:underline">
                    {d.title}
                  </a>
                </li>
              ))}
            {!showAllDownloads && downloads.length > 4 && (
              <li>
                <button
                  onClick={() => setShowAllDownloads(true)}
                  className="text-blue-400 font-semibold"
                >
                  View All
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="https://gunaso.nrb.org.np/" className="hover:underline" target="_blank" rel="noopener noreferrer">
                NRB Gunaso
              </Link>
            </li>
            <li>
              <Link to="/emicalculator" className="hover:underline">
                EMI Calculator
              </Link>
            </li>
            <li>
              <Link to="/careers" className="hover:underline">
                Careers
              </Link>
            </li>
            <li>
              <Link to="/contactus" className="hover:underline">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/allbranches" className="hover:underline">
                Our Branches
              </Link>
            </li>
            <li>
              <Link to="/applynow" className="hover:underline">
                Apply Now
              </Link>
            </li>
            <li>
              <Link to="/headofficestaff" className="hover:underline">
                Head Office Staff
              </Link>
            </li>
          </ul>
        </div>

        {/* Spokespersons & Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">Spokespersons</h3>
          <div className="space-y-4">
            {spokespersons.length === 0 && (
              <p className="text-gray-400">No spokesperson data available.</p>
            )}
            {spokespersons.map((sp) => {
              const imgUrl = sp.imagePath ? `https://slbbl-website-backend-version1.onrender.com${sp.imagePath}` : null;
             // console.log(`Rendering image URL for ${sp.name}:`, imgUrl);

              return (
                <div key={sp.id} className="flex items-center space-x-4">
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt={sp.name}
                      className="w-16 h-16 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/fallback-profile.png"; // Optional fallback image in your public folder
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-gray-300">
                      No Image
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{sp.name}</p>
                    <p className="text-sm">{sp.role}</p>
                    <p className="text-sm">📞 {sp.phone}</p>
                    <p className="text-sm">
                      ✉️{" "}
                      <a href={`mailto:${sp.email}`} className="hover:underline">
                        {sp.email}
                      </a>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-700 mt-8 pt-6 text-center">
        <p className="text-sm">Views: Visit Counter for Website</p>
        <p className="text-sm mt-2">
          Swarojgar Laghubitta Bittiya Sanstha Ltd © 2025 | Website by{" "}
          <a
            href="https://github.com/Anup-Gelal"
            className="text-blue-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Anup Gelal
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
