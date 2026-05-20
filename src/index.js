
import express from "express"
import userRoutes from "./Routes/user.routes.js"
import { connectDB } from "./db/index.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE"],
    credentials: true
}))
app.use("/api", userRoutes)

const start = async () => {
    const uri = process.env.MONGODB_URI
    if (!uri || uri.includes("<db_password>")) {
        console.error("MONGODB_URI is missing or still contains <db_password> placeholder. Update .env and retry.")
        return
    }
    try {
        await connectDB(uri)
        console.log("MongoDB connected")
    } catch (err) {
        console.error("MongoDB connection failed:", err.message)
    }
}

// Start database connection independently
start()

// Start server independently (only if not running inside a Vercel serverless function environment)
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`)
    })
}

export default app