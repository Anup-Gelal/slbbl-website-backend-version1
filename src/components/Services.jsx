import React, { useEffect, useState } from "react";
import { Tilt } from "react-tilt";
import axios from "axios";
import { styles } from "../style";
import { textVariant } from "../utils/motion"; 
import { SectionWrapper } from "../hoc";

const API_BASE = "http://localhost:8080/api/v1";

const ServiceCard = ({ title, icon, description }) => {
  const imgSrc = `${API_BASE.replace(/\/api\/v1\/?$/, "")}${icon}`;

  return (
    <Tilt className="xs:w-[250px] w-full">
      <div className="w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card">
        <div className="bg-tertiary rounded-[20px] py-5 px-6 min-h-[320px] flex justify-evenly items-center flex-col text-center">
          <img
            src={imgSrc}
            alt={title}
            className="w-16 h-16 object-contain mb-2"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/fallback-icon.png"; // optional fallback
            }}
          />
          <h3 className="text-white text-[20px] font-bold">{title}</h3>
          <p className="text-secondary text-[14px]">{description}</p>
        </div>
      </div>
    </Tilt>
  );
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${API_BASE}/services`);
        setServices(res.data || []);
      } catch (err) {
        console.error("Failed to fetch services", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <>
      <div>
        <p className="text-green-700 text-center font-poppins">
          Our Services
        </p>
      </div>

      {loading ? (
        <p className="text-center mt-10 text-gray-500">Loading services...</p>
      ) : (
        <div className="mt-20 flex flex-wrap gap-10 justify-center">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              icon={service.icon}
              description={service.description}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default SectionWrapper(Services, "services");


{/*
import React from "react"
import { Tilt } from "react-tilt"
import { motion } from 'framer-motion'
import { styles } from '../style'
import { services } from "../constants/index"
import { fadeIn, textVariant } from "../utils/motion"
import { SectionWrapper } from "../hoc"

const ServiceCard = ({ index, title, icon }) => {
  return (
    <Tilt className='xs:w-[250px] w-full'>
      <motion.div
        variants={fadeIn("right", "spring", index * 0.5, 0.75)}
        className='w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card'
      >
        <div
          options={{
            max: 45,
            scale: 1,
            speed: 450,
          }}
          className='bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col'
        >
          <img
            src={icon}
            alt='slbbl'
            className='w-16 h-16 object-contain'
          />

          <h3 className='text-white text-[20px] font-bold text-center'>
            {title}
          </h3>
        </div>
      </motion.div>
    </Tilt>
  )
}

const Services = () => {

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center font-poppins`}>
          Our Services
        </p>
      </motion.div>

      <motion.p variants={fadeIn('0.1', "0.3", 1, 2)} className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px] text-center font-poppins'>
      </motion.p>
      <div className='mt-20 flex flex-wrap gap-10'>
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Services, 'services');

*/}
