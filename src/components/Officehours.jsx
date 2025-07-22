import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from "../utils/motion"; 
import { Tilt } from 'react-tilt';
import { SectionWrapper } from "../hoc";

const OfficeHoursCard = ({ hours, index }) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        options={{
          max: 15,
          scale: 1.05,
          speed: 400,
        }}
        className='bg-white p-6 rounded-2xl sm:w-[360px] w-full shadow-lg'
      >
        <div className='text-center'>
          <h3 className='text-2xl font-bold text-blue-700 mb-3'>Office Hours</h3>
          <p className='text-lg text-gray-800 font-medium'>{hours}</p>
        </div>
      </Tilt>
    </motion.div>
  );
};


const OfficeHours = () => {
  const officeHours = "Operating Hours: Sunday to Friday - 9:00 AM to 5:00 PM";

  return (
    <>
      <motion.p
        variants={fadeIn('0.1', "0.3", 1, 2)}
        className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px] text-center font-poppins'
      >
        Our Office Hours
        <br />
        Please visit us during the following hours:
      </motion.p>

      <div className='mt-10 flex flex-wrap gap-7 justify-center'>
        <OfficeHoursCard index={0} hours={officeHours} />
      </div>
    </>
  );
};

export default SectionWrapper(OfficeHours, 'officehours');