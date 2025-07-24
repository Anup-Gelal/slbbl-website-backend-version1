
import React from "react";

const ProfileModal = ({ data, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div className="bg-gradient-to-br from-green-500 to-blue-500 p-6 rounded-2xl shadow-lg max-w-lg w-full">
      <button
        className="text-green-100 hover:text-green-200 mb-4 float-right text-xl font-bold"
        onClick={onClose}
        aria-label="Close profile modal"
      >
        ✕
      </button>
      <div className="flex flex-col items-center">
        <div
          className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-green-200"
          style={{ backgroundColor: data.iconBg ? `#${data.iconBg}` : "#ffffff" }}
        >
          <img
            src={`http://localhost:8080/${data.icon}`}
            alt={data.title}
            className="w-full h-full object-contain"
          />
        </div>
        <h2 className="text-green-200 text-2xl font-bold mb-2 text-center">
          {data.title}
        </h2>
      </div>
      <p className="text-green-100 mb-4 text-center">{data.description}</p>
      {/* Add more profile details here, all in green */}
    </div>
  </div>
);

export default ProfileModal;
