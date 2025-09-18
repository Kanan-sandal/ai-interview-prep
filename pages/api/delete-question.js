import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ success: false, error: "Only DELETE allowed" });
  }

  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ success: false, error: "Missing ID" });

    const client = await clientPromise;
    const db = client.db("ai_interview");

    await db.collection("questions").deleteOne({ _id: new ObjectId(id) });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
