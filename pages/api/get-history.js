// pages/api/get-history.js
import clientPromise from "@/lib/mongodb";

function getNextDifficulty(history) {
  if (!history.length) return "easy";

  const recent = history.slice(-5);
  const score = recent.filter((q) => q.isCorrect).length / recent.length;

  if (score >= 0.8) return "hard";
  if (score >= 0.5) return "medium";
  return "easy";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Only POST allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("ai_interview");
    const { jobTitle, category } = req.body;

    if (!jobTitle || !category) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    const history = await db
      .collection("practice_sessions")
      .find({ jobTitle, category })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    const nextDifficulty = getNextDifficulty(history);

    return res.status(200).json({ success: true, nextDifficulty, history });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
