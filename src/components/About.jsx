import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { SectionWrapper } from "@/hoc";

const API_BASE = "http://localhost:8080/api/v1";
const FILE_BASE = API_BASE.replace(/\/api\/v1\/?$/, "");

// Helper to correctly build image URLs with /uploads path
const getImageUrl = (image_url, type) => {
  const basePath = `${FILE_BASE}/uploads/about/${type}s/`;

  if (
    image_url.startsWith(`/uploads/about/${type}s/`) ||
    image_url.startsWith(`uploads/about/${type}s/`)
  ) {
    return image_url.startsWith("/")
      ? `${FILE_BASE}${image_url}`
      : `${FILE_BASE}/${image_url}`;
  }

  if (
    image_url.startsWith(`/about/${type}s/`) ||
    image_url.startsWith(`about/${type}s/`)
  ) {
    const cleanedPath = image_url.startsWith("/") ? image_url.substring(1) : image_url;
    return `${FILE_BASE}/uploads/${cleanedPath}`;
  }

  return `${basePath}${image_url}`;
};

const MessageCard = ({ description, image_url }) => {
  const [showFull, setShowFull] = useState(false);
  const toggleShow = () => setShowFull((prev) => !prev);

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl w-full max-w-md mx-auto shadow-lg mb-6">
      <div className="w-full h-[230px] mb-3">
        <img
          src={getImageUrl(image_url, "message")}
          alt="CEO"
          className="w-full h-full object-contain rounded-2xl"
          onError={(e) => (e.target.src = "/fallback.jpg")}
        />
      </div>
      <p className="text-[14px] text-green-600">
        {showFull
          ? description
          : description.slice(0, 150) + (description.length > 150 ? "..." : "")}
      </p>
      {description.length > 150 && (
        <button
          onClick={toggleShow}
          className="mt-2 text-blue-400 font-semibold text-sm"
        >
          {showFull ? "Show Less" : "Read More"}
        </button>
      )}
    </div>
  );
};

const VisionObjectiveCard = () => (
  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl w-full max-w-md mx-auto shadow-lg mb-6">
    <h3 className="text-xl font-bold mb-2 text-center text-green-600">हाम्रो दृष्टिकोण</h3>
    <p className="text-[14px] leading-6 text-green-600 mb-4">
      हाम्रो दृष्टिकोण उद्यमशीलता र साना व्यवसायहरूलाई नवीन र दिगो वित्तीय समाधानहरू प्रदान गरेर 
        उनीहरूको सशक्तीकरण गर्नु हो। हामी आर्थिक विकास, स्थायित्व र सबै वर्गमा वित्तीय पहुँच विस्तार 
        गर्न प्रतिबद्ध छौं।
    </p>
    <h3 className="text-xl font-bold text-green-600 mb-2 text-center">हाम्रो उद्देश्य</h3>
    <p className="text-[14px] leading-6 text-green-600">
    
         हाम्रो उद्देश्य एक सबल र पहुँचयोग्य वित्तीय प्रणाली निर्माण गर्नु हो जसले व्यक्तिहरू र 
        व्यवसायहरूलाई उनीहरूको लक्ष्य प्राप्तिमा सहयोग पुर्‍याओस्। हामी व्यक्तिगत सेवा, उद्यमशीलताको 
        प्रवर्द्धन र दिगो विकासको लागि उत्तरदायी बैंकिङ समाधानहरू प्रदान गर्न प्रयासरत छौं।
    </p>
  </div>
);

const StatsCard = ({ title, value, icon_url }) => (
  <div className="bg-tertiary p-5 rounded-2xl w-full max-w-md mx-auto shadow-md mb-6">
    <div className="w-full h-[230px] flex items-center justify-center bg-gradient-to-r from-green-500 to-indigo-600 text-white rounded-2xl">
      <img
        src={getImageUrl(icon_url, "stat")}
        alt={title}
        className="w-24 h-34 object-contain mr-3"
        onError={(e) => (e.target.src = "/fallback.jpg")}
      />
      <h3 className="text-2xl font-bold">{title}</h3>
    </div>
    <div className="mt-5 text-center">
      <p className="text-[16px] text-secondary">{value}</p>
    </div>
  </div>
);

