import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tilt } from "react-tilt";
import { motion } from 'framer-motion';
import { styles } from '../style';
import { fadeIn } from "../utils/motion";
import { SectionWrapper } from "../hoc";

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
                  <th className="py-2 px-4 border-b">S.N</th>
                  <th className="py-2 px-4 border-b">Saving</th>
                  <th className="py-2 px-4 border-b">Minimum Saving</th>
                  <th className="py-2 px-4 border-b">Interest Rates</th>
                  <th className="py-2 px-4 border-b">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {!data || data.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-4 text-center text-white">
                      No data available.
                    </td>
                  </tr>
                ) : (
                  data.map((row) => (
                    <tr key={row.id} className="border-b">
                      <td className="py-2 px-4">{row.id}</td>
                      <td className="py-2 px-4">{row.name}</td>
                      <td className="py-2 px-4">{row.minSaving ? `${row.minSaving}/-` : "-"}</td>
                      <td className="py-2 px-4">{row.interestRate || "-"}</td>
                      <td className="py-2 px-4">{row.remarks || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </Tilt>
  );
};

const SavingAccountInterestRates = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token"); // use if API needs auth

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/v1/saving-interest-rates", {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });
        setData(res.data);
      } catch (err) {
        setError("Failed to load saving interest rates");
      }
    };

    fetchData();
  }, [token]);

  return (
    <>
      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

      <motion.div variants={fadeIn('0.1', '0.3', 1, 2)}>
        <p className={styles.sectionSubText}>Saving Account Interest Rate</p>
      </motion.div>

      <motion.p
        variants={fadeIn('0.1', '0.3', 1, 2)}
        className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]"
      >
        Here are the current saving account interest rates available at SLBBL.
      </motion.p>

      <div className="mt-20 flex flex-wrap gap-10 justify-center">
        <TableCard index={0} title="Saving Account Interest Rates" data={data} />
      </div>
    </>
  );
};

export default SectionWrapper(SavingAccountInterestRates, 'savingaccountinterestrates');
