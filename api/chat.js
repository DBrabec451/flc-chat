export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "No API key set" });
    }

    const { history } = req.body;

    // System instruction: guide the chatbot’s behavior
    const systemMessage = {
      role: "system",
      content:
        "You are an assistant collecting marketing material for Fort Lewis College. " +
        "Always ask for the user's first name, year in school, major, and a memory from their time at Fort Lewis. " +
        "Once you have all four pieces of information, write a short casual marketing paragraph about them."
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [systemMessage, ...history], // conversation history + system
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("OpenAI API error:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
