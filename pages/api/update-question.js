import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ success: false, error: "Only PATCH allowed" });
  }

  try {
    const { id, solved, tag } = req.body;
    if (!id) return res.status(400).json({ success: false, error: "Missing ID" });

    const client = await clientPromise;
    const db = client.db("ai_interview");

    const updateFields = {};
    if (solved !== undefined) updateFields.solved = solved;
    if (tag) updateFields.tag = tag;

    await db.collection("questions").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
