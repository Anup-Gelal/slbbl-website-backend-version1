import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { SectionWrapper } from '@/hoc';

const ApplyNow = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    dobAD: "",
    dobBS: "",
    age: "",
    gender: "",
    placeOfBirth: "",
    grandfatherName: "",
    fatherName: "",
    motherName: "",
    bloodGroup: "",
    citizenshipNumber: "",
    citizenshipIssuedDistrict: "",
    citizenshipIssueDateAD: "",
    citizenshipIssueDateBS: "",
    maritalStatus: "",
    email: "",
    mobileNumber: "",
    telephoneNumber: "",
    permanentProvince: "",
    permanentDistrict: "",
    permanentMunicipality: "",
    permanentWard: "",
    permanentTole: "",
    sameAsPermanent: false,
    temporaryProvince: "",
    temporaryDistrict: "",
    temporaryMunicipality: "",
    temporaryWard: "",

    universityName: "",
    qualification: "",
    specialization: "",
    passingYear: "",
    percentage: "",
    cgpa: "",
    marksheet: null,

    latestPhoto: null,
    resume: null,
    frontCitizenship: null,
    backCitizenship: null,
    latestDegree: null,
    application: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = () => {
    setFormData((prevData) => ({
      ...prevData,
      sameAsPermanent: !prevData.sameAsPermanent,
      temporaryProvince: !prevData.sameAsPermanent ? prevData.permanentProvince : "",
      temporaryDistrict: !prevData.sameAsPermanent ? prevData.permanentDistrict : "",
      temporaryMunicipality: !prevData.sameAsPermanent ? prevData.permanentMunicipality : "",
      temporaryWard: !prevData.sameAsPermanent ? prevData.permanentWard : ""
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailData = {
      fullName: formData.fullName,
      dobAD: formData.dobAD,
      dobBS: formData.dobBS,
      age: formData.age,
      gender: formData.gender,
      placeOfBirth: formData.placeOfBirth,
      grandfatherName: formData.grandfatherName,
      fatherName: formData.fatherName,
      motherName: formData.motherName,
      bloodGroup: formData.bloodGroup,
      citizenshipNumber: formData.citizenshipNumber,
      citizenshipIssuedDistrict: formData.citizenshipIssuedDistrict,
      citizenshipIssueDateAD: formData.citizenshipIssueDateAD,
      citizenshipIssueDateBS: formData.citizenshipIssueDateBS,
      maritalStatus: formData.maritalStatus,
      email: formData.email,
      mobileNumber: formData.mobileNumber,
      telephoneNumber: formData.telephoneNumber,
      permanentProvince: formData.permanentProvince,
      permanentDistrict: formData.permanentDistrict,
      permanentMunicipality: formData.permanentMunicipality,
      permanentWard: formData.permanentWard,
      sameAsPermanent: formData.sameAsPermanent ? "Yes" : "No",
      temporaryProvince: formData.temporaryProvince,
      temporaryDistrict: formData.temporaryDistrict,
      temporaryMunicipality: formData.temporaryMunicipality,
      temporaryWard: formData.temporaryWard,
      universityName: formData.universityName,
      qualification: formData.qualification,
      specialization: formData.specialization,
      passingYear: formData.passingYear,
      percentage: formData.percentage,
      cgpa: formData.cgpa,
      marksheet: formData.marksheet ? formData.marksheet.name : "None",
      latestPhoto: formData.latestPhoto ? formData.latestPhoto.name : "None",
      resume: formData.resume ? formData.resume.name : "None",
      frontCitizenship: formData.frontCitizenship ? formData.frontCitizenship.name : "None",
      backCitizenship: formData.backCitizenship ? formData.backCitizenship.name : "None",
      latestDegree: formData.latestDegree ? formData.latestDegree.name : "None",
      application: formData.application ? formData.application.name : "None",
    };

    emailjs.send("Careers", "career", emailData, "qGvuAiqoJg_2eK3Hg")
      .then(
        (result) => {
          alert("Your application has been submitted successfully!");
          setFormData({
            fullName: "",
            dobAD: "",
            dobBS: "",
            age: "",
            gender: "",
            placeOfBirth: "",
            grandfatherName: "",
            fatherName: "",
            motherName: "",
            bloodGroup: "",
            citizenshipNumber: "",
            citizenshipIssuedDistrict: "",
            citizenshipIssueDateAD: "",
            citizenshipIssueDateBS: "",
            maritalStatus: "",
            email: "",
            mobileNumber: "",
            telephoneNumber: "",
            permanentProvince: "",
            permanentDistrict: "",
            permanentMunicipality: "",
            permanentWard: "",
            sameAsPermanent: false,
            temporaryProvince: "",
            temporaryDistrict: "",
            temporaryMunicipality: "",
            temporaryWard: "",
            universityName: "",
            qualification: "",
            specialization: "",
            passingYear: "",
            percentage: "",
            cgpa: "",
            marksheet: null,
            latestPhoto: null,
            resume: null,
            frontCitizenship: null,
            backCitizenship: null,
            latestDegree: null,
            application: null,
          });
        },
        (error) => {
          alert("An error occurred. Please try again later.");
        }
      );
  };
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="fullName" type="text" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="border p-2 rounded bg-blue-500 text-white" />
        <input name="dobAD" type="text" placeholder="DOB (AD)" value={formData.dobAD} onChange={handleChange} className="border p-2 rounded bg-blue-500 text-white" />
        <input name="dobBS" type="text" placeholder="DOB (BS)" value={formData.dobBS} onChange={handleChange} className="border p-2 rounded bg-blue-500 text-white" />
        <input name="age" type="number" placeholder="Age" value={formData.age} onChange={handleChange} className="border p-2 rounded bg-blue-500 text-white" />
        <select name="gender" value={formData.gender} onChange={handleChange} className="border p-2 rounded bg-blue-500 text-white">
          <option value="">Select Your Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <h2 className="text-xl font-semibold col-span-2">Citizenship Details</h2>
        <input name="fatherName" type="text" placeholder="Father's Name" value={formData.fatherName} onChange={handleChange} className="border p-2 rounded bg-blue-500 text-white" />
        <input name="motherName" type="text" placeholder="Mother's Name" value={formData.motherName} onChange={handleChange} className="border p-2 rounded bg-blue-500 text-white" />
        <input name="CitizenshipNumber" type="text" placeholder="Citizenship Number" value={formData.citizenshipNumber} onChange={handleChange} className="border p-2 rounded bg-blue-500 text-white" />
        <input name="CitizenshipIssueDate" type="text" placeholder="Citizenship Issue Date" value={formData.citizenshipIssueDateAD} onChange={handleChange} className="border p-2 rounded bg-blue-500 text-white" />
        <input name="CitizenshipIssueDistrict" type="text" placeholder="Citizenship Issue District" value={formData.citizenshipIssuedDistrict} onChange={handleChange} className="border p-2 rounded bg-blue-500 text-white" />
        <select name="gender" value={formData.gender} onChange={handleChange} className="border p-2 rounded bg-blue-500 text-white">
          <option value="">Select Your Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <h2 className="text-xl font-semibold col-span-2">Permanent Address</h2>
        <input name="permanentProvince" type="text" placeholder="Enter a Province" value={formData.permanentProvince} onChange={handleChange} className="border p-2 rounded bg-blue-500 text-white"/>
        <input name="permanentDistrict" type='text' placeholder='Enter a District' value={formData.permanentDistrict} onChange={handleChange} className="border p-2 rounded bg-blue-500 text-white"/>
        <input name="permanentMunicipality" type='text' placeholder='Enter a municipality/VDC' value={formData.permanentMunicipality} onChange={handleChange} className="border p-2 rounded bg-blue-500 text-white"/>
        <input name="permanentWard" type="text" placeholder="Enter a Ward Number" value={formData.permanentWard} onChange={handleChange} className="border p-2 rounded bg-blue-500 text-white" />
    
        <label className="col-span-2 flex items-center">
          <input type="checkbox" checked={formData.sameAsPermanent} onChange={handleCheckboxChange} className="mr-2" /> Same as permanent
        </label>
        <h2 className="text-xl font-semibold col-span-2">Temporary Address</h2>
        <input name="temporaryProvince" type='text' placeholder='Enter a Province' value={formData.temporaryProvince}  onChange={handleChange} className="border p-2 rounded bg-blue-500 text-white" disabled={formData.sameAsPermanent}/>
        <input name="temporaryDistrict"  type='text' placeholder='Enter a District' value={formData.temporaryDistrict} onChange={handleChange} className="border p-2 rounded bg-blue-500 text-white" disabled={formData.sameAsPermanent}/>
        <input name="temporaryMunicipality" type='text' placeholder='Enter a Municipality/VDC' value={formData.temporaryMunicipality} onChange={handleChange} className="border p-2 rounded bg-blue-500 text-white" disabled={formData.sameAsPermanent}/>
        <input name="temporaryWard" type="text" placeholder="Enter a Ward Number" value={formData.temporaryWard} onChange={handleChange} className="border p-2 rounded bg-blue-500 text-white" disabled={formData.sameAsPermanent} />

        <h2 className="text-xl font-semibold col-span-2">Education</h2>
        <input name="universityName" type="text" placeholder="University Name" value={formData.universityName} onChange={handleChange} className="border p-2 rounded bg-blue-500 text-white" />
        <select name="qualification" value={formData.qualification} onChange={handleChange} className="border p-2 rounded bg-blue-500 text-white">
          <option value="">Select a qualification</option>
          <option value="Bachelor">Bachelor</option>
          <option value="Master">Master</option>
          <option value="PhD">PhD</option>
        </select>
        <input name="specialization" type="text" placeholder="Area of Specialization" value={formData.specialization} onChange={handleChange} className="border p-2 rounded bg-blue-500 text-white" />
        <input name="passingYear" type="text" placeholder="Passing Year" value={formData.passingYear} onChange={handleChange} className="border p-2 rounded bg-blue-500 text-white" />
        <input name="percentage" type="text" placeholder="Percentage" value={formData.percentage} onChange={handleChange} className="border p-2 rounded bg-blue-500 text-white" />
        <input name="cgpa" type="text" placeholder="CGPA" value={formData.cgpa} onChange={handleChange} className="border p-2 rounded bg-blue-500 text-white" />
        <input name="marksheet" type="file" onChange={handleFileChange} className="border p-2 rounded bg-blue-500 text-white" />
        {formData.marksheet && <p className="col-span-2 text-sm">File selected: {formData.marksheet.name}</p>}

        {/* Document/Photo Uploads */}
        <h2 className="text-xl font-semibold col-span-2">Documents/Photos</h2>
        <input name="latestPhoto" type="file" onChange={handleFileChange} className="border p-2 rounded bg-blue-500 text-white" />
        {formData.latestPhoto && <p className="col-span-2 text-sm">File selected: {formData.latestPhoto.name}</p>}

        <input name="resume" placeholder='Enter you resume' type="file" onChange={handleFileChange} className="border p-2 rounded bg-blue-500 text-white" />
        {formData.resume && <p className="col-span-2 text-sm">File selected: {formData.resume.name}</p>}

        <input name="frontCitizenship" placeholder='Enter your frontCitizenship' type="file" onChange={handleFileChange} className="border p-2 rounded bg-blue-500 text-white" />
        {formData.frontCitizenship && <p className="col-span-2 text-sm">File selected: {formData.frontCitizenship.name}</p>}

        <input name="backCitizenship" placeholder='Enter your backCitizenship' type="file" onChange={handleFileChange} className="border p-2 rounded bg-blue-500 text-white" />
        {formData.backCitizenship && <p className="col-span-2 text-sm">File selected: {formData.backCitizenship.name}</p>}

        <input name="latestDegree" placeholder='Enter your last degree' type="file" onChange={handleFileChange} className="border p-2 rounded bg-blue-500 text-white" />
        {formData.latestDegree && <p className="col-span-2 text-sm">File selected: {formData.latestDegree.name}</p>}

        <input name="application" placeholder='Enter your application' type="file" onChange={handleFileChange} className="border p-2 rounded bg-blue-500 text-white" />
        {formData.application && <p className="col-span-2 text-sm">File selected: {formData.application.name}</p>}

        <button 
  type="button" 
  onClick={handleSubmit} 
  className="col-span-2 bg-blue-500 text-white p-2 rounded mt-4">
  Submit
</button>

      </form>
    </div>

  );
};

export default SectionWrapper(ApplyNow, 'applynow');
