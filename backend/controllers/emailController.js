import OpenAI from "openai";

export const fetchEmails = async (req, res) => {
  try {
    const sampleEmails = [
      {
        id: 1,
        from: "boss@company.com",
        subject: "Project deadline",
        snippet: "Please finish the report by tomorrow.",
      },
      {
        id: 2,
        from: "flipkart@promo.com",
        subject: "Big Billion Sale is Live!",
        snippet: "Get 80% off on your favourite brands.",
      },
      {
        id: 3,
        from: "linkedin@social.com",
        subject: "You have a new connection request.",
        snippet: "John Doe wants to connect with you.",
      },
    ];

    const openai = new OpenAI({ apiKey: req.body.apiKey });

    const emailsWithCategory = await Promise.all(
      sampleEmails.map(async (email) => {
        const prompt = `
Classify this email into one of the following:
Important, Promotions, Social, Marketing, Spam, or General.

Email:
From: ${email.from}
Subject: ${email.subject}
Snippet: ${email.snippet}
`;

        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
        });

        const category =
          response.choices[0].message.content.trim() || "General";
        return { ...email, category };
      })
    );

    res.json(emailsWithCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
