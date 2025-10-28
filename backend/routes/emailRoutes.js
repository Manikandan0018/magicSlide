import express from "express";
import { google } from "googleapis";
import OpenAI from "openai";

const router = express.Router();

// Middleware to ensure user is authenticated
function ensureAuth(req, res, next) {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

// ✅ Fetch and classify emails
router.post("/fetch", ensureAuth, async (req, res) => {
  const { openAIKey } = req.body;
  const user = req.user;

  if (!openAIKey) {
    return res.status(400).json({ message: "Missing OpenAI API key" });
  }

  try {
    // ✅ Set up Google OAuth2 client with both access + refresh tokens
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALLBACK_URL
    );

    oauth2Client.setCredentials({
      access_token: user.accessToken,
      refresh_token: user.refreshToken, // ✅ Needed for Gmail API
    });

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // ✅ Fetch last 15 emails
    const { data } = await gmail.users.messages.list({
      userId: "me",
      maxResults: 15,
    });

    if (!data.messages || data.messages.length === 0) {
      return res.json([]);
    }

    // ✅ Get message details (subject, from, snippet)
    const messages = await Promise.all(
      data.messages.map(async (msg) => {
        const { data: msgData } = await gmail.users.messages.get({
          userId: "me",
          id: msg.id,
        });

        const headers = msgData.payload.headers || [];
        const subject =
          headers.find((h) => h.name === "Subject")?.value || "(No Subject)";
        const from =
          headers.find((h) => h.name === "From")?.value || "(Unknown)";
        const snippet = msgData.snippet || "";

        return {
          id: msg.id,
          subject,
          from,
          snippet,
          date:
            headers.find((h) => h.name === "Date")?.value ||
            new Date().toISOString(),
        };
      })
    );

    // ✅ Classify emails using OpenAI GPT
    const openai = new OpenAI({ apiKey: openAIKey });

    const prompt = `
      You are an email classifier. Categorize each email into one of:
      Primary, Social, Promotions, or Spam.
      Return a pure JSON array, e.g.:
      [{"id": "123", "category": "Primary"}]

      Emails: ${JSON.stringify(
        messages.map((m) => ({
          id: m.id,
          subject: m.subject,
          from: m.from,
          snippet: m.snippet,
        }))
      )}
    `;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    let categories;
    try {
      categories = JSON.parse(aiResponse.choices[0].message.content);
    } catch {
      categories = [];
    }

    const categorizedEmails = messages.map((msg) => ({
      ...msg,
      category: categories.find((c) => c.id === msg.id)?.category || "Primary",
    }));

    res.json(categorizedEmails);
  } catch (err) {
    console.error("Error fetching emails:", err);
    res.status(500).json({
      message: "Failed to fetch emails",
      error: err.message,
    });
  }
});

export default router;
