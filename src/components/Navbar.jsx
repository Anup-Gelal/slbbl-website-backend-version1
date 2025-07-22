import React, { useState } from "react";
import { Link } from "react-router-dom";
import { styles } from "../style";
import { navLinks } from "../constants";
import { menu, close, logo } from "../assets";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleDropdownToggle = (id) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  return (
    <div>
      <nav className={`${styles.paddingX} bg-[#cfd3f6] w-full flex items-center py-5 fixed z-20`}>
        <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2"
            onClick={() => {
              setActive("");
              window.scrollTo(0, 0);
            }}
          >
            <img src={logo} alt="logo" className="w-[3] h-12 object-contain" />
          </Link>

          {/* Desktop Menu */}
          <ul className="list-none hidden sm:flex flex-row gap-10">
            {navLinks.map((link) => (
              <li key={link.id} className="relative">
                {link.subLinks ? (
                  <>
                    <div
                      className={`${
                        active === link.title ? "text-geen-900" : "text-green-700"
                      } hover:text-green-700 font-semibold text-[18px] cursor-pointer flex items-center`}
                      onClick={() => {
                        setActive(link.title);
                        handleDropdownToggle(link.id);
                      }}
                    >
                      {link.title}
                      <span className="ml-1 text-sm">
                        {openDropdown === link.id ? '▾' : '▸'}
                      </span>
                    </div>
                    {openDropdown === link.id && (
                      <div className="absolute top-full left-0 bg-white shadow-lg rounded-lg p-4 w-44">
                        {link.subLinks.map((subLink) => (
                          <Link
                            key={subLink.id}
                            to={subLink.path}
                            className="block text-[16px] text-gray-700 py-2 hover:text-blue-700 font-semibold"
                            onClick={() => {
                              setActive(subLink.title);
                              setOpenDropdown(null);
                            }}
                          >
                            {subLink.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={`/${link.id}`}
                    className={`${
                      active === link.title ? "text-green-900" : "text-green-700"
                    } hover:text-green-700 font-semibold text-[18px] cursor-pointer`}
                    onClick={() => {
                      setActive(link.title);
                      setOpenDropdown(null);
                    }}
                  >
                    {link.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Mobile Menu Toggle */}
          <div className="sm:hidden flex flex-1 justify-end items-center relative">
            <img
              src={toggle ? close : menu}
              alt="menu"
              className="w-[28px] h-[28px] object-contain"
              onClick={() => setToggle(!toggle)}
            />

            {/* Backdrop */}
            {toggle && (
              <div
                className="fixed inset-0 bg-black opacity-50 z-40"
                onClick={() => setToggle(false)}
              />
            )}

            {/* Slide-in panel */}
            <div
              className={`fixed top-0 left-0 w-4/5 max-w-sm h-full bg-white z-50 shadow-lg transform transition-transform duration-300 ${
                toggle ? "translate-x-0" : "-translate-x-full"
              } overflow-y-auto`}
            >
              <button
                className="absolute top-5 right-5 text-gray-700"
                onClick={() => setToggle(false)}
                aria-label="Close Menu"
              >
                ✕
              </button>

              <ul className="list-none flex flex-col w-full gap-2 pt-16 px-4">
                {navLinks.map((nav) => {
                  const hasSubs = !!nav.subLinks;
                  const isOpen = openDropdown === nav.id;

                  return (
                    <li key={nav.id} className="w-full">
                      {hasSubs ? (
                        <>
                          <button
                            className="w-full flex justify-between items-center py-2 font-medium text-green-300 hover:text-green-700"
                            onClick={() => handleDropdownToggle(nav.id)}
                          >
                            {nav.title}
                            <span className="ml-2">{isOpen ? '▾' : '▸'}</span>
                          </button>
                          {isOpen && (
                            <ul className="mt-1 pl-4 border-l border-gray-200">
                              {nav.subLinks.map((sub) => (
                                <li key={sub.id}>
                                  <Link
                                    to={sub.path}
                                    className="block py-1 text-gray-600 hover:text-blue-700"
                                    onClick={() => {
                                      setToggle(false); // close mobile menu
                                      setActive(sub.title);
                                      setOpenDropdown(null);
                                    }}
                                  >
                                    {sub.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </>
                      ) : (
                        <Link
                          to={`/${nav.id}`}
                          className="block w-full py-2 font-medium text-gray-700 hover:text-blue-700"
                          onClick={() => {
                            setToggle(false);
                            setActive(nav.title);
                            setOpenDropdown(null);
                          }}
                        >
                          {nav.title}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;


{/* 
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { styles } from "../style";
import { navLinks } from "../constants";
import { menu, close, logo } from "../assets";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleDropdownToggle = (id) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  return (
    <nav className={`${styles.paddingX} bg-[#cfd3f6] w-full flex items-center py-5 fixed z-20`}>
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          <img src={logo} alt="logo" className="w-[3] h-12 object-contain" />
        </Link>
        <ul className="list-none hidden sm:flex flex-row gap-10">
          {navLinks.map((link) => (
            <li key={link.id} className="relative">
              {link.subLinks ? (
                <div
                  className={`${
                    active === link.title ? "text-gray-900" : "text-gray-700"
                  } hover:text-blue-700 font-semibold text-[18px] cursor-pointer`}
                  onClick={() => {
                    setActive(link.title);
                    handleDropdownToggle(link.id);
                  }}
                >
                  {link.title}
                </div>
              ) : (
                <Link
                  to={`/${link.id}`}
                  className={`${
                    active === link.title ? "text-gray-900" : "text-gray-700"
                  } hover:text-blue-700 font-semibold text-[18px] cursor-pointer`}
                  onClick={() => {
                    setActive(link.title);
                    setOpenDropdown(null);
                  }}
                >
                  {link.title}
                </Link>
              )}

              {openDropdown === link.id && link.subLinks && (
                <div className="absolute top-full left-0 bg-white shadow-lg rounded-lg p-4 w-[200px]">
                  {link.subLinks.map((subLink) => (
                    <Link
                      key={subLink.id}
                      to={subLink.path}
                      className="block text-[16px] text-gray-700 py-2 hover:text-blue-700 font-semibold"
                      onClick={() => {
                        setActive(subLink.title);
                        setOpenDropdown(null);
                      }}
                    >
                      {subLink.title}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="sm:hidden flex flex-1 justify-end items-center">
          <img
            src={toggle ? close : menu}
            alt="menu"
            className="w-[28px] h-[28px] object-contain"
            onClick={() => setToggle(!toggle)}
          />
          <div
            className={`${
              !toggle ? "hidden" : "flex"
            } p-6 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}
          >
            <ul className="list-none flex justify-end items-start flex-1 flex-col gap-4">
              {navLinks.map((nav) => (
                <li key={nav.id}>
                  <Link
                    to={`/${nav.id}`}
                    className={`font-poppins font-medium cursor-pointer text-[16px] ${
                      active === nav.title ? "text-gray-900" : "text-gray-700"
                    } hover:text-blue-700 font-semibold`}
                    onClick={() => {
                      setToggle(!toggle);
                      setActive(nav.title);
                    }}
                  >
                    {nav.title}
                  </Link>
                  {nav.subLinks && (
                    <div className="flex flex-col pl-4">
                      {nav.subLinks.map((subLink) => (
                        <Link
                          key={subLink.id}
                          to={subLink.path}
                          className="text-[14px] text-gray-700 py-2 hover:text-blue-700 font-semibold"
                          onClick={() => {
                            setToggle(!toggle);
                            setActive(subLink.title);
                          }}
                        >
                          {subLink.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

*/}




