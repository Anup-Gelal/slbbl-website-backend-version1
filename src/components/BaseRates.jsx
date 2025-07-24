import React, { useEffect, useState } from "react";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import axios from "axios";
import { styles } from "../style";
import { fadeIn } from "../utils/motion";
import { SectionWrapper } from "../hoc";

const API_BASE = "https://slbbl-website-backend-version1.onrender.com/api/v1";
// const API_BASE = "https://slbbl-website-backend-version1.onrender.com/api/v1"; // Adjust if needed

const TableCard = ({ index, title, data }) => {
  return (
    <Tilt className="xs:w-[500px] w-full">
      <motion.div
        variants={fadeIn("right", "spring", index * 0.5, 0.75)}
        className="w-full bg-gradient-to-r from-blue-500 via-teal-500 to-blue-700 p-[1px] rounded-[20px] shadow-card"
      >
        <div
          options={{
            max: 45,
            scale: 1,
            speed: 450,
          }}
          className="bg-tertiary rounded-[20px] py-5 px-12 min-h-[300px] flex flex-col justify-evenly items-center"
        >
          <h3 className="text-white text-[20px] font-bold text-center">{title}</h3>

          <div className="overflow-x-auto mt-4 w-full">
            <table className="table-auto text-white text-sm w-full">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Month</th>
                  <th className="py-2 px-4 border-b">Rate</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx} className="border-b border-white/30">
                    <td className="py-2 px-4">{row.month}</td>
                    <td className="py-2 px-4">{row.rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </Tilt>
  );
};

const BaseRates = () => {
  const [rates, setRates] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await axios.get(`${API_BASE}/base-rates`);
        setRates(res.data || []);
      } catch (err) {
        setError("Failed to load base rate data");
      }
    };
    fetchRates();
  }, []);

  return (
    <>
      <motion.div variants={fadeIn("up", "spring", 0.1, 1)}>
        <p className="text-green-700">Monthly Base Rate</p>
      </motion.div>

      {error && (
        <p className="text-red-400 text-lg mt-4">{error}</p>
      )}

      <div className="mt-20 flex flex-wrap gap-10">
        <TableCard index={0} title="Base Rate Table" data={rates} />
      </div>
    </>
  );
};

export default SectionWrapper(BaseRates, "baserates");
