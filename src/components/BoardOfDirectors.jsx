import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import ProfileModal from "./ProfileModal";

const API_BASE = "https://slbbl-website-backend-version1.onrender.com/api/v1";

const BodCard = ({ bod, onClick }) => (
  <div
    onClick={() => onClick(bod)}
    className="cursor-pointer bg-gradient-to-br from-green-400 to-blue-400 p-6 rounded-2xl shadow-md flex flex-col items-center hover:opacity-90 transition"
  >
    <div
      className="w-24 h-24 rounded-lg overflow-hidden mb-4"
      style={{ backgroundColor: `#${bod.iconBg || "E6DEDD"}` }}
    >
      <img
        src={`http://localhost:8080/${bod.icon}`}
        alt={bod.title}
        className="w-full h-full object-contain"
      />
    </div>
    <h3 className="text-lg font-bold text-white text-center">{bod.title}</h3>
    <p className="text-sm text-green-50 text-center mt-1">{bod.description}</p>
  </div>
);
const BoardOfDirectors = () => {
  const [bods, setBods] = useState([]);
  const [selectedBod, setSelectedBod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBods = async () => {
      try {
        const response = await axios.get(`${API_BASE}/bods`);
        setBods(response.data);
      } catch (err) {
        setError("Failed to fetch board members.");
      } finally {
        setLoading(false);
      }
    };

    fetchBods();
  }, []);

  const chairperson = bods.find((b) =>
    b.description.toLowerCase().includes("chairperson")
  );
  const otherBods = bods.filter((b) => b !== chairperson);

  if (loading) return <p className="text-center text-white mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-400 mt-10">{error}</p>;

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className="text-center font-poppins text-[24px] text-white">
          Board Of Directors
        </p>
      </motion.div>

      {/* Chairperson Section */}
      {chairperson && (
        <section className="mt-10 px-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-lg max-w-3xl mx-auto">
            <h2 className="text-white text-xl font-semibold mb-6 text-center">Chairperson</h2>
            <div className="flex justify-center">
              <div className="w-full sm:w-2/3 md:w-1/2">
                <BodCard bod={chairperson} onClick={setSelectedBod} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Other Board Members */}
      <section className="mt-16 px-4">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-lg">
          <h2 className="text-white text-xl font-semibold mb-6 text-center">Board Members</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {otherBods.map((bod, index) => (
              <BodCard key={`bod-${index}`} bod={bod} onClick={setSelectedBod} />
            ))}
          </div>
        </div>
      </section>

      {/* Modal for Profile */}
      {selectedBod && (
        <ProfileModal data={selectedBod} onClose={() => setSelectedBod(null)} />
      )}
    </>
  );
};

export default SectionWrapper(BoardOfDirectors, "boardofdirectors");


{/*
// src/components/BoardOfDirectors.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import { bods } from "../constants";
import ProfileModal from "./ProfileModal";

const BodCard = ({ bod, onClick }) => (
  <div
    onClick={() => onClick(bod)}
    className="cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-md flex flex-col items-center hover:bg-white/20 transition"
  >
    <div className="w-24 h-24 rounded-lg overflow-hidden mb-4" style={{ backgroundColor: bod.iconBg }}>
      <img src={bod.icon} alt={bod.title} className="w-full h-full object-contain" />
    </div>
    <h3 className="text-lg font-bold text-white text-center">{bod.title}</h3>
    <p className="text-sm text-secondary text-center mt-1">{bod.desc}</p>
  </div>
);

const BoardOfDirectors = () => {
  const [selectedBod, setSelectedBod] = useState(null);
  const chairperson = bods.find(b => b.desc.includes("CHAIRPERSON"));
  const otherBods = bods.filter(b => b !== chairperson);

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className="text-center font-poppins text-[24px] text-white">Board Of Directors</p>
      </motion.div>

     
      {chairperson && (
        <section className="mt-10 px-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-lg max-w-3xl mx-auto">
            <h2 className="text-white text-xl font-semibold mb-6 text-center">Chairperson</h2>
            <div className="flex justify-center">
              <div className="w-full sm:w-2/3 md:w-1/2">
                <BodCard bod={chairperson} onClick={setSelectedBod} />
              </div>
            </div>
          </div>
        </section>
      )}

    
      <section className="mt-16 px-4">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-lg">
          <h2 className="text-white text-xl font-semibold mb-6 text-center">Board Members</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {otherBods.map((bod, index) => (
              <BodCard key={`bod-${index}`} bod={bod} onClick={setSelectedBod} />
            ))}
          </div>
        </div>
      </section>

      {selectedBod && (
        <ProfileModal data={selectedBod} onClose={() => setSelectedBod(null)} />
      )}
    </>
  );
};

export default SectionWrapper(BoardOfDirectors, "boardofdirectors");
*/}
{/*

import React from "react";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { motion } from 'framer-motion';
import { textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import { bods } from "../constants";

const BodCard = ({ bod }) => (
  <VerticalTimelineElement
    contentStyle={{
      background: "#1d1836",
      color: "#fff",
      borderRadius: "10px",
      padding: "20px",
    }}
    contentArrowStyle={{ borderRight: "8px solid #232631" }}
    iconStyle={{
      background: bod.iconBg,
      width: "80px",
      height: "80px",
      borderRadius: "10px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginRight: "20px",
    }}
    icon={
      <div className="flex justify-center items-center w-full h-full">
        <img src={bod.icon} alt={bod.title} className="absolute inset-0 w-full h-full object-contain rounded" />
      </div>
    }
  >
    <h3 className='text-white text-[24px] font-bold'>{bod.title}</h3>
    <p className='text-secondary text-[16px] font-semibold' style={{ margin: 0 }}>
      {bod.desc}
    </p>
  </VerticalTimelineElement>
);

const BoardOfDirectors = () => (
  <>
    <motion.div variants={textVariant()}>
      <p className="text-center font-poppins text-[24px] text-white">Board Of Directors</p>
    </motion.div>
    <div className="mt-20 flex flex-col">
      <VerticalTimeline>
        {bods.map((bod, index) => (
          <BodCard key={`bod-${index}`} bod={bod} />
        ))}
      </VerticalTimeline>
    </div>
  </>
);

export default SectionWrapper(BoardOfDirectors, "boardofdirectors");
*/}