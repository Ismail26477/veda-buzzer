import type { VercelRequest, VercelResponse } from "@vercel/node"
import { MongoClient, ObjectId } from "mongodb"

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://ismail:ismail123@cluster0.t63ghmf.mongodb.net/veda-office?retryWrites=true&w=majority"

let cachedClient: MongoClient | null = null
let cachedDb: any = null

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  await client.connect()
  const db = client.db("veda-office")

  cachedClient = client
  cachedDb = db

  return { client, db }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Credentials", "true")
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept, Authorization")

  if (req.method === "OPTIONS") {
    res.status(200).end()
    return
  }

  try {
    const { db } = await connectToDatabase()
    const { id } = req.query

    if (req.method === "DELETE") {
      if (!id || typeof id !== "string" || !ObjectId.isValid(id)) {
        console.log("[v0] Invalid ID:", id)
        return res.status(400).json({ error: "Invalid employee ID" })
      }

      console.log("[v0] Deleting employee:", id)
      await db.collection("employees").deleteOne({ _id: new ObjectId(id) })

      console.log("[v0] Employee deleted successfully")
      return res.status(200).json({ success: true })
    }

    return res.status(405).json({ error: "Method not allowed" })
  } catch (error) {
    console.error("[v0] API Error:", error)
    return res.status(500).json({ error: "Internal server error", details: (error as Error).message })
  }
}
