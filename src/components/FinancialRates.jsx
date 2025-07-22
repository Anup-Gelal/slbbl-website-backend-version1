import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tilt } from "react-tilt";
import { motion } from 'framer-motion';
import { styles } from '../style';
import { fadeIn } from "../utils/motion";
import { SectionWrapper } from "../hoc";

const API_BASE = "http://localhost:8080/api/v1";

const TableCard = ({ index, title, data, columns }) => {
  return (
    <Tilt className="xs:w-[500px] w-full-6xl">
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
                  {columns.map((col, idx) => (
                    <th key={idx} className="py-2 px-4 border-b">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-4 text-white">No data available.</td>
                  </tr>
                ) : (
                  data.map((row) => (
                    <tr key={row.id} className="border-b">
                      <td className="py-2 px-4">{row.id}</td>
                      <td className="py-2 px-4">{row.product}</td>
                      <td className="py-2 px-4">{row.rate}</td>
                      <td className="py-2 px-4">{row.serviceCharge || "-"}</td>
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

const FinancialRates = () => {
  const [loanRates, setLoanRates] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLoanRates = async () => {
      try {
        const res = await axios.get(`${API_BASE}/loan-interest-rates`);
        setLoanRates(res.data || []);
      } catch (err) {
        setError("Failed to load loan interest rates.");
      }
    };

    fetchLoanRates();
  }, []);

  return (
    <>
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      <motion.div variants={fadeIn('0.1', '0.3', 1, 2)}>
        <p className={styles.sectionSubText}>Financial Rates</p>
      </motion.div>

      <motion.p
        variants={fadeIn('0.1', '0.3', 1, 2)}
        className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]"
      >
        Here are the current financial products and their respective rates available at SLBBL.
      </motion.p>

      <div className="mt-20 flex flex-wrap gap-10 justify-center">
        <TableCard
          index={0}
          title="Loan Products Interest Rates"
          data={loanRates}
          columns={["S.N", "Loan Products", "Interest Rates", "Service Charge", "Remarks"]}
        />
      </div>
    </>
  );
};

export default SectionWrapper(FinancialRates, 'financialrates');
