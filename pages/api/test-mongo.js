// pages/api/test-mongo.js
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("ai_interview"); // database name
    const collection = db.collection("questions");

    // Insert a sample document
    await collection.insertOne({
      message: "Hello from Next.js + MongoDB!",
      date: new Date()
    });

    // Fetch all documents
    const docs = await collection.find({}).toArray();

    res.status(200).json({ success: true, data: docs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}
