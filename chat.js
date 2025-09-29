// /api/chat.js
export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  let body = {};
  try { body = await req.json(); } catch {}
  const messages = Array.isArray(body.messages) ? body.messages : [];

  // Fallback starter message if empty
  const safeMessages = messages.length
    ? messages
    : [{ role: "user", content: "Hello! Tell me about Fort Lewis College." }];

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",     // widely available, low-latency
        messages: safeMessages,
        temperature: 0.7
      })
    });

    if (!r.ok) {
      const err = await r.text();
      return new Response(
        JSON.stringify({ error: true, status: r.status, body: err }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await r.json();
    const text = data?.choices?.[0]?.message?.content ?? "";
    return new Response(JSON.stringify({ text }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: true, message: String(e) }), {
      headers: { "Content-Type": "application/json" }
    });
  }
}
