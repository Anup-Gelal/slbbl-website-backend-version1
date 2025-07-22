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
    </div>
  );
};

export default Navbar;



{/*
import React, { useState } from "react";
import "react-vertical-timeline-component/style.min.css";
import { motion } from 'framer-motion';
import { fadeIn } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import { messages, swarojgarData } from "../constants";
import { Tilt } from "react-tilt";
import { successStories } from "../constants";

// Message Card component
const MessageCard = ({ description, image, index }) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className='bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full'
      >
        <div className='relative w-full h-[230px]'>
          <img
            src={image}
            alt='CEO'
            className='w-full h-full object-contain rounded-2xl'
          />
        </div>
        <div className='mt-5'>
          <p className='mt-2 text-secondary text-[14px]'>{description}</p>
        </div>
      </Tilt>
    </motion.div>
  );
};

// Stats Card component
const StatsCard = ({ title, value, icon, index }) => (
  <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
    <Tilt
      options={{
        max: 45,
        scale: 1,
        speed: 450,
      }}
      className='bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full'
    >
      <div className='relative w-full h-[230px]'>
        <div className='w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl'>
          <img src={icon} alt={title} className="w-24 h-34 object-contain mr-3" />
          <h3 className='text-2xl font-bold'>{title}</h3>
        </div>
      </div>
      <div className='mt-5 text-center'>
        <p className='text-[16px] text-secondary'>{value}</p>
      </div>
    </Tilt>
  </motion.div>
);

// Success Story Card component
const SuccessStoryCard = ({ title, description, fullDescription, images, index }) => {
  const [showFullStory, setShowFullStory] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const toggleFullStory = () => {
    setShowFullStory(prev => !prev);
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage('');
  };

  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className='bg-gradient-to-r from-green-400 to-blue-500 p-5 rounded-2xl sm:w-[480px] w-full' // Expanded horizontally and added gradient color
      >
        <div className='relative w-full h-[230px]'>
          <img
            src={images[0]} // Display the first image initially
            alt={title}
            className='w-full h-full object-contain rounded-2xl'
          />
        </div>

        <div className='mt-5'>
          <h3 className="text-2xl font-bold text-white">{title}</h3>
          <p className='mt-2 text-white text-[14px]'>
            {description}
          </p>
        </div>

        
        <div className='mt-5'>
          {showFullStory ? (
            <>
              <p className='text-white text-[14px]'>{fullDescription}</p>
              <div className='mt-3 grid grid-cols-2 gap-2'>
                {images.map((image, index) => (
                  <div key={index} className='relative'>
                    <img
                      src={image}
                      alt={`additional-${index}`}
                      className='w-full h-full object-cover rounded-2xl cursor-pointer'
                      onClick={() => openImageModal(image)} // Click image to enlarge
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <button
              onClick={toggleFullStory}
              className='text-blue-500 text-sm font-bold'
            >
              Read More
            </button>
          )}
        </div>
      </Tilt>

     
      {isImageModalOpen && (
        <div
          className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center'
          onClick={closeImageModal}
        >
          <div className='relative'>
            <img
              src={selectedImage}
              alt="Enlarged"
              className='w-[80vw] h-[80vh] object-contain'
            />
            <button
              onClick={closeImageModal}
              className='absolute top-5 right-5 bg-white text-black p-2 rounded-full'
            >
              X
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// About component
const About = () => {
  return (
    <>
      <motion.p
        variants={fadeIn('0.1', "0.3", 1, 2)}
        className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px] text-center font-poppins'
      >
        Message From CEO
        <br /><br />
        Manoj Krishna Uprety
        <br />
      </motion.p>

      <div className='mt-20 flex flex-wrap gap-7'>
        {messages.map((message, index) => (
          <MessageCard key={`message-${index}`} index={index} {...message} />
        ))}
      </div>

      
      <motion.p
        variants={fadeIn('0.1', "0.3", 1, 2)}
        className='mt-10 text-secondary text-[20px] max-w-3xl leading-[30px] text-center font-poppins font-bold'
      >
        Swarojgar at a Glance
        <br />
        As of Ashar 2081
      </motion.p>

      <div className='mt-20 flex flex-wrap gap-7'>
        {swarojgarData.map((stat, index) => (
          <StatsCard key={`stat-${index}`} index={index} {...stat} />
        ))}
      </div>

      <div className='mt-20 flex flex-wrap gap-7'>
        {successStories.map((story, index) => (
          <SuccessStoryCard key={`story-${index}`} index={index} {...story} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, 'about');
*/}


