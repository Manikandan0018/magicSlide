import React, { useEffect, useState } from "react";
import EmailCard from "../components/EmailCard";
import OpenAIKeyInput from "../components/OpenAIKeyInput"; // Import the new component
import Navbar from "../components/Navbar";

const API = "http://localhost:5000";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [emails, setEmails] = useState([]);
  const [category, setCategory] = useState("All");
  const [openAIKey, setOpenAIKey] = useState(
    localStorage.getItem("openai_api_key") || ""
  );
  const [loading, setLoading] = useState(false);

  // ✅ Check user login
  useEffect(() => {
    fetch(`${API}/api/auth/user`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch((err) => console.error("User not logged in", err));
  }, []);

  // ✅ Handle OpenAI API key save
  const handleSaveKey = () => {
    if (!openAIKey.trim()) {
      alert("Please enter a valid OpenAI API Key");
      return;
    }
    localStorage.setItem("openai_api_key", openAIKey);
    alert("✅ API Key saved locally!");
  };

  // ✅ Fetch and classify emails
  const fetchEmails = async () => {
    if (!openAIKey) return alert("⚠️ Please enter your OpenAI API key first.");

    setLoading(true);
    setEmails([]); // Clear previous emails for visual feedback
    try {
      const res = await fetch(`${API}/api/gmail/fetch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ openAIKey }),
      });

      const data = await res.json();
      if (Array.isArray(data)) {
        setEmails(data);
      } else {
        alert("🚨 Error fetching emails. Check console for details.");
        console.error("Invalid response:", data);
      }
    } catch (err) {
      alert("🚨 Network error during email fetch.");
      console.error("Error fetching emails:", err);
    }
    setLoading(false);
  };

  // ✅ Logout
  const handleLogout = async () => {
    await fetch(`${API}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    // Use React Router for navigation if available, otherwise window.location
    window.location.href = "/";
  };

  // ✅ Filter emails
  const filteredEmails =
    category === "All"
      ? emails
      : emails.filter((email) => email.category === category);

  return (
    <>
    
    
    <Navbar/>
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {!user ? (
          // --- Login Screen ---
          <div className="flex flex-col items-center gap-6 mt-20 bg-white p-10 rounded-xl shadow-2xl border border-gray-200">
            <h2 className="text-3xl font-extrabold text-gray-800">
              Intelligent Inbox Setup
            </h2>
            <p className="text-gray-600 text-center max-w-sm">
              Please sign in with Google to allow the app to fetch and
              categorize your emails using AI.
            </p>
            <a
              href={`${API}/api/auth/google`}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-md transform hover:scale-[1.02]"
            >
              Login with Google
            </a>
          </div>
        ) : (
          // --- Dashboard Content ---
          <div>
            {/* Header / User Info */}
            <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 mb-6 flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-4">
                
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Welcome, {user.displayName.split(" ")[0]} 👋
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {user.emails?.[0]?.value}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="mt-4 md:mt-0 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition shadow-md"
              >
                Logout
              </button>
            </div>

            {/* OpenAI Key Input Component */}
            <OpenAIKeyInput
              openAIKey={openAIKey}
              setOpenAIKey={setOpenAIKey}
              handleSaveKey={handleSaveKey}
              fetchEmails={fetchEmails}
              loading={loading}
            />

            {/* Category Filter */}
            <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                2. Filter Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {["All", "Primary", "Social", "Promotions", "Spam"].map(
                  (cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition border ${
                        category === cat
                          ? "bg-blue-600 text-white shadow-md border-blue-600"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Email List */}
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {category} Inbox ({filteredEmails.length} emails)
            </h3>
            <div className="space-y-4">
              {loading && emails.length === 0 ? (
                <p className="text-blue-500 text-center py-10">
                  AI is classifying your emails. Please wait...
                </p>
              ) : filteredEmails.length === 0 ? (
                <div className="text-gray-500 text-center py-10 bg-white rounded-xl shadow-md border border-gray-100">
                  <p className="text-lg">
                    No emails found in the {category} category.
                  </p>
                </div>
              ) : (
                filteredEmails.map((email) => (
                  // NOTE: EmailCard still needs an onOpenDetail prop if it opens a modal!
                  <EmailCard key={email.id} email={email} />
                ))
              )}
            </div>
          </div>
        )}
      </div>
      </div>
      </>
  );
}
