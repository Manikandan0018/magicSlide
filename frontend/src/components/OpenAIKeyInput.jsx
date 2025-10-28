// src/components/OpenAIKeyInput.jsx

import React from "react";
import { Save, RefreshCw, Loader } from "lucide-react";

export default function OpenAIKeyInput({
  openAIKey,
  setOpenAIKey,
  handleSaveKey,
  fetchEmails,
  loading,
}) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-3">
        1. Setup OpenAI API Key
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Your key is stored only in your browser's local storage for security.
      </p>

      <div className="flex flex-col md:flex-row gap-3">
        {/* API Key Input */}
        <input
          type="password"
          placeholder="Enter your OpenAI API key (sk-...)"
          value={openAIKey}
          onChange={(e) => setOpenAIKey(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg w-full md:flex-grow focus:ring-blue-500 focus:border-blue-500 transition"
        />

        {/* Save Key Button */}
        <button
          onClick={handleSaveKey}
          className="px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition flex items-center justify-center shrink-0"
        >
          <Save size={18} className="mr-2" />
          Save Key
        </button>

        {/* Fetch & Classify Button */}
        <button
          onClick={fetchEmails}
          disabled={loading || !openAIKey}
          className={`px-4 py-3 rounded-lg text-white font-medium transition flex items-center justify-center shrink-0 shadow-md ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 transform hover:scale-[1.01]"
          }`}
        >
          {loading ? (
            <Loader size={18} className="animate-spin mr-2" />
          ) : (
            <RefreshCw size={18} className="mr-2" />
          )}
          {loading ? "Fetching..." : "Fetch & Classify Emails"}
        </button>
      </div>
    </div>
  );
}
