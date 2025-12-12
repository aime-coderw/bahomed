import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const { message } = req.body;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
            You are BAHO Healthcare Assistant. Provide:
            - BAHO services info
            - General medical info
            - Health tips
            - Patient education
            - When needed: links like /telecare, /pharmacy, etc.
          `,
        },
        { role: "user", content: message },
      ],
    });

    res.status(200).json({ reply: response.choices[0].message.content });

  } catch (error) {
    res.status(500).json({ reply: "Server error. Try again." });
  }
}
