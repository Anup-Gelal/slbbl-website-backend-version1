import React, { useEffect, useState } from "react";
import axios from "axios";
import PendingUsers from "../componentserver/PendingUsers";
import BodAdminPage from "./BodAdminPage"; 
import ManagementAdminPage from "./ManagementAdminPage";
import BranchesAdminPage from "./BranchAdminPage";
import ServiceAdminPage from "./ServiceAdminPage";
import AboutAdminPage from "./AboutAdminPage";
import ProductAdminPage from "./ProductAdminPage";
import AdminBaseRates from "./BaserateAdminPage";
import AdminSavingInterestRates from "./SavingRateAdminPage";
import AdminLoanInterestRates from "./LoanInterestRateAdminPage";
import AdminFinancialReports from "./QuarterlyReportAdminPage";
import AdminAnnualReports from "./AnnualReportAdminPage";
import AdminPrincipalIndicators from "./PrincipalIndicatorAdmin";
import AdminSebonDisclosures from "./SebonDisclosureAdminPage";
import AdminStaffTrainingReports from "./StaffTrainingReportAdmin";
import AdminNotices from "./NoticesAdminPage";
import AdminGalleries from "./GalleriesAdminPage";
import AdminSuccessStories from "./SuccessStoriesAdminPage";
import AdminDownloads from "./DownloadAdminPage";
import AdminSpokesperson from "./SpokePersonAdmin";
import AdminPopupNotices from "./PopNoticesAdmin";
import AdminScrollingNotices from "./ScrollingNoticeAdmin";
import HeadOfficeStaffAdminPage from "./HeadOfficeStaffAdmin";
import AdminVacancies from "./VaccancyAdminPage";

const API_BASE = "http://localhost:8080/api/v1";

const AdminPanel = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("pendingUsers");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch {
        setError("Failed to fetch profile. Redirecting...");
        setTimeout(() => logout(), 2000);
      }
    };
    fetchProfile();
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  if (error) return <p className="text-red-500 text-center mt-8 animate-pulse">{error}</p>;
  if (!user) return <p className="text-gray-600 text-center mt-8 animate-fade-in">Loading...</p>;

  return (
    <div className="space-y-12 p-6 animate-fade-in">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-indigo-700">Admin Dashboard</h1>
        <p className="text-gray-600">Logged in as: {user.username}</p>
        <button
          onClick={logout}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </header>

      {/* Wrapped and spaced buttons */}
      <nav className="flex flex-wrap justify-start gap-4 mb-6">
        {[
          ["Pending Users", "pendingUsers"],
          ["Manage BODs", "bods"],
          ["Manage Management Team", "managements"],
          ["Manage Branches", "branches"],
          ["Manage Services", "services"],
          ["Manage About Section", "aboutsection"],
          ["Manage Products", "products"],
          ["Manage Base Rates", "base-rates"],
          ["Manage Saving Interest Rates", "saving-interest-rates"],
          ["Manage Loan Interest Rates", "loan-interest-rates"],
          ["Manage Quarterly Reports", "quarterly-reports"],
          ["Manage Annual Reports", "annual-reports"],
          ["Manage Principal Indicators", "principal-indicators"],
          ["Manage Sebon Disclosures", "sebon-disclosures"],
          ["Manage staff Training Report","staff-training-report"],
          ["Manage notices","notices"],
          ["Manage Gallery","galleries"],
          ["Manage Success Stories", "success-stories"],
          ["Manage Downloads","downloads"],
          ["Manage SpokePerson","spokeperson"],
          ["Manage PopUp Notices","popupnotices"],
          ["Manage Scrolling Notices","scrollingnotices"],
          ["Manage Head Office Staff","headofficestaff"],
          ["Manage Vaccancies","vaccancies"],
        ].map(([label, key]) => (
          <button
            key={key}
            className={`px-4 py-2 rounded ${
              activeSection === key ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveSection(key)}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Conditional rendering of active section */}
      <section>
        {activeSection === "pendingUsers" && <PendingUsers />}
        {activeSection === "bods" && <BodAdminPage />}
        {activeSection === "managements" && <ManagementAdminPage />}
        {activeSection === "branches" && <BranchesAdminPage />}
        {activeSection === "services" && <ServiceAdminPage />}
        {activeSection === "aboutsection" && <AboutAdminPage />}
        {activeSection === "products" && <ProductAdminPage />}
        {activeSection === "base-rates" && <AdminBaseRates />}
        {activeSection === "saving-interest-rates" && <AdminSavingInterestRates />}
        {activeSection === "loan-interest-rates" && <AdminLoanInterestRates />}
        {activeSection === "quarterly-reports" && <AdminFinancialReports />}
        {activeSection === "annual-reports" && <AdminAnnualReports />}
        {activeSection === "principal-indicators" && <AdminPrincipalIndicators />}
        {activeSection === "sebon-disclosures" && <AdminSebonDisclosures />}
        {activeSection === "staff-training-report" && <AdminStaffTrainingReports />}
        {activeSection === "notices" && <AdminNotices/>}
        {activeSection === "galleries" && <AdminGalleries/>}
        {activeSection === "success-stories" && <AdminSuccessStories/>}
         {activeSection === "downloads" && <AdminDownloads/>}
          {activeSection === "spokeperson" && <AdminSpokesperson/>}
          {activeSection==="popupnotices" && <AdminPopupNotices/>}
          {activeSection==="scrollingnotices" && <AdminScrollingNotices/>}
           {activeSection==="headofficestaff" && <HeadOfficeStaffAdminPage/>}
           {activeSection==="vaccancies" && <AdminVacancies/>}
      </section>
    </div>
  );
};

export default AdminPanel;

