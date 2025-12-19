import type { VercelRequest, VercelResponse } from "@vercel/node"
import { MongoClient } from "mongodb"

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb+srv://ismail:ismail123@cluster0.t63ghmf.mongodb.net/?appName=Cluster0"

let cachedClient: MongoClient | null = null
let cachedDb: any = null

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = new MongoClient(MONGODB_URI)
  await client.connect()
  const db = client.db("veda-office")

  cachedClient = client
  cachedDb = db

  return { client, db }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true")
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") {
    res.status(200).end()
    return
  }

  try {
    const { db } = await connectToDatabase()

    if (req.method === "GET") {
      // GET all employees
      const employees = await db.collection("employees").find({}).toArray()

      const formattedEmployees = employees.map((emp: any) => ({
        id: emp._id.toString(),
        name: emp.name,
        designation: emp.designation,
        department: emp.department,
        phone: emp.phone,
        avatar: emp.avatar || "",
        status: emp.status || "offline",
      }))

      return res.status(200).json(formattedEmployees)
    }

    if (req.method === "POST") {
      // POST new employee
      const { name, designation, department, phone } = req.body

      if (!name || !designation || !department || !phone) {
        return res.status(400).json({ error: "Missing required fields" })
      }

      const newEmployee = {
        name,
        designation,
        department,
        phone,
        avatar: "",
        status: "online",
        createdAt: new Date(),
      }

      const result = await db.collection("employees").insertOne(newEmployee)

      const insertedEmployee = {
        id: result.insertedId.toString(),
        ...newEmployee,
      }

      return res.status(200).json(insertedEmployee)
    }

    return res.status(405).json({ error: "Method not allowed" })
  } catch (error) {
    console.error("API Error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}
