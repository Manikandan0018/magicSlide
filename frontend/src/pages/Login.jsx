import React, { useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Login() {
  useEffect(() => {
    // if already logged in maybe redirect to dashboard
    fetch(`${API}/api/me`, { credentials: "include" })
      .then((r) => {
        if (r.status === 200) window.location.href = "/dashboard";
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">
          Email Classifier — Login
        </h1>
        <p className="mb-6">
          Sign in with your Google account to fetch your latest emails
        </p>
        <a
          href={`${API}/api/auth/google`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Sign in with Google
        </a>
  
      </div>
    </div>
  );
}
