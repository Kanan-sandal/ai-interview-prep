import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Only GET allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("ai_interview");

    const questions = await db.collection("questions").find({}).toArray();

    res.status(200).json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
