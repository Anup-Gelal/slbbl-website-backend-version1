import React, { useState } from "react";
import { motion } from "framer-motion";
import { SectionWrapper } from "@/hoc";

const Emicalculator = () => {
  const [loanAmount, setLoanAmount] = useState(100);
  const [interestRate, setInterestRate] = useState(10);
  const [installmentNo, setInstallmentNo] = useState(12); // default to 12 installments
  const [disburseDate, setDisburseDate] = useState("2025/03/10");
  const [gracePeriod, setGracePeriod] = useState(0);
  const [meetingRepeat, setMeetingRepeat] = useState("Fixed Dates");
  const [interval, setInterval] = useState(30); // default to 30 days
  const [use360Days, setUse360Days] = useState(false);
  const [schedule, setSchedule] = useState([]);

  // EMI Calculation Function (Assumed equal installment calculation)
  const calculateemicalculator = () => {
    const principal = loanAmount;
    const rateOfInterest = interestRate / 12 / 100;
    const tenureInMonths = installmentNo;
    const emi = (principal * rateOfInterest * Math.pow(1 + rateOfInterest, tenureInMonths)) / (Math.pow(1 + rateOfInterest, tenureInMonths) - 1);

    let currentBalance = principal;
    const newSchedule = [];
    for (let i = 1; i <= tenureInMonths; i++) {
      const interest = currentBalance * rateOfInterest;
      const principalPayment = emi - interest;
      currentBalance -= principalPayment;

      // Formatting the dates
      const date = new Date(new Date(disburseDate).setMonth(new Date(disburseDate).getMonth() + i));
      const formattedDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;

      newSchedule.push({
        sn: i,
        loanAmount: principal,
        date: formattedDate,
        installment: emi.toFixed(2),
        principal: principalPayment.toFixed(2),
        interest: interest.toFixed(2),
        balance: currentBalance.toFixed(2),
      });
    }
    setSchedule(newSchedule);
  };

  return (
    <motion.div
      className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-center text-3xl font-semibold text-gray-800 mb-8">
          Repayment Schedule Calculator
        </h2>

        <div className="p-6 shadow-md rounded-lg bg-gray-50 mb-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="loanAmount" className="text-sm font-medium text-gray-700">
                Loan Amount
              </label>
              <input
                id="loanAmount"
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                placeholder="Enter loan amount"
                className="w-full mt-2 p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-400 bg-white"
              />
            </div>
            <div>
              <label htmlFor="interestRate" className="text-sm font-medium text-gray-700">
                Interest Rate (Annual %)
              </label>
              <input
                id="interestRate"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="Enter interest rate"
                className="w-full mt-2 p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-400 bg-white"
              />
            </div>
            <div>
              <label htmlFor="installmentNo" className="text-sm font-medium text-gray-700">
                Installment Number
              </label>
              <input
                id="installmentNo"
                type="number"
                value={installmentNo}
                onChange={(e) => setInstallmentNo(e.target.value)}
                placeholder="Enter number of installments"
                className="w-full mt-2 p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-400 bg-white"
              />
            </div>
            <div>
              <label htmlFor="disburseDate" className="text-sm font-medium text-gray-700 bg-white">
                Disburse Date (YYYY/MM/DD)
              </label>
              <input
                id="disburseDate"
                type="date"
                value={disburseDate}
                onChange={(e) => setDisburseDate(e.target.value)}
                className="w-full mt-2 p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
            <div>
              <label htmlFor="meetingRepeat" className="text-sm font-medium text-gray-700">
                Meeting Repeat
              </label>
              <select
                id="meetingRepeat"
                value={meetingRepeat}
                onChange={(e) => setMeetingRepeat(e.target.value)}
                className="w-full mt-2 p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Fixed Dates">Fixed Dates</option>
                <option value="Fixed Interval">Fixed Interval</option>
              </select>
            </div>
            <div>
              <label htmlFor="interval" className="text-sm font-medium text-gray-700">
                Interval (Days)
              </label>
              <input
                id="interval"
                type="number"
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                placeholder="Enter interval in days"
                className="w-full mt-2 p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-400 bg-white"
              />
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={calculateemicalculator}
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
            >
              Calculate Repayment Schedule
            </button>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <p className="text-lg font-medium text-gray-800">Repayment Schedule</p>
          <div className="bg-gray-50 p-6 shadow-md rounded-lg">
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">SN</th>
                  <th className="px-4 py-2 border">Loan Amount</th>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Installment</th>
                  <th className="px-4 py-2 border">Principal</th>
                  <th className="px-4 py-2 border">Interest</th>
                  <th className="px-4 py-2 border">Balance</th>
                </tr>
              </thead>
              <tbody>
                {schedule.length > 0 ? (
                  schedule.map((item) => (
                    <tr key={item.sn}>
                      <td className="px-4 py-2 border">{item.sn}</td>
                      <td className="px-4 py-2 border">{item.loanAmount}</td>
                      <td className="px-4 py-2 border">{item.date}</td>
                      <td className="px-4 py-2 border">{item.installment}</td>
                      <td className="px-4 py-2 border">{item.principal}</td>
                      <td className="px-4 py-2 border">{item.interest}</td>
                      <td className="px-4 py-2 border">{item.balance}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">No records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SectionWrapper(Emicalculator, 'emicalculator');


{/*
import React, { useState } from "react";
import { motion } from "framer-motion";
import { SectionWrapper } from "@/hoc";

const EmiCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [loanTenure, setLoanTenure] = useState(0);
  const [emi, setEmi] = useState(0);
  const [totalPayable, setTotalPayable] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  // EMI Calculation Function
  const calculateEmi = () => {
    const principal = loanAmount;
    const rateOfInterest = interestRate / 12 / 100;
    const tenureInMonths = loanTenure;

    const emi = (principal * rateOfInterest * Math.pow(1 + rateOfInterest, tenureInMonths)) / (Math.pow(1 + rateOfInterest, tenureInMonths) - 1);
    const totalAmount = emi * tenureInMonths;
    const interest = totalAmount - principal;

    setEmi(emi.toFixed(2));
    setTotalPayable(totalAmount.toFixed(2));
    setTotalInterest(interest.toFixed(2));
  };

  return (
    <motion.div
      className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-center text-3xl font-semibold text-gray-800 mb-8">
          EMI Calculator
        </h2>

        <div className="p-6 shadow-md rounded-lg bg-gray-50 mb-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="loanAmount" className="text-sm font-medium text-gray-700">
                Loan Amount
              </label>
              <input
                id="loanAmount"
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                placeholder="Enter loan amount"
                className="w-full mt-2 p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-400 bg-white"
              />
            </div>
            <div>
              <label htmlFor="interestRate" className="text-sm font-medium text-gray-700">
                Interest Rate (Annual %)
              </label>
              <input
                id="interestRate"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="Enter interest rate"
                className="w-full mt-2 p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-400 bg-white-100"
              />
            </div>
            <div>
              <label htmlFor="loanTenure" className="text-sm font-medium text-gray-700">
                Loan Tenure (Months)
              </label>
              <input
                id="loanTenure"
                type="number"
                value={loanTenure}
                onChange={(e) => setLoanTenure(e.target.value)}
                placeholder="Enter loan tenure"
                className="w-full mt-2 p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-400 bg-white"
              />
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={calculateEmi}
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
            >
              Calculate EMI
            </button>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <p className="text-lg font-medium text-gray-800">Results</p>
          <div className="bg-gray-50 p-6 shadow-md rounded-lg">
            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="text-gray-600">EMI</p>
                <p className="font-semibold text-gray-800">{emi}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Total Payable</p>
                <p className="font-semibold text-gray-800">{totalPayable}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Total Interest</p>
                <p className="font-semibold text-gray-800">{totalInterest}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SectionWrapper(EmiCalculator, 'emicalculator');
 */}