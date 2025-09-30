export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    console.log("API KEY used (first 8 chars):", apiKey ? apiKey.slice(0, 8) : "MISSING");

    if (!apiKey) {
      return res.status(500).json({ error: "No API key set" });
    }

    const { message } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",   // lightweight model, cheaper/faster
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();
    console.log("OpenAI response:", data);

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
