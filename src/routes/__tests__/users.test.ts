import { PrismaClient } from "@prisma/client"
import request from "supertest"
import app from "../../app"

const prisma = new PrismaClient()

beforeEach(async () => {
  await prisma.user.deleteMany()
  await prisma.category.deleteMany()
})

afterAll(async () => {
  await prisma.user.deleteMany()
  await prisma.category.deleteMany()
  await prisma.$disconnect()
})

describe("User endpoints", () => {
  const testToken = process.env.API_TOKEN

  describe("POST /api/users", () => {
    it("should create a new user", async () => {
      const userData = {
        email: "john.doe@example.com",
        firstName: "John",
        lastName: "Doe",
        categories: [1, 2],
      }

      const response = await request(app).post("/api/users").set("Authorization", `Bearer ${testToken}`).send(userData)

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty("id")
      expect(response.body.email).toBe(userData.email)
      expect(response.body.firstName).toBe(userData.firstName)
      expect(response.body.lastName).toBe(userData.lastName)
    })

    it("should return 400 for invalid data", async () => {
      const userData = {
        email: "invalid-email",
        firstName: "",
        lastName: "Doe",
        categories: [], // Empty categories array should fail validation
      }

      const response = await request(app).post("/api/users").set("Authorization", `Bearer ${testToken}`).send(userData)

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty("error")
      expect(response.body.error).toBe("Validation error")
      expect(response.body).toHaveProperty("details")
    })

    it("should return 400 when categories are missing", async () => {
      const userData = {
        email: "john.doe@example.com",
        firstName: "John",
        lastName: "Doe",
        // Missing categories field
      }

      const response = await request(app).post("/api/users").set("Authorization", `Bearer ${testToken}`).send(userData)

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty("error")
    })

    it("should return 401 when no token is provided", async () => {
      const userData = {
        email: "john.doe@example.com",
        firstName: "John",
        lastName: "Doe",
        categories: [1, 2],
      }

      const response = await request(app).post("/api/users").send(userData)

      expect(response.status).toBe(401)
      expect(response.body).toHaveProperty("error")
    })
  })

  describe("GET /api/users", () => {
    it("should return all users with formatted categories", async () => {
      // Create a test category first
      const category = await prisma.category.create({
        data: {
          code: 1,
        },
      })

      // Create a test user with the category
      await prisma.user.create({
        data: {
          email: "john.doe@example.com",
          firstName: "John",
          lastName: "Doe",
          categories: {
            connect: {
              id: category.id,
            },
          },
        },
      })

      const response = await request(app).get("/api/users").set("Authorization", `Bearer ${testToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty("users")
      expect(Array.isArray(response.body.users)).toBe(true)
      expect(response.body.users.length).toBeGreaterThan(0)

      const user = response.body.users[0]
      expect(user).toHaveProperty("categories")
      expect(Array.isArray(user.categories)).toBe(true)
      expect(user.categories.every((code: number) => typeof code === "number")).toBe(true) // Verify all elements are numbers
    })

    it("should return 401 when no token is provided", async () => {
      const response = await request(app).get("/api/users")

      expect(response.status).toBe(401)
      expect(response.body).toHaveProperty("error")
    })
  })
})
