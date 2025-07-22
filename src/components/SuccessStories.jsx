import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tilt } from 'react-tilt';
import { SectionWrapper } from '@/hoc';

const API_BASE = 'http://localhost:8080/api/v1';
const FILE_BASE = API_BASE.replace(/\/api\/v1\/?$/, '');

const SuccessStoryCard = ({ title, description, fullDescription, images }) => {
  const [showFullStory, setShowFullStory] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const toggleFullStory = () => setShowFullStory(prev => !prev);
  const openImageModal = img => {
    setSelectedImage(img);
    setIsImageModalOpen(true);
  };
  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage('');
  };

  return (
    <div>
      <Tilt options={{ max: 45, scale: 1, speed: 450 }} className="bg-gradient-to-r from-purple-500 to-indigo-600 p-5 rounded-2xl sm:w-[480px] w-full">
        <div className="relative w-full h-[230px]">
          <img src={`${FILE_BASE}${images[0]}`} alt={title} className="w-full h-full object-contain rounded-2xl" />
        </div>
        <div className="mt-5">
          <h3 className="text-2xl font-bold text-white">{title}</h3>
          <p className="mt-2 text-white text-[14px]">{description}</p>
        </div>
        <div className="mt-5">
          {showFullStory ? (
            <>
              <p className="text-white text-[14px]">{fullDescription}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={`${FILE_BASE}${img}`}
                    onClick={() => openImageModal(`${FILE_BASE}${img}`)}
                    className="w-full h-full object-cover rounded-2xl cursor-pointer"
                    alt={`img-${i}`}
                  />
                ))}
              </div>
              <button onClick={toggleFullStory} className="mt-2 text-blue-300 text-sm font-bold">
                Show Less
              </button>
            </>
          ) : (
            <button onClick={toggleFullStory} className="text-blue-300 text-sm font-bold">Read More</button>
          )}
        </div>
      </Tilt>
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={closeImageModal}>
          <div className="relative">
            <img src={selectedImage} alt="Enlarged" className="w-[80vw] h-[80vh] object-contain" />
            <button onClick={closeImageModal} className="absolute top-5 right-5 bg-white p-2 rounded-full">✖</button>
          </div>
        </div>
      )}
    </div>
  );
};

const SuccessStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${API_BASE}/success-stories`)
      .then(res => setStories(res.data || []))
      .catch(err => {
        console.error("Failed to fetch success stories:", err);
        setError("Unable to load stories");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-10">Loading stories...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <div className="mt-20 flex flex-wrap gap-7 justify-center">
      {stories.map(story => (
        <SuccessStoryCard
          key={story.id}
          title={story.title}
          description={story.description}
          fullDescription={story.fullDescription}
          images={story.images}
        />
      ))}
    </div>
  );
};

export default SectionWrapper(SuccessStories, 'successstories');

{/*
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from "../utils/motion";
import { Tilt } from "react-tilt";
import { successStories } from "../constants"; 
import { SectionWrapper } from '@/hoc';

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
      //className="bg-gradient-to-r from-yellow-400 to-orange-500 p-5 rounded-2xl sm:w-[480px] w-full"
       className="bg-gradient-to-r from-purple-500 to-indigo-600 p-5 rounded-2xl sm:w-[480px] w-full"
      //className="bg-gradient-to-r from-teal-400 to-green-500 p-5 rounded-2xl sm:w-[480px] w-full"



      >
        <div className="relative w-full h-[230px]">
          <img
            src={images[0]} // Display the first image initially
            alt={title}
            className="w-full h-full object-contain rounded-2xl"
          />
        </div>

        <div className="mt-5">
          <h3 className="text-2xl font-bold text-white">{title}</h3>
          <p className="mt-2 text-white text-[14px]">{description}</p>
        </div>

        <div className="mt-5">
          {showFullStory ? (
            <>
              <p className="text-white text-[14px]">{fullDescription}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`additional-${index}`}
                      className="w-full h-full object-cover rounded-2xl cursor-pointer"
                      onClick={() => openImageModal(image)}
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <button
              onClick={toggleFullStory}
              className="text-blue-500 text-sm font-bold"
            >
              Read More
            </button>
          )}
        </div>
      </Tilt>

      {isImageModalOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center"
          onClick={closeImageModal}
        >
          <div className="relative">
            <img
              src={selectedImage}
              alt="Enlarged"
              className="w-[80vw] h-[80vh] object-contain"
            />
            <button
              onClick={closeImageModal}
              className="absolute top-5 right-5 bg-white text-black p-2 rounded-full"
            >
              X
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const SuccessStories = () => {
  return (
    <div className="mt-20 flex flex-wrap gap-7">
      {successStories.map((story, index) => (
        <SuccessStoryCard key={`story-${index}`} index={index} {...story} />
      ))}
    </div>
  );
};

export default SectionWrapper(SuccessStories,"successstories");
*/}