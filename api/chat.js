export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "No API key set" });

    // Read raw JSON body safely (Vercel Node function)
    let raw = "";
    await new Promise((resolve, reject) => {
      req.on("data", (c) => (raw += c));
      req.on("end", resolve);
      req.on("error", reject);
    });
    let payload = {};
    try { payload = JSON.parse(raw || "{}"); } catch { return res.status(400).json({ error:"Invalid JSON" }); }

    const history = Array.isArray(payload.history) ? payload.history : [];

    const systemMessage = {
      role: "system",
      content:
        "You are an assistant collecting short testimonials for Fort Lewis College. " +
        "Politely and step-by-step collect four fields: FIRST NAME, YEAR IN SCHOOL, MAJOR, and one FAVORITE MEMORY at Fort Lewis. " +
        "Ask only one question at a time. When you have all four, output a single upbeat paragraph (3–6 sentences) " +
        "summarizing the student's experience, suitable for marketing. Then ask if they'd like to revise anything."
    };

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [systemMessage, ...history],
        temperature: 0.7
      }),
    });

    const data = await r.json();
    if (data?.error) return res.status(500).json({ error: data.error.message });

    const reply = data?.choices?.[0]?.message?.content || "";
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
