// pages/api/save-questions.js
import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Only POST requests are allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("ai_interview"); // your DB name
    const { jobTitle, category, question } = req.body;

    // ✅ Validation
    if (!jobTitle || !category || !question) {
      return res
        .status(400)
        .json({ success: false, error: "Missing fields: jobTitle, category, or question" });
    }

    // ✅ Insert single question
    const result = await db.collection("questions").insertOne({
      jobTitle,
      category,
      question, // single question string
      createdAt: new Date(),
    });

    return res
      .status(201)
      .json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    console.error("❌ Error saving question:", error);
    return res
      .status(500)
      .json({ success: false, error: error.message });
  }
}
