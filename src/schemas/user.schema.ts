import { z } from "zod"

export const createUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  categories: z.array(z.number()).min(1),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
