import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import ProfileModal from "./ProfileModal";
import axios from "axios";

const API_BASE = "https://slbbl-website-backend-version1.onrender.com/api/v1";

const ManagementCard = ({ management, onClick }) => (
  <div
    onClick={() => onClick(management)}
    className="cursor-pointer bg-gradient-to-br from-green-400 to-blue-400 p-6 rounded-2xl shadow-md flex flex-col items-center hover:opacity-90 transition"
  >
    <div
      className="w-24 h-24 rounded-lg overflow-hidden mb-4"
      style={{ backgroundColor: management.icon_bg || "#ccc" }}
    >
      <img
        src={`https://slbbl-website-backend-version1.onrender.com/uploads/${management.icon}`}
        alt={management.title || "Team Member"}
        className="w-full h-full object-contain"
      />
    </div>
    <h3 className="text-lg font-bold text-green-100 text-center">{management.title}</h3>
    <p className="text-sm text-green-50 text-center mt-1">
      {management.description}
    </p>
  </div>
);

const ManagementTeam = () => {
  const [managements, setManagements] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);

  useEffect(() => {
    const fetchManagement = async () => {
      try {
        const res = await axios.get(`${API_BASE}/management-team`);
        setManagements(res.data);
      } catch (err) {
        console.error("Failed to fetch management team:", err);
      }
    };
    fetchManagement();
  }, []);

  const ceo = managements.find((m) => m.description === "Chief Executive Officer");
  const teamLeads = managements.filter((m) =>
    ["Assistant General Manager", "Administration Head", "Credit Department Head",
     "Head of Risk Management Department", "Head of General Services Department",
     "HOD-Accounts & Finance"].includes(m.description)
  );
  const departmentHeads = managements.filter((m) =>
    m.description.includes("Head") &&
    ![...teamLeads.map((t) => t.description), ceo?.description].includes(m.description)
  );
  const programStaff = managements.filter((m) =>
    m.description.includes("Programme Department")
  );

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className="text-center font-poppins text-[24px] text-white">
          Management Overview
        </p>
      </motion.div>

      {/* CEO */}
      {ceo && (
        <section className="mt-10 px-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-lg max-w-3xl mx-auto">
            <h2 className="text-white text-xl font-semibold mb-6 text-center">
              Chief Executive Officer
            </h2>
            <div className="flex justify-center">
              <div className="w-full sm:w-2/3 md:w-1/2">
                <ManagementCard management={ceo} onClick={setSelectedPerson} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Team Leads */}
      {teamLeads.length > 0 && (
        <section className="mt-16 px-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-lg">
            <h2 className="text-white text-xl font-semibold mb-6 text-center">
              Management Team
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {teamLeads.map((m, idx) => (
                <ManagementCard
                  key={`team-${idx}`}
                  management={m}
                  onClick={setSelectedPerson}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Department Heads */}
      {departmentHeads.length > 0 && (
        <section className="mt-16 px-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-lg">
            <h2 className="text-white text-xl font-semibold mb-6 text-center">
              Department Heads
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {departmentHeads.map((m, idx) => (
                <ManagementCard
                  key={`dept-${idx}`}
                  management={m}
                  onClick={setSelectedPerson}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Program Department */}
      {programStaff.length > 0 && (
        <section className="mt-16 px-4 mb-10">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-lg">
            <h2 className="text-white text-xl font-semibold mb-6 text-center">
              Program Department
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {programStaff.map((m, idx) => (
                <ManagementCard
                  key={`prog-${idx}`}
                  management={m}
                  onClick={setSelectedPerson}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Modal */}
      {selectedPerson && (
        <ProfileModal data={selectedPerson} onClose={() => setSelectedPerson(null)} />
      )}
    </>
  );
};

export default SectionWrapper(ManagementTeam, "managementteam");

{/*


import React from "react";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { motion } from 'framer-motion';
import { textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import { managements } from "../constants";

const ManagementCard = ({ management }) => (
  <VerticalTimelineElement
    contentStyle={{
      background: "#1d1836",
      color: "#fff",
      borderRadius: "10px",
      padding: "20px",
    }}
    contentArrowStyle={{ borderRight: "8px solid #232631" }}
    iconStyle={{
      background: management.iconBg,
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
        <img src={management.icon} alt={management.title} className="absolute inset-0 w-full h-full object-contain rounded" />
      </div>
    }
  >
    <h3 className='text-white text-[24px] font-bold'>{management.title}</h3>
    <p className='text-secondary text-[16px] font-semibold' style={{ margin: 0 }}>
      {management.desc}
    </p>
  </VerticalTimelineElement>
);

const ManagementTeam = () => (
  <>
    <motion.div variants={textVariant()}>
      <p className="text-center font-poppins text-[24px] text-white">Management Team</p>
    </motion.div>
    <div className="mt-20 flex flex-col">
      <VerticalTimeline>
        {managements.map((management, index) => (
          <ManagementCard key={`management-${index}`} management={management} />
        ))}
      </VerticalTimeline>
    </div>
  </>
);

export default SectionWrapper(ManagementTeam, "managementteam");
*/}