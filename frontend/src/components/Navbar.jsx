import React from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
import logo from "../image/logo.png"

export default function Navbar() {
 





  return (
    <nav className="w-full bg-white shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      {/* Logo and Title */}
      <div className="flex items-center gap-2">
        <img
          src={logo} // 🔹 place your logo in public/logo.png
          alt="Smart Inbox Logo"
          className="w-10 h-10 rounded-lg"
        />
        <h1 className="text-xl font-semibold text-gray-800">
          Smart Inbox Dashboard
        </h1>
      </div>

      {/* Tagline (visible on larger screens) */}
      <p className="hidden md:block text-gray-500 italic">
        Effortlessly organize your Gmail with AI-powered classification
      </p>

     
    </nav>
  );
}
