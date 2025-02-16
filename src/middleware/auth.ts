import { Request, Response, NextFunction } from "express"

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing authentication token" })
    return
  }

  const token = authHeader.split(" ")[1]

  if (token !== process.env.API_TOKEN) {
    res.status(401).json({ error: "Invalid authentication token" })
    return
  }

  next()
}
