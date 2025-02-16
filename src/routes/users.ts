import { Router } from "express"
import { PrismaClient } from "@prisma/client"
import { createUserSchema } from "../schemas/user.schema"
import { ZodError } from "zod"

const router = Router()
const prisma = new PrismaClient()

// CREATE USER
router.post("/", async (req, res) => {
  try {
    const { categories, ...data } = createUserSchema.parse(req.body)

    const user = await prisma.user.create({
      data: {
        ...data,
        categories: {
          connectOrCreate: categories.map((categoryCode) => ({
            where: { code: categoryCode },
            create: { code: categoryCode },
          })),
        },
      },
    })

    res.status(201).json(user)
  } catch (error) {
    // VALIDATION ERROR
    if (error instanceof ZodError) {
      res.status(400).json({
        error: "Validation error",
        details: error.errors,
      })
      return
    }
    // ELSE, GENERAL SERVER ERROR
    res.status(500).json({
      error: "Internal server error",
    })
  }
})

// GET ALL USERS
router.get("/", async (_req, res) => {
  try {
    const users = await prisma.user.findMany({ include: { categories: true } })
    // Format the response to simplify categories
    const formattedUsers = users.map((user) => ({
      ...user,
      categories: user.categories.map((category) => category.code),
    }))
    res.json({ users: formattedUsers })
  } catch (_error) {
    res.status(500).json({
      error: "Internal server error",
    })
  }
})

export { router as userRouter }
