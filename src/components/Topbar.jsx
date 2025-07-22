import React, { forwardRef, useState, useEffect } from "react";
import { topLinks } from "../constants";
import { Link, useNavigate } from "react-router-dom";

const Topbar = forwardRef((props, ref) => {
  const [dateTime, setDateTime] = useState(new Date().toLocaleString());
  const [adminMode, setAdminMode] = useState(false);
  const navigate = useNavigate();

  // Update dateTime every second
  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleAdminPanel = () => {
    setAdminMode(!adminMode);
    navigate("/adminpanel");
  };

  return (
    <nav
      ref={ref}
      className="bg-green-700 w-full flex items-center py-5 fixed top-0 z-20"
    >
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        {/* Clock on the left */}
        <div className="text-white text-xl font-semibold pl-4 rounded-lg shadow-lg bg-gradient-to-r from-teal-500 via-green-500 to-blue-500 px-4 py-2">
          {dateTime}
        </div>

        {/* Top links */}
        <ul className="list-none flex flex-wrap justify-center gap-4 sm:flex-row sm:gap-10">
          {topLinks.map((link) => {
            if (link.id === "stockwatch") {
              return (
                <li key={link.id} className="text-white text-[18px] font-medium cursor-pointer hover:text-gray-200 transition duration-300">
                  <a href="https://nepalstock.com/" target="_blank" rel="noopener noreferrer">{link.title}</a>
                </li>
              );
            }

            if (link.id === "ciblogin") {
              return (
                <li key={link.id} className="text-white text-[18px] font-medium cursor-pointer hover:text-gray-200 transition duration-300">
                  <a href="https://web.ksklns.com/ksklweb/packages/accountmanagement/login.aspx" target="_blank" rel="noopener noreferrer">{link.title}</a>
                </li>
              );
            }

            if (link.id === "login") {
              return (
                <li key={link.id} className="flex items-center text-white gap-2">
                  <span className="text-[18px] font-medium">Admin</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={adminMode}
                      onChange={toggleAdminPanel}
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </li>
              );
            }

            return (
              <li
                key={link.id}
                className="text-white text-[18px] font-medium cursor-pointer hover:text-gray-200 transition duration-300"
              >
                <Link to={`/${link.id}`}>{link.title}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
});

export default Topbar;



{/*

import React, { forwardRef } from "react";
import { topLinks } from "../constants";
import { Link } from "react-router-dom";

const Topbar = forwardRef((props, ref) => {
  return (
    <nav ref={ref} className="bg-blue-700 w-full flex items-center py-5 fixed top-0 z-20">
      <div className="w-full flex justify-center items-center max-w-7xl mx-auto">
        
        <ul className="list-none flex flex-wrap justify-center gap-4 sm:flex-row sm:gap-10">
          {topLinks.map((link) => (
            <li key={link.id} className="text-white text-[18px] font-medium cursor-pointer hover:text-gray-200 transition duration-300">
             
              {link.id === "stockwatch" ? (
                <a href="https://nepalstock.com/" target="_blank" rel="noopener noreferrer">
                  {link.title}
                </a>
              ) : link.id === "ciblogin" ? (
                <a href="https://web.ksklns.com/ksklweb/packages/accountmanagement/login.aspx" target="_blank" rel="noopener noreferrer">
                  {link.title}
                </a>
              ) : link.id === "gunaso" ? ( 
                <Link to="/gunaso">
                  {link.title}
                </Link>
              ) : (
                <Link to={`/${link.id}`}>
                  {link.title}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
});

export default Topbar;

 */}