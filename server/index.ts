import express from "express"
import cors from "cors"
import { MongoClient, ObjectId } from "mongodb"
import dotenv from "dotenv"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb+srv://ismail:ismail123@cluster0.t63ghmf.mongodb.net/?appName=Cluster0"
const client = new MongoClient(MONGODB_URI)

let db: any

// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect()
    db = client.db("veda-office")
    console.log("Connected to MongoDB successfully!")
  } catch (error) {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  }
}

// GET all employees
app.get("/api/employees", async (req, res) => {
  try {
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

    res.json(formattedEmployees)
  } catch (error) {
    console.error("Error fetching employees:", error)
    res.status(500).json({ error: "Failed to fetch employees" })
  }
})

// POST new employee
app.post("/api/employees", async (req, res) => {
  try {
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

    res.json(insertedEmployee)
  } catch (error) {
    console.error("Error adding employee:", error)
    res.status(500).json({ error: "Failed to add employee" })
  }
})

// DELETE employee
app.delete("/api/employees/:id", async (req, res) => {
  try {
    const { id } = req.params

    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid employee ID" })
    }

    await db.collection("employees").deleteOne({ _id: new ObjectId(id) })

    res.json({ success: true })
  } catch (error) {
    console.error("Error deleting employee:", error)
    res.status(500).json({ error: "Failed to delete employee" })
  }
})

export default app

if (process.env.NODE_ENV !== "production") {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
} else {
  // Connect to DB on module load for serverless
  connectDB()
}
