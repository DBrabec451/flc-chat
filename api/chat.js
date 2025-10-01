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

    const prompt = `
    You are helping a student write a short first-person marketing paragraph about their time at Fort Lewis College.
    Write the paragraph as if the student is speaking about themselves in first person.
    Include their name, year in school, major, and the memory they shared.
    Keep the tone casual and authentic, like a student testimonial.

    Name: ${name}
    Year: ${year}
    Major: ${major}
    Memory: ${memory}
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200
      })
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
