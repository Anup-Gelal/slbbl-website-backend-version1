import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../utils/motion";
import { SectionWrapper } from "../hoc";

const ContactUs = () => {
  const phoneNumbers = [
    { id: 1, number: "011-661060" },
    { id: 2, number: "011-665348" }
  ];
  const email = "info@slbbl.com.np";
  
  return (
    <motion.div
      variants={fadeIn("up", "spring", 0.5, 0.75)}
      className="bg-tertiary p-5 rounded-2xl sm:w-full w-full shadow-lg flex flex-col sm:flex-row gap-8"
    >
      <div className="w-full sm:w-[50%]">
        <h2 className="text-2xl font-bold text-blue-700 mb-3">Contact Us</h2>

        <div className="mt-5">
          <h3 className="text-xl text-secondary">Central Office</h3>
          <p className="text-lg font-medium text-gray-700">Banepa-05, Kavrepalanchok</p>

          <div className="mt-4">
            <h3 className="text-xl text-secondary">Contact Numbers</h3>
            <div className="space-y-3">
              {phoneNumbers.map((phone) => (
                <p key={phone.id}>
                  <a
                    href={`tel:${phone.number}`}
                    className="text-blue-500 hover:text-blue-700 transition duration-300"
                  >
                    {phone.number}
                  </a>
                </p>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-xl text-secondary">Email</h3>
            <p>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=info@slbbl.com.np"
                className="text-blue-500 hover:text-blue-700 transition duration-300"
              >
                Email: info@slbbl.com.np
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Embed Google Map (Expanded horizontally) */}
      <div className="w-full sm:w-[50%]">
        <h3 className="text-xl text-secondary mb-3">Our Location</h3>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3534.717852659279!2d85.52297697525103!3d27.633253776225157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb08cddb9075e3%3A0x9d38947c8f59ea4f!2sSwarojgar%20Laghubitta%20Bittiya%20Sanstha!5e0!3m2!1sen!2snp!4v1741324575766!5m2!1sen!2snp"
          width="100%"
          height="350"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </motion.div>
  );
};

export default SectionWrapper(ContactUs, 'contactus');

{/*
import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../utils/motion";
import { SectionWrapper } from "../hoc";

const ContactUs = () => {
  const phoneNumbers = [
    { id: 1, number: "011-661060" },
    { id: 2, number: "011-665348" }
  ];
  const email = "info@slbbl.com.np";

  return (
    <motion.div
      variants={fadeIn("up", "spring", 0.5, 0.75)}
      className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full shadow-lg"
    >
      <h2 className="text-2xl font-bold text-blue-700 mb-3">Contact Us</h2>

      <div className="mt-5">
        <h3 className="text-xl text-secondary">Central Office</h3>
        <p className="text-lg font-medium text-gray-700">Banepa-05, Kavrepalanchok</p>

        <div className="mt-4">
          <h3 className="text-xl text-secondary">Contact Numbers</h3>
          <div className="space-y-3">
            {phoneNumbers.map((phone) => (
              <p key={phone.id}>
                <a
                  href={`tel:${phone.number}`}
                  className="text-blue-500 hover:text-blue-700 transition duration-300"
                >
                  {phone.number}
                </a>
              </p>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-xl text-secondary">Email</h3>
          <p>
            <a
              href={`mailto:${email}`}
              className="text-blue-500 hover:text-blue-700 transition duration-300"
            >
              Email: {email}
            </a>
          </p>
        </div>

        <div className="mt-4">
          <h3 className="text-xl text-secondary">Open Gmail</h3>
          <p>
            <a
              href="https://mail.google.com/"
              className="text-blue-500 hover:text-blue-700 transition duration-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Gmail
            </a>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SectionWrapper(ContactUs, 'contactus');
*/}