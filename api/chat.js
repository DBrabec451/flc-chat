export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "No API key set" });
    }

    const { message, history } = req.body;

    // System instructions for the chatbot
    const systemPrompt = `
    You are an assistant collecting marketing testimonials for Fort Lewis College.
    Please guide the user to provide:
    1. Their first name
    2. Their year in school
    3. Their major
    4. A favorite memory from their time at Fort Lewis.
    
    Collect these step by step (one at a time).
    Once you have all four, respond with a polished paragraph about their experience.
    Keep it casual, upbeat, and student-friendly.
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...(history || []),
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
