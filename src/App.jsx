import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import Topbar from "./components/Topbar";
import Footer from "./components/Footer";
import PopupNotice from "./components/PopupNotice";
import ScrollingNotices from "./components/ScrollingNotices";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import {
  About, Products, BaseRates, Services, ManagementTeam, BoardOfDirectors,
  SavingAccountInterestRates, FinancialRates, KarnaliBranch, KoshiBranch, MadheshBranch,
  BagmatiBranch, GandakiBranch, LumbiniBranch, SudurpashchimBranch, OfficeHours, ContactUs,
  SuccessStories, Gunaso, Careers, Financials, AnnualReports, PrincipalIndicators,
  StaffTrainingReports, SebonDisclosures, Notices, Gallery, EmiCalculator, AllBranches,
  ApplyNow, HeadOfficeStaff
} from "./components";
import { AdminPanel, LoginPage, ProfilePage,BodAdminPage } from "./pagesserver";
import { notice } from "./constants";

const ScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
};

function App() {
  const topbarRef = useRef(null);
  const [topbarHeight, setTopbarHeight] = useState(0);
  const [currentNotice] = useState(notice[0]);

  useEffect(() => {
    const handleResize = () => {
      if (topbarRef.current) {
        setTopbarHeight(topbarRef.current.offsetHeight);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <BrowserRouter>
    {/*  <div className="relative z-0 min-h-screen animated-gradient">*/}
    <div className="relative z-0 min-h-screen bg-white">
        <PopupNotice image={currentNotice.image} />
        <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
          <Topbar ref={topbarRef} />
          <div
            className="bg-hero-pattern bg-cover bg-no-repeat bg-center relative"
            style={{ marginTop: `${topbarHeight}px` }}
          >
            <Navbar />
          </div>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<About />} />
            <Route path="/management-team" element={<ManagementTeam />} />
            <Route path="/board-of-directors" element={<BoardOfDirectors />} />
            <Route path="/products" element={<Products />} />
            <Route path="/services" element={<Services />} />
            <Route path="/base-rates" element={<BaseRates />} />
            <Route path="/saving-account-interest-rates" element={<SavingAccountInterestRates />} />
            <Route path="/loan-interest-rates" element={<FinancialRates />} />
            <Route path="/karnali" element={<KarnaliBranch />} />
            <Route path="/koshi" element={<KoshiBranch />} />
            <Route path="/madhesh" element={<MadheshBranch />} />
            <Route path="/bagmati" element={<BagmatiBranch />} />
            <Route path="/gandaki" element={<GandakiBranch />} />
            <Route path="/lumbini" element={<LumbiniBranch />} />
            <Route path="/sudurpashchim" element={<SudurpashchimBranch />} />
            <Route path="/officehours" element={<OfficeHours />} />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/success-stories" element={<SuccessStories />} />
            <Route path="/gunaso" element={<Gunaso />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/quarterly-reports" element={<Financials />} />
            <Route path="/annual-reports" element={<AnnualReports />} />
            <Route path="/principal-indicators" element={<PrincipalIndicators />} />
            <Route path="/staff-training-reports" element={<StaffTrainingReports />} />
            <Route path="/sebon-disclosures" element={<SebonDisclosures />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/emicalculator" element={<EmiCalculator />} />
            <Route path="/allbranches" element={<AllBranches />} />
            <Route path="/applynow" element={<ApplyNow />} />
            <Route path="/headofficestaff" element={<HeadOfficeStaff />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/adminpanel"
              element={<LoginPage />} // Optional: Remove if only testing route
            />
            <Route path="/unauthorized" element={<p className="text-center text-red-600 text-xl">Unauthorized Access</p>} />
          </Routes>
        </div>
        <ScrollingNotices style={{ position: 'relative', zIndex: 9999 }} />
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

{/*
import { BrowserRouter, Routes,Route } from "react-router-dom";
import { Navbar, About, Exp, Works, Feedbacks,Loader, Products, BaseRates,Services, ManagementTeam,BoardOfDirectors, SavingAccountInterestRates, FinancialRates,KarnaliBranch,KoshiBranch,MadheshBranch,BagmatiBranch,GandakiBranch, LumbiniBranch,SudurpashchimBranch, OfficeHours,ContactUs,SuccessStories,ScrollingNotices, Gunaso, Careers, Financials, AnnualReports, PrincipalIndicators, StaffTrainingReports, SebonDisclosures, Notices, Gallery} from "./components";
import Topbar from "./components/Topbar";
import { useEffect,useState, useRef } from "react";
import { StarsCanvas } from "./components/canvas";
 style={{backgroundImage: `url(${backgroundimage})`,WebkitBackgroundSize:"cover",backgroundPosition: "center",backgroundRepeat: "no-repeat", backgroundAttachment:"fixed",
    }}
function App() {
  const topbarRef=useRef(null);
  const [topbarHeight,setTopbarHeight]=useState(0);
  useEffect(()=>{
    const handleResize=()=>{
      if (topbarRef.current) {
        setTopbarHeight(topbarRef.current.offsetHeight);
    }
  };
  handleResize();
  window.addEventListener("resize",handleResize);

  return()=> window.removeEventListener("resize",handleResize);
  },[]);

  
  return (
    <>
    <BrowserRouter>
    <div className='relative z-0 bg-gradient-to-r from-green-600 to-yellow-200'>
      <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
       <Topbar ref={topbarRef}/>
      <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center relative" style={{ marginTop:`${topbarHeight}px`}}>
      <Navbar />
      </div>
      <Routes>
        <Route path="/" element={<About/>}/>
        <Route path="/management-team" element={<ManagementTeam/>}/>
        <Route path="/board-of-directors" element={<BoardOfDirectors/>}/>
        <Route path="/products" element={<Products/>}/>
        <Route path="/services" element={<Services/>}/>
        <Route path="/base-rates" element={<BaseRates/>}/>
        <Route path="/saving-account-interest-rates" element={ <SavingAccountInterestRates/>} />
        <Route path="/loan-interest-rates" element={<FinancialRates/>}/>
        <Route path="/karnali" element={<KarnaliBranch/>}/>
        <Route path="/koshi" element={<KoshiBranch/>}/>
        <Route path="/madhesh" element={<MadheshBranch/>}/>
        <Route path="/bagmati" element={<BagmatiBranch/>}/>
        <Route path="/gandaki" element={<GandakiBranch/>}/>
        <Route path="/lumbini" element={<LumbiniBranch/>}/>
        <Route path="/sudurpashchim" element={<SudurpashchimBranch/>}/>
        <Route path="/officehours" element={<OfficeHours/>}/>
        <Route path="/contactus" element={<ContactUs/>}/>
        <Route path="/success-stories" element={<SuccessStories/>}/>
        <Route path="/gunaso" element={<Gunaso/>}/>
        <Route path="/careers" element={<Careers/>}/>
        <Route path="/quarterly-reports" element={<Financials/>}/>
        <Route path="/annual-reports" element={<AnnualReports/>}/>
        <Route path="/principal-indicators" element={<PrincipalIndicators/>}/>
        <Route path="/staff-training-reports" element={<StaffTrainingReports/>}/>
        <Route path="/sebon-disclosures" element={<SebonDisclosures/>}/>
        <Route path="/notices" element={<Notices/>}/>
        <Route path="/gallery" element={<Gallery/>}/>


      </Routes>
      </div>
      <div>
      <StarsCanvas/>
      </div>
      </div>
      
    </BrowserRouter>
    <ScrollingNotices/>
    </>
  )
}


export default App;
*/}