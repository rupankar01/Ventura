"use server"

import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import { getCurrentUser } from "./auth"

export type StudySession = {
  _id: string | ObjectId
  user_id: string | ObjectId
  subject: string | null
  session_name: string | null
  start_time: Date
  end_time: Date | null
  duration: number | null
  created_at: Date
}

// Get study sessions for the current user
export async function getStudySessions() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const client = await clientPromise
  const db = client.db("ventura")

  const sessions = await db.collection("study_sessions").find({ user_id: user._id }).sort({ start_time: -1 }).toArray()

  return sessions
}

// Create a new study session
export async function createStudySession(data: {
  subject: string | null
  session_name: string | null
}) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const client = await clientPromise
  const db = client.db("ventura")

  const session = {
    user_id: user._id,
    subject: data.subject,
    session_name: data.session_name,
    start_time: new Date(),
    end_time: null,
    duration: null,
    created_at: new Date(),
  }

  const result = await db.collection("study_sessions").insertOne(session)

  return {
    ...session,
    _id: result.insertedId,
  }
}

// Update a study session
export async function updateStudySession(
  id: string,
  data: {
    end_time?: Date
    duration?: number
  },
) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const client = await clientPromise
  const db = client.db("ventura")

  const result = await db
    .collection("study_sessions")
    .updateOne({ _id: new ObjectId(id), user_id: user._id }, { $set: data })

  if (result.matchedCount === 0) {
    throw new Error("Session not found or not authorized")
  }

  return { success: true }
}

// Get study sessions for analytics
export async function getStudySessionsForAnalytics(timeRange: "week" | "month" | "year") {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const client = await clientPromise
  const db = client.db("ventura")

  // Calculate date range
  const now = new Date()
  const startDate = new Date()

  if (timeRange === "week") {
    startDate.setDate(now.getDate() - 7)
  } else if (timeRange === "month") {
    startDate.setMonth(now.getMonth() - 1)
  } else if (timeRange === "year") {
    startDate.setFullYear(now.getFullYear() - 1)
  }

  const sessions = await db
    .collection("study_sessions")
    .find({
      user_id: user._id,
      start_time: { $gte: startDate },
    })
    .toArray()

  return sessions
}
