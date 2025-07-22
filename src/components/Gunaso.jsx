import React, { useState } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../utils/motion";
import { SectionWrapper } from "@/hoc";
import emailjs from "emailjs-com";

const Gunaso = () => {
  const [formData, setFormData] = useState({
    date: "",
    name: "",
    address: "",
    phone: "",
    email: "",
    complaintBranch: "", // "छ" or "छैन"
    complaintType: "", // Added for complaint type selection
    memberId: "",
    complaintDetails: "",
    previousResponse: "",
    proof: null, // For file uploads
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, proof: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Form Data
    const { name, email, phone, complaintDetails, complaintType, complaintBranch, memberId, previousResponse, proof } = formData;

    const emailData = {
      to_name: "Support Team", // Or the recipient's name
      from_name: name,
      from_email: email,
      phone: phone,
      complaint_type: complaintType,
      complaint_details: complaintDetails,
      //complaint_branch: complaintBranch,
      //member_id: memberId,
      previous_response: previousResponse,
      proof: proof ? proof.name : "No file uploaded", // If a file is uploaded, use its name
    };

    // Sending email using EmailJS
    emailjs.send("Gunaso", "complainsubmission", emailData, "qGvuAiqoJg_2eK3Hg")
      .then(
        (result) => {
          alert("Your complaint has been submitted successfully!");
          setFormData({
            date: "",
            name: "",
            address: "",
            phone: "",
            email: "",
            complaintBranch: "",
            complaintType: "",
            memberId: "",
            complaintDetails: "",
            previousResponse: "",
            proof: null,
          });
        },
        (error) => {
          alert("An error occurred. Please try again later.");
        }
      );
  };

  return (
    <motion.div
      variants={fadeIn("up", "spring", 0.5, 1)}
      className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen mt-20"
    >
      {/* Page Title */}
      <motion.h2
        variants={fadeIn("up", "spring", 0.5, 1)}
        className="text-2xl font-bold text-blue-700 mb-6 text-center"
      >
        📢 गुनासो/प्रतिक्रिया पेश गर्नुहोस्
      </motion.h2>

      {/* Complaint Info Section */}
      <motion.div
        variants={fadeIn("up", "spring", 0.7, 1)}
        className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 transition-all hover:shadow-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Complaint Date */}
          <motion.input
            variants={fadeIn("up", "spring", 0.9, 1)}
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500"
          />

          {/* Name */}
          <motion.input
            variants={fadeIn("up", "spring", 1.1, 1)}
            type="text"
            name="name"
            placeholder="गुनासो गर्नेको नाम"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500"
          />

          {/* Address */}
          <motion.input
            variants={fadeIn("up", "spring", 1.3, 1)}
            type="text"
            name="address"
            placeholder="ठेगाना"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500"
          />

          {/* Phone Number */}
          <motion.input
            variants={fadeIn("up", "spring", 1.5, 1)}
            type="tel"
            name="phone"
            placeholder="मोवाईल नं. (वैकल्पिक)"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500"
          />

          {/* Email */}
          <motion.input
            variants={fadeIn("up", "spring", 1.7, 1)}
            type="email"
            name="email"
            placeholder="ईमेल"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500"
          />

          {/* Related Branch */}
          <motion.select
            variants={fadeIn("up", "spring", 1.9, 1)}
            name="complaintBranch"
            value={formData.complaintBranch}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">सम्बन्धित शाखामा यस्तो गुनासो राख्नु भए छ ?</option>
            <option value="छ">छ</option>
            <option value="छैन">छैन</option>
          </motion.select>

          {/* Complaint Type */}
          <motion.select
            variants={fadeIn("up", "spring", 2.1, 1)}
            name="complaintType"
            value={formData.complaintType}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">गुनासोको प्रकार चयन गर्नुहोस्</option>
            <option value="सेवा">सेवा सम्बन्धी</option>
            <option value="प्रोक्ती">प्रोक्ती सम्बन्धी</option>
            <option value="आवेदन">आवेदन सम्बन्धी</option>
            <option value="सुरक्षा">सुरक्षा सम्बन्धी</option>
            <option value="भौतिक संरचना">भौतिक संरचना सम्बन्धी</option>
            <option value="अन्य">अन्य</option>
            <option value="वित्तीय">वित्तीय सम्बन्धी</option>
            <option value="व्यवस्थापन">व्यवस्थापन सम्बन्धी</option>
            <option value="सामाजिक">सामाजिक सम्बन्धी</option>
            <option value="कानूनी">कानूनी सम्बन्धी</option>
            <option value="प्राकृतिक आपत्ति">प्राकृतिक आपत्ति सम्बन्धी</option>
            <option value="वातावरणीय">वातावरणीय सम्बन्धी</option>
          </motion.select>

          {/* Member ID */}
          <motion.input
            variants={fadeIn("up", "spring", 2.3, 1)}
            type="text"
            name="memberId"
            placeholder="सदस्य नं."
            value={formData.memberId}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500"
          />

          {/* Complaint Details */}
          <motion.textarea
            variants={fadeIn("up", "spring", 2.5, 1)}
            name="complaintDetails"
            rows="4"
            placeholder="गुनासो सम्बन्धी विवरण"
            value={formData.complaintDetails}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500"
          ></motion.textarea>

          {/* Previous Response */}
          <motion.textarea
            variants={fadeIn("up", "spring", 2.7, 1)}
            name="previousResponse"
            rows="4"
            placeholder="कुनै प्रतिक्रिया वा जवाफ प्राप्त भएको भए यसको विवरण"
            value={formData.previousResponse}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500"
          ></motion.textarea>

          {/* File Upload for Proof */}
          <motion.input
            variants={fadeIn("up", "spring", 2.9, 1)}
            type="file"
            name="proof"
            onChange={handleFileChange}
            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500"
          />

          {/* Submit Button */}
          <motion.button
            variants={fadeIn("up", "spring", 3.1, 1)}
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-all shadow-md"
          >
            गुनासो पेश गर्नुहोस्
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default SectionWrapper(Gunaso, "gunaso");

{/*
import React, { useState } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../utils/motion"; 
import { SectionWrapper } from "@/hoc";

const Gunaso = () => {
  const [formData, setFormData] = useState({
    date: "",
    name: "",
    address: "",
    phone: "",
    email: "",
    complaintBranch: "", // "छ" or "छैन"
    complaintType: "", // Added for complaint type selection
    memberId: "",
    complaintDetails: "",
    previousResponse: "",
    proof: null, // For file uploads
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, proof: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, phone, complaintDetails, proof } = formData;
    const recipientEmail = "anupgelal1042@gmail.com"; // Change this to actual email
    const subject = encodeURIComponent(`Gunaso - Complaint`);
    const body = encodeURIComponent(
      `नाम: ${name}\nइमेल: ${email}\nफोन: ${phone}\nगुनासो विवरण: ${complaintDetails}`
    );

    // Open the default email client
    window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <motion.div
      variants={fadeIn("up", "spring", 0.5, 1)}
      className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen mt-20"
    >
      
      <motion.h2
        variants={fadeIn("up", "spring", 0.5, 1)}
        className="text-2xl font-bold text-blue-700 mb-6 text-center"
      >
        📢 गुनासो/प्रतिक्रिया पेश गर्नुहोस्
      </motion.h2>

    
      <motion.div
        variants={fadeIn("up", "spring", 0.7, 1)}
        className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 transition-all hover:shadow-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <motion.input
            variants={fadeIn("up", "spring", 0.9, 1)}
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500"
          />
          
          
          <motion.input
            variants={fadeIn("up", "spring", 1.1, 1)}
            type="text"
            name="name"
            placeholder="गुनासो गर्नेको नाम"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500"
          />
          
          
          <motion.input
            variants={fadeIn("up", "spring", 1.3, 1)}
            type="text"
            name="address"
            placeholder="ठेगाना"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500"
          />
          
          
          <motion.input
            variants={fadeIn("up", "spring", 1.5, 1)}
            type="tel"
            name="phone"
            placeholder="मोवाईल नं. (वैकल्पिक)"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500"
          />
          
      
          <motion.input
            variants={fadeIn("up", "spring", 1.7, 1)}
            type="email"
            name="email"
            placeholder="ईमेल"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500"
          />

          
          <motion.select
            variants={fadeIn("up", "spring", 1.9, 1)}
            name="complaintBranch"
            value={formData.complaintBranch}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">सम्बन्धित शाखामा यस्तो गुनासो राख्नु भए छ ?</option>
            <option value="छ">छ</option>
            <option value="छैन">छैन</option>
          </motion.select>

          
          <motion.select
            variants={fadeIn("up", "spring", 2.1, 1)}
            name="complaintType"
            value={formData.complaintType}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">गुनासोको प्रकार चयन गर्नुहोस्</option>
            <option value="सेवा">सेवा सम्बन्धी</option>
            <option value="प्रोक्ती">प्रोक्ती सम्बन्धी</option>
            <option value="आवेदन">आवेदन सम्बन्धी</option>
            <option value="सुरक्षा">सुरक्षा सम्बन्धी</option>
            <option value="भौतिक संरचना">भौतिक संरचना सम्बन्धी</option>
            <option value="अन्य">अन्य</option>
            <option value="वित्तीय">वित्तीय सम्बन्धी</option> 
            <option value="व्यवस्थापन">व्यवस्थापन सम्बन्धी</option> 
            <option value="सामाजिक">सामाजिक सम्बन्धी</option> 
            <option value="कानूनी">कानूनी सम्बन्धी</option>
            <option value="प्राकृतिक आपत्ति">प्राकृतिक आपत्ति सम्बन्धी</option> 
            <option value="वातावरणीय">वातावरणीय सम्बन्धी</option> 
          </motion.select>

          
          <motion.input
            variants={fadeIn("up", "spring", 2.3, 1)}
            type="text"
            name="memberId"
            placeholder="सदस्य नं."
            value={formData.memberId}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500"
          />

          
          <motion.textarea
            variants={fadeIn("up", "spring", 2.5, 1)}
            name="complaintDetails"
            rows="4"
            placeholder="गुनासो सम्बन्धी विवरण"
            value={formData.complaintDetails}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500"
          ></motion.textarea>

          
          <motion.textarea
            variants={fadeIn("up", "spring", 2.7, 1)}
            name="previousResponse"
            rows="4"
            placeholder="कुनै प्रतिक्रिया वा जवाफ प्राप्त भएको भए यसको विवरण"
            value={formData.previousResponse}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500"
          ></motion.textarea>

          
          <motion.input
            variants={fadeIn("up", "spring", 2.9, 1)}
            type="file"
            name="proof"
            onChange={handleFileChange}
            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500"
          />

          
          <motion.button
            variants={fadeIn("up", "spring", 3.1, 1)}
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-all shadow-md"
          >
            गुनासो पेश गर्नुहोस्
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default SectionWrapper(Gunaso, "gunaso");

 */}