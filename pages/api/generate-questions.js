// pages/api/generate-questions.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { jobTitle, category, difficulty = "easy" } = req.body;

  if (!jobTitle || !category) {
    return res.status(400).json({ success: false, error: "Missing fields" });
  }

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate 5 ${difficulty}-level ${category} interview questions for the role ${jobTitle}.`
                }
              ]
            }
          ]
        }),
      }
    );

    const raw = await geminiRes.json();
    const text = raw.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const cleaned = text
      .split("\n")
      .map((line) => line.replace(/^\d+[\).\s-]+/, "").trim())
      .filter((line) => line.length > 0);

    return res.status(200).json({ success: true, questions: cleaned });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
