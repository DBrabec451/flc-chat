export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "No API key set" });
    }

    const { name, year, major, memory } = req.body;

    // Construct the prompt
    const prompt = `
    Write a short, casual marketing-style paragraph based on the following:
    - Name: ${name}
    - Year in school: ${year}
    - Major: ${major}
    - Memory: ${memory}

    Example style: "As a sophomore majoring in biology, Alex loved hiking in the San Juans with classmates. This experience made FLC feel like home."
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("OpenAI API error:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

    const reply = data.choices?.[0]?.message?.content || "No response generated.";
    res.status(200).json({ reply });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
