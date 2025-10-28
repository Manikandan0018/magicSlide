import React from "react";
import { X, Mail, Calendar } from "lucide-react"; // Using the 'lucide-react' icons for a cleaner look

export default function EmailDetail({ email, onClose }) {
  // Function to safely format the date string
  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    // 1. Modal Overlay
    <div
      className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4 transition-opacity duration-300" // Allows clicking outside the content area to close the modal
      onClick={onClose}
    >
            {/* 2. Modal Content Container */}     {" "}
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl h-full max-h-[90vh] flex flex-col transform transition-transform duration-300 scale-95 md:scale-100" // Prevent closing the modal when clicking inside the content
        onClick={(e) => e.stopPropagation()}
      >
                {/* Modal Header */}       {" "}
        <div className="p-5 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white z-10">
                   {" "}
          <div className="pr-10">
                       {" "}
            <h2 className="text-2xl font-extrabold text-gray-900 mb-1 leading-tight">
                            {email.subject || "(No Subject)"}           {" "}
            </h2>
                        {/* Metadata */}           {" "}
            <div className="flex flex-wrap items-center text-sm text-gray-600 space-x-4">
                           {" "}
              <span className="flex items-center space-x-1 font-semibold">
                                <Mail size={16} className="text-blue-500" />   
                            <span>From: {email.from}</span>             {" "}
              </span>
                           {" "}
              <span className="flex items-center space-x-1">
                                <Calendar size={16} className="text-gray-400" />
                                <span>{formatDate(email.date)}</span>           
                 {" "}
              </span>
                         {" "}
            </div>
                     {" "}
          </div>
                    {/* Close Button (Modernized) */}         {" "}
          <button
            className="text-gray-400 hover:text-gray-700 transition p-1.5 rounded-full hover:bg-gray-100 shrink-0"
            onClick={onClose}
            aria-label="Close email detail"
          >
                        <X size={24} />         {" "}
          </button>
                 {" "}
        </div>
                {/* 3. Scrollable Email Body */}       {" "}
        <div className="p-5 overflow-y-auto flex-grow text-gray-800 leading-relaxed">
                   {" "}
          {/* Display fullBody if available, otherwise fallback to snippet */} 
                 {" "}
          <div className="whitespace-pre-wrap">
                       {" "}
            {email.fullBody ||
              email.snippet ||
              "No full email content available."}
                     {" "}
          </div>
                 {" "}
        </div>
                {/* 4. Action Footer */}       {" "}
        <div className="p-4 border-t border-gray-100 flex justify-end sticky bottom-0 bg-white z-10">
                   {" "}
          <button
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-md" // Placeholder for action // onClick={() => handleReply(email)}
          >
                        Reply          {" "}
          </button>
                 {" "}
        </div>
             {" "}
      </div>
         {" "}
    </div>
  );
}
