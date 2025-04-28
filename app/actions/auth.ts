"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import type { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import { hashPassword, comparePasswords } from "@/lib/auth-utils"

export type User = {
  _id: string | ObjectId
  email: string
  name: string | null
  avatar_url: string | null
  password?: string
  created_at: Date
}

// Create a session for the user
export async function createSession(user: User) {
  const sessionId = uuidv4()
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  const client = await clientPromise
  const db = client.db("ventura")

  await db.collection("sessions").insertOne({
    sessionId,
    userId: user._id,
    expires,
  })

  // Set the session cookie
  cookies().set("session", sessionId, {
    httpOnly: true,
    expires,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })
}

// Get the current user from the session
export async function getCurrentUser() {
  const sessionId = cookies().get("session")?.value

  if (!sessionId) {
    return null
  }

  const client = await clientPromise
  const db = client.db("ventura")

  const session = await db.collection("sessions").findOne({
    sessionId,
    expires: { $gt: new Date() },
  })

  if (!session) {
    return null
  }

  const user = await db.collection("users").findOne({ _id: session.userId })

  if (!user) {
    return null
  }

  // Don't return the password
  const { password, ...userWithoutPassword } = user

  return userWithoutPassword as User
}

// Sign up a new user
export async function signUp(email: string, password: string, name: string) {
  const client = await clientPromise
  const db = client.db("ventura")

  // Check if user already exists
  const existingUser = await db.collection("users").findOne({ email })

  if (existingUser) {
    throw new Error("User already exists")
  }

  // Hash the password
  const hashedPassword = await hashPassword(password)

  // Create the user
  const result = await db.collection("users").insertOne({
    email,
    password: hashedPassword,
    name,
    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    created_at: new Date(),
  })

  const user = await db.collection("users").findOne({ _id: result.insertedId })

  if (!user) {
    throw new Error("Failed to create user")
  }

  // Create a session for the user
  await createSession(user as User)

  return { success: true }
}

// Sign in a user
export async function signIn(email: string, password: string) {
  const client = await clientPromise
  const db = client.db("ventura")

  // Find the user
  const user = await db.collection("users").findOne({ email })

  if (!user) {
    throw new Error("Invalid email or password")
  }

  // Check the password
  const passwordMatch = await comparePasswords(password, user.password)

  if (!passwordMatch) {
    throw new Error("Invalid email or password")
  }

  // Create a session for the user
  await createSession(user as User)

  return { success: true }
}

// Sign out a user
export async function signOut() {
  const sessionId = cookies().get("session")?.value

  if (sessionId) {
    const client = await clientPromise
    const db = client.db("ventura")

    await db.collection("sessions").deleteOne({ sessionId })
  }

  cookies().delete("session")
  redirect("/")
}

// Demo sign in (for development purposes)
export async function demoSignIn() {
  const client = await clientPromise
  const db = client.db("ventura")

  // Check if demo user exists
  let user = await db.collection("users").findOne({ email: "demo@example.com" })

  if (!user) {
    // Create demo user
    const hashedPassword = await hashPassword("demopassword")

    const result = await db.collection("users").insertOne({
      email: "demo@example.com",
      password: hashedPassword,
      name: "Demo User",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
      created_at: new Date(),
    })

    user = await db.collection("users").findOne({ _id: result.insertedId })
  }

  if (!user) {
    throw new Error("Failed to create demo user")
  }

  // Create a session for the user
  await createSession(user as User)

  return { success: true }
}
