import express from "express"
import { userRouter } from "./routes/users"
import { authenticateToken } from "./middleware/auth"

const app = express()

app.use(express.json())
// Apply authentication middleware to all /api routes
app.all("/api/*", authenticateToken)
app.use("/api/users", userRouter)

export default app
