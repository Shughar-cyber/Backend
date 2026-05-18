
import express from "express"
import userRoutes from "./Routes/user.routes.js"
import { connectDB } from "./DB/index.js"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
const app = express()

const PORT = process.env.PORT || 3000

mongoose.connect(process.env.MONGODB_URI).then(() => console.log("Database connected")).catch((err) => console.error(err))

app.use(express.json())
app.use(cookieParser())
app.use("/api", userRoutes)

const start = async () => {
    const uri = process.env.MONGODB_URI
    if (!uri || uri.includes("<db_password>")) {
        console.error("MONGODB_URI is missing or still contains <db_password> placeholder. Update .env and retry.")
        process.exit(1)
    }
    try {
        await connectDB(uri)
        console.log("MongoDB connected")
    } catch (err) {
        console.error("MongoDB connection failed:", err.message)
        process.exit(1)
    }
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`)
    })
}

start()