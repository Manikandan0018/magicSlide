import express from "express";
import OpenAI from "openai";

const router = express.Router();

router.post("/classify", async (req, res) => {
  try {
    const { emails, openai_api_key } = req.body;

    if (!emails || emails.length === 0)
      return res.status(400).json({ message: "No emails provided" });

    const openai = new OpenAI({ apiKey: openai_api_key });

    const labeled = await Promise.all(
        emails.map(async (email) => {
          const prompt = `
You are a smart email classification system.

Classify each email into exactly ONE of these categories:
- Important: Work, personal, urgent, or contains important updates.
- Promotions: Offers, discounts, deals, coupons.
- Social: Notifications from social media or community platforms.
- Marketing: Newsletters, brand/product announcements, but not direct sales.
- Spam: Unwanted, scam, phishing, or irrelevant emails.
- General: Anything else that doesn’t fit above.

Return JSON in this exact format:
[
  {"id": "EMAIL_ID", "category": "CATEGORY_NAME"},
  ...
]

Emails to classify:
${JSON.stringify(
  messages.map((m) => ({
    id: m.id,
    subject: m.subject,
    from: m.from,
    snippet: m.snippet,
  }))
)}

Rules:
- Output ONLY JSON.
- Do NOT include explanations or text outside JSON.
`;



        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
        });

        const category =
          completion.choices[0].message.content.trim() || "General";
        return { ...email, category };
      })
    );

    res.json({ labeled });
  } catch (err) {
    console.error("OpenAI classify error:", err);
    res.status(500).json({ error: "Classification failed" });
  }
});

export default router;
