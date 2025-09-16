// pages/api/save-progress.js
import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Only POST allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("ai_interview");
    const { jobTitle, category, question, difficulty, isCorrect } = req.body;

    if (!jobTitle || !category || !question || !difficulty) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    const result = await db.collection("practice_sessions").insertOne({
      jobTitle,
      category,
      question,
      difficulty,
      isCorrect,
      createdAt: new Date(),
    });

    return res.status(201).json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
