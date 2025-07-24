import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";
import { styles } from "../style";
import { BallCanvas } from "./canvas";

const API_BASE = "https://slbbl-website-backend-version1.onrender.com/api/v1";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/products`);
        setProducts(res.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, []);

  const getIconUrl = (iconPath) =>
    `${API_BASE.replace(/\/api\/v1\/?$/, "")}${iconPath}`;

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className= "text-green-600 text-center font-poppins">
          Our Products
        </p>
      </motion.div>

      <div className="flex flex-col items-center">
        <div className="flex flex-wrap justify-center gap-10 mt-6">
          {products.map((product, idx) => (
            <div
              key={product.id}
              className="relative w-28 h-28 cursor-pointer"
              onMouseEnter={() => setHoveredProductId(product.id)}
              onMouseLeave={() => setHoveredProductId(null)}
              onClick={() => setSelectedProduct(product)}
            >
              <BallCanvas icon={getIconUrl(product.icon)} />
              {hoveredProductId === product.id && (
                <div className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 bg-black text-white text-xs p-1 rounded shadow-lg">
                  {product.title}
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedProduct && (
          <div className="mt-10 p-6 bg-gray-800 text-white rounded-lg w-full max-w-lg shadow-lg">
            <h2 className="text-xl font-semibold">{selectedProduct.title}</h2>
            <p className="mt-2">{selectedProduct.description}</p>
            <button
              className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white shadow transition-transform transform hover:scale-105"
              onClick={() => setSelectedProduct(null)}
            >
              ✖ Close
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default SectionWrapper(Products, "products");

{/*

import { SectionWrapper } from "../hoc";
import React, { useState } from "react";
import { motion } from 'framer-motion'
import { textVariant } from "../utils/motion"
import { styles } from '../style'
import { BallCanvas } from "./canvas";
import { products } from "../constants";

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleBallClick = (product) => {
   setSelectedProduct(product);
  };

  return (
    <>
     <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center font-poppins`}>
          Our Products
        </p>
      </motion.div>
     <div className="flex flex-col items-center">
      <div className="flex flex-row flex-wrap justify-center gap-10">
        {products.map((product, index) => (
          <div
            className="w-28 h-28"
            key={product.title + index}
            onClick={() => handleBallClick(product)}
          >
            <BallCanvas icon={product.icon} />
          </div>
        ))}
      </div>
      {selectedProduct && (
        <div className="mt-10 text-center">
          <h2 className="text-xl font-semibold">{selectedProduct.title}</h2>
          <p>{selectedProduct.description}</p>
        </div>
      )}
    </div>
    </>
   
  );
};


export default SectionWrapper(Products, 'products');*/}