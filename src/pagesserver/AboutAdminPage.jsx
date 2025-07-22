
import React from "react";
import AdminAboutMessages from "./AdminAboutMessages";
import AdminAboutVision from "./AdminAboutVision";
import AdminAboutStats from "./AdminAboutStats";
import AdminAboutSlides from "./AdminAboutSlides";

const AboutAdminPage = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold text-green-700">Manage About Page</h1>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">CEO Messages</h2>
        <AdminAboutMessages />
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Vision, Objective & About</h2>
        <AdminAboutVision />
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">About Stats</h2>
        <AdminAboutStats />
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Slideshow Images</h2>
        <AdminAboutSlides />
      </section>
    </div>
  );
};

export default AboutAdminPage;
