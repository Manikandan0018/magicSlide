import React, { useState } from "react";
import { ChevronDown, ChevronUp, Mail, Calendar } from "lucide-react"; // Assuming you have lucide-react or similar icon library

// Helper function to assign color to category tags (copied from Dashboard for consistency)
const getCategoryColor = (cat) => {
  switch (cat) {
    case "Primary":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Social":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Promotions":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "Spam":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
};

export default function EmailCard({ email }) {
  const [open, setOpen] = useState(false); // Function to safely format the date string

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div
      className={`border rounded-xl transition-all duration-300 ${
        open
          ? "shadow-xl border-blue-400 bg-white"
          : "shadow-sm hover:shadow-lg border-gray-200 bg-white"
      }`}
    >
            {/* 1. Collapsed/Header View - Always Visible */}     {" "}
      <div
        className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
               {" "}
        <div className="flex-grow min-w-0 pr-4 w-full md:w-auto">
                    {/* Subject Line and Category Tag */}         {" "}
          <div className="flex items-center justify-between w-full">
                       {" "}
            <h2
              className={`font-semibold text-lg text-gray-800 truncate ${
                open ? "font-bold" : ""
              } max-w-[85%]`}
              title={email.subject}
            >
                            {email.subject || "(No Subject)"}           {" "}
            </h2>
                       {" "}
            {email.category && (
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full border shrink-0 hidden sm:inline-block ${getCategoryColor(
                  email.category
                )}`}
              >
                                {email.category}             {" "}
              </span>
            )}
                     {" "}
          </div>
                    {/* From and Snippet */}         {" "}
          <p className="text-gray-600 text-sm mt-0.5">
                        From:            {" "}
            <span className="font-medium text-gray-700">{email.from}</span>     
               {" "}
          </p>
                   {" "}
          <p className="text-gray-500 mt-1 line-clamp-1 text-sm md:hidden">
                        {email.snippet || "No email preview available."}       
             {" "}
          </p>
                 {" "}
        </div>
                {/* Action/Icon Side */}       {" "}
        <div className="flex items-center space-x-3 mt-2 md:mt-0 shrink-0">
                   {" "}
          <span className="text-sm text-gray-500 hidden md:block">
                        {formatDate(email.date)}         {" "}
          </span>
                   {" "}
          <button
            className="text-gray-500 hover:text-blue-600 transition p-1 rounded-full bg-gray-50 hover:bg-gray-100"
            aria-expanded={open}
            aria-label={open ? "Collapse email" : "Expand email"}
          >
                       {" "}
            {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}       
             {" "}
          </button>
                 {" "}
        </div>
             {" "}
      </div>
            {/* 2. Expanded Detail View - Conditional */}     {" "}
      {open && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50 transition-all duration-300 rounded-b-xl">
                    {/* Metadata Bar (Visible in expanded view) */}         {" "}
          <div className="flex flex-wrap items-center text-sm text-gray-600 space-x-4 mb-4 pb-2 border-b border-gray-200">
                       {" "}
            <span className="flex items-center space-x-1">
                            <Mail size={16} className="text-blue-500" />       
                    <span>To: You</span>           {" "}
            </span>
                       {" "}
            <span className="flex items-center space-x-1">
                            <Calendar size={16} className="text-blue-500" />   
                        <span>{formatDate(email.date)}</span>           {" "}
            </span>
                       {" "}
            {email.category && (
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full border ${getCategoryColor(
                  email.category
                )}`}
              >
                                {email.category}             {" "}
              </span>
            )}
                     {" "}
          </div>
                   {" "}
          {/* Full Email Body (Use fullBody if available, otherwise fallback to snippet) */}
                   {" "}
          <div className="text-gray-800 leading-relaxed max-h-96 overflow-y-auto">
                       {" "}
            {/* NOTE: You should sanitize and render HTML here if your email body is HTML. 
               For this example, we treat it as plain text and use white-space-pre-wrap for readability. */}
                       {" "}
            <p className="whitespace-pre-wrap">
                           {" "}
              {email.fullBody ||
                email.snippet ||
                "No full email content available."}
                         {" "}
            </p>
                     {" "}
          </div>
                    {/* Action Buttons */}         {" "}
          <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end">
                       {" "}
            <button
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition" // onClick={() => handleReply(email)} // Placeholder for action
            >
                            Reply            {" "}
            </button>
                     {" "}
          </div>
                 {" "}
        </div>
      )}
         {" "}
    </div>
  );
}
