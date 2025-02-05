import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { z } from "zod"

import { logger } from "@rharkor/logger"

import { env } from "../../lib/env"
import { prisma } from "../../lib/prisma"
import { apiInputFromSchema, Session } from "../../lib/types"

import { signInResponseSchema, signInSchema, signUpSchema } from "./schemas"

// Ensure that the JWT secret is defined
const JWT_SECRET = env.AUTH_SECRET
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable must be set")
}

// Configure salt rounds for bcrypt; default to 10 if not provided
const SALT_ROUNDS = 10

export async function signIn({ input }: apiInputFromSchema<typeof signInSchema>) {
  try {
    const { email, password } = input

    // Look up the user by email
    const user = await prisma.user.findUnique({ where: { email }, select: { password: true, id: true, email: true } })
    if (!user) {
      logger.warn(`Sign in attempt with non-existing email: ${email}`)
      throw new Error("Invalid credentials")
    }

    // Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      logger.warn(`Sign in attempt with invalid password for email: ${email}`)
      throw new Error("Invalid credentials")
    }

    // Generate a JWT for the signed in user
    try {
      const payload: Session = {
        userId: user.id,
        email: user.email,
        iat: Date.now(),
        exp: Date.now() + 365 * 24 * 60 * 60 * 1000,
      }
      const token = jwt.sign(payload, JWT_SECRET)
      logger.debug(`User signed in: ${user.id}`)

      const data: z.infer<ReturnType<typeof signInResponseSchema>> = { token }
      return data
    } catch (error) {
      logger.error(`Error generating JWT for user: ${user.id}`, error)
      throw new Error("Failed to generate access token")
    }
  } catch (error) {
    logger.error("Error signing in", error)
    throw new Error("Failed to sign in")
  }
}

export async function signUp({ input }: apiInputFromSchema<typeof signUpSchema>) {
  try {
    const { email, password, username } = input

    // Check if a user with the given email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      throw new Error("User already exists")
    }

    // Hash the user password before storing it
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    // Create the new user with the hashed password
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
      },
    })

    // Generate a JWT for the new user
    try {
      const payload: Session = {
        userId: newUser.id,
        email: newUser.email,
        iat: Date.now(),
        exp: Date.now() + 365 * 24 * 60 * 60 * 1000,
      }
      const token = jwt.sign(payload, JWT_SECRET)
      logger.debug(`User signed up: ${newUser.id}`)

      const data: z.infer<ReturnType<typeof signInResponseSchema>> = { token }
      return data
    } catch (error) {
      logger.error(`Error generating JWT for new user: ${newUser.id}`, error)
      throw new Error("Failed to generate access token")
    }
  } catch (error) {
    logger.error("Error signing up", error)
    throw new Error("Failed to sign up")
  }
}