const Slideshow = ({ images }) => {
  if (!images.length) return null;

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: true,
    pauseOnHover: true,
    centerMode: false,
  };

  return (
    <div className="max-w-[90vw] mx-auto rounded-2xl overflow-hidden shadow-lg mb-10">
      <Slider {...settings}>
        {images.map((img, i) => (
          <div key={i}>
            <img
              src={getImageUrl(img.image_url, "slide")}
              alt={`slide-${i}`}
              className="w-full h-[700px] object-contain rounded-2xl"
              onError={(e) => (e.target.src = "/fallback.jpg")}
              loading="lazy"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};


const About = () => {
  const [messages, setMessages] = useState([]);
  const [slides, setSlides] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      axios.get(`${API_BASE}/about/messages`),
      axios.get(`${API_BASE}/about/slides`),
      axios.get(`${API_BASE}/about/stats`),
    ])
      .then(([messagesRes, slidesRes, statsRes]) => {
        setMessages(messagesRes.data || []);
        setSlides(slidesRes.data || []);
        setStats(statsRes.data || []);
      })
      .catch(() => {
        setError("Failed to load data.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <div className="px-4">
      {/* Slideshow */}
      <Slideshow images={slides} />

      {/* CEO Message & Vision */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-10">
        <div className="w-full md:w-1/2">
          <p className="mb-4 text-green-600 text-[17px] leading-[30px] font-poppins font-bold">
            प्रमुख कार्यकारी अधिकृतको सन्देश
            <br />
            <br />
          
          </p>
          {messages.map((msg, i) => (
            <MessageCard key={i} {...msg} />
          ))}
        </div>

        <div className="w-full md:w-1/2">
          <p className="mb-4 text-green-700 text-[17px] leading-[30px] font-poppins font-bold">
            स्वरोजगार लघुवित्त वित्तीय संस्था लिमिटेड कम्पनी ऐन २०६३ अनुसार दर्ता भएको एक माइक्रोफाइनान्स 
            विकास बैंक हो जुन नेपालका काभ्रेपलाञ्चोक जिल्लाको बनेपा नगरपालिकामा अवस्थित छ। SLBBL 
            सन् २००९ (वि.सं. २०६६) मा स्थापना भएको हो र नेपाल राष्ट्र बैंक (नेपालको केन्द्रीय बैंक) 
            बाट "घ" वर्गको बैंकको रूपमा सेवा सञ्चालनको अनुमति प्राप्त गरेको छ। यस बैंकको मुख्य उद्देश्य 
            भनेको समूहगत पद्धतिमा महिलाहरूलाई लक्षित गरी सूक्ष्म वित्तीय सेवा प्रदान गरेर गरिब तथा पछाडि 
            परेका समुदायहरूको सामाजिक-आर्थिक अवस्था उकास्नु हो।
          </p>
          <VisionObjectiveCard />
        </div>
      </div>

      {/* Stats Header */}
      <p className="mt-10 text-[20px] max-w-3xl leading-[30px] text-center text-green-600 font-poppins font-bold mx-auto">
        एक नजरमा स्वरोजगार
        <br />
        (असार २०८१ सम्मको तथ्याङ्क)
      </p>

      {/* Stats Cards */}
      <div className="mt-10 flex flex-wrap justify-center gap-7">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(About, "about");

{/* 
   स्वरोजगार लघुवित्त वित्तीय संस्था लिमिटेड कम्पनी ऐन २०६३ अनुसार दर्ता भएको एक माइक्रोफाइनान्स 
            विकास बैंक हो जुन नेपालका काभ्रेपलाञ्चोक जिल्लाको बनेपा नगरपालिकामा अवस्थित छ। SLBBL 
            सन् २००९ (वि.सं. २०६६) मा स्थापना भएको हो र नेपाल राष्ट्र बैंक (नेपालको केन्द्रीय बैंक) 
            बाट "घ" वर्गको बैंकको रूपमा सेवा सञ्चालनको अनुमति प्राप्त गरेको छ। यस बैंकको मुख्य उद्देश्य 
            भनेको समूहगत पद्धतिमा महिलाहरूलाई लक्षित गरी सूक्ष्म वित्तीय सेवा प्रदान गरेर गरिब तथा पछाडि 
            परेका समुदायहरूको सामाजिक-आर्थिक अवस्था उकास्नु हो।
             हाम्रो दृष्टिकोण उद्यमशीलता र साना व्यवसायहरूलाई नवीन र दिगो वित्तीय समाधानहरू प्रदान गरेर 
        उनीहरूको सशक्तीकरण गर्नु हो। हामी आर्थिक विकास, स्थायित्व र सबै वर्गमा वित्तीय पहुँच विस्तार 
        गर्न प्रतिबद्ध छौं।

         हाम्रो उद्देश्य एक सबल र पहुँचयोग्य वित्तीय प्रणाली निर्माण गर्नु हो जसले व्यक्तिहरू र 
        व्यवसायहरूलाई उनीहरूको लक्ष्य प्राप्तिमा सहयोग पुर्‍याओस्। हामी व्यक्तिगत सेवा, उद्यमशीलताको 
        प्रवर्द्धन र दिगो विकासको लागि उत्तरदायी बैंकिङ समाधानहरू प्रदान गर्न प्रयासरत छौं।
import React from "react";
import { messages, swarojgarData } from "../constants";
import { SectionWrapper } from "../hoc";
import { Tilt } from "react-tilt";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { slideshowImages } from "../constants";

// Slideshow Component
const Slideshow = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 30,
    arrows: false,
  };

  return (
    <Slider {...settings} className="w-full h-[600px] mx-auto">
      {slideshowImages.map((img, index) => (
        <div key={index} className="w-full h-[600px] mx-auto">
          <img
            src={img}
            alt={`slide-${index}`}
            className="w-full h-full object-cover rounded-2xl"
            style={{ imageRendering: "high-quality" }}
          />
        </div>
      ))}
    </Slider>
  );
};

// Message Card
const MessageCard = ({ description, image }) => {
  return (
    <Tilt
      options={{ max: 45, scale: 1, speed: 450 }}
      className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl w-full max-w-md mx-auto shadow-lg"
    >
      <div className="w-full h-[230px]">
        <img
          src={image}
          alt="CEO"
          className="w-full h-full object-contain rounded-2xl"
        />
      </div>
      <div className="mt-5">
        <p className="text-secondary text-[14px]">{description}</p>
      </div>
    </Tilt>
  );
};

// Vision & Objective Card
const VisionObjectiveCard = () => (
  <Tilt
    options={{ max: 45, scale: 1, speed: 450 }}
    className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl w-full max-w-md mx-auto shadow-lg"
  >
    
    <div>
      <h3 className="text-xl font-bold text-white mb-2 text-center">Our Vision</h3>
      <p className="text-[14px] text-secondary leading-6">
        Our vision is to be a leading financial institution that empowers entrepreneurs 
        and small businesses by providing them with innovative and sustainable financial solutions. 
        We aim to foster economic growth, stability, and financial inclusion across all sectors.
      </p>
      <h3 className="text-xl font-bold text-white mt-4 mb-2 text-center">Our Objective</h3>
      <p className="text-[14px] text-secondary leading-6">
        Our objective is to create a robust and accessible financial system that supports 
        individuals and businesses in achieving their goals. We strive to offer personalized 
        financial services, encourage entrepreneurship, and drive sustainable development 
        through responsible banking solutions.
      </p>
    </div>
  </Tilt>
);

// Stats Card
const StatsCard = ({ title, value, icon }) => (
  <Tilt
    options={{ max: 45, scale: 1, speed: 450 }}
    className="bg-tertiary p-5 rounded-2xl w-full max-w-md mx-auto"
  >
    <div className="w-full h-[230px] flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl">
      <img src={icon} alt={title} className="w-24 h-34 object-contain mr-3" />
      <h3 className="text-2xl font-bold">{title}</h3>
    </div>
    <div className="mt-5 text-center">
      <p className="text-[16px] text-secondary">{value}</p>
    </div>
  </Tilt>
);

// About Component
const About = () => {
  return (
    <div className="px-4">
     
      <div className="w-full max-w-5xl mx-auto mb-10">
        <Slideshow />
      </div>

     
      <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-10">
      
        <div className="w-full md:w-1/2">
          <p className="mb-4 text-primary text-[17px] leading-[30px] font-poppins font-bold">
            Message From CEO
            <br /><br />
            Manoj Krishna Uprety
          </p>
          {messages.map((message, index) => (
            <MessageCard key={`message-${index}`} {...message} />
          ))}
        </div>

       
        <div className="w-full md:w-1/2">
          <p className="mb-4 text-blue-800 text-[17px] leading-[30px] font-poppins font-bold">
            Swarojgar Laghubitta Bittiya Sanstha Ltd registered under the Company Act 2063 as a Microfinance Development Bank located in Banepa Municipality of Kavrepalanchowk district, Nepal. SLBBL was established in 2009 A.D. (2066 B.S.) and permitted to operate service as a class “D” Bank by Nepal Rastra Bank (Central Bank of Nepal). The main objective of the establishment of the bank is uplifting socio-economic status of the poor and backward communities by providing Micro-Finance services to female group members on group-approach basis.
          </p>
          <VisionObjectiveCard />
        </div>
      </div>

    
      <p className="mt-10 text-secondary text-[20px] max-w-3xl leading-[30px] text-center font-poppins font-bold mx-auto">
        Swarojgar at a Glance
        <br />
        As of Ashar 2081
      </p>

     
      <div className="mt-10 flex flex-wrap justify-center gap-7">
        {swarojgarData.map((stat, index) => (
          <StatsCard key={`stat-${index}`} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(About, 'about');
*/}

{/*
import React,{useState} from "react";
import "react-vertical-timeline-component/style.min.css";
import { motion } from 'framer-motion';
import { fadeIn } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import { messages, swarojgarData } from "../constants";
import { Tilt } from "react-tilt";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { slideshowImages } from "../constants";


const Slideshow = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };
  return (
    <Slider {...settings} className="w-full h-[300px]">
      {slideshowImages.map((img, index) => (
        <div key={index} className="w-full h-[300px]">
          <img src={img} alt={`slide-${index}`} className="w-full h-full object-cover rounded-2xl" />
        </div>
      ))}
    </Slider>
  );
};


// Message Card component
const MessageCard = ({
  description,
  image,
  index
}) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className='bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full'
      >
        <div className='relative w-full h-[230px]'>
          <img
            src={image}
            alt='CEO'
            className='w-full h-full object-contain rounded-2xl'
          />
        </div>

        <div className='mt-5'>
          <p className='mt-2 text-secondary text-[14px]'>{description}</p>
        </div>
      </Tilt>
    </motion.div>
  );
};

// Stats Card component
const StatsCard = ({ title, value, icon, index }) => (
  <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
    <Tilt
      options={{
        max: 45,
        scale: 1,
        speed: 450,
      }}
      className='bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full'
    >
      <div className='relative w-full h-[230px]'>
        <div className='w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl'>
          <img src={icon} alt={title} className="w-24 h-34 object-contain mr-3" />
          <h3 className='text-2xl font-bold'>{title}</h3>
        </div>
      </div>
      <div className='mt-5 text-center'>
        <p className='text-[16px] text-secondary'>{value}</p>
      </div>
    </Tilt>
  </motion.div>
);


// About component
const About = () => {
  return (
    <>
    
     <div className='w-full max-w-5xl mx-auto mb-10'>
        <Slideshow />
      </div>

      <motion.p
        variants={fadeIn('0.1', "0.3", 1, 2)}
        className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px] text-center font-poppins'
      >
        Message From CEO
        <br /><br />
        Manoj Krishna Uprety
        <br />
      </motion.p>
      
      <div className='mt-20 flex flex-wrap gap-7'>
        {messages.map((message, index) => (
          <MessageCard key={`message-${index}`} index={index} {...message} />
        ))}
      </div>

      
      <motion.p
        variants={fadeIn('0.1', "0.3", 1, 2)}
        className='mt-10 text-secondary text-[20px] max-w-3xl leading-[30px] text-center font-poppins font-bold'
      >
        Swarojgar at a Glance
        <br />
        As of Ashar 2081
      </motion.p>

      <div className='mt-20 flex flex-wrap gap-7'>
        {swarojgarData.map((stat, index) => (
          <StatsCard key={`stat-${index}`} index={index} {...stat} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, 'about');

*/}

