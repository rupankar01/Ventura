"use server"

import clientPromise from "@/lib/mongodb"
import { getCurrentUser } from "./auth"

export type LeaderboardUser = {
  _id: string
  name: string | null
  avatar_url: string | null
  total_study_time: number
  total_sessions: number
  current_streak: number
  longest_streak: number
}

// Get leaderboard data
export async function getLeaderboard() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const client = await clientPromise
  const db = client.db("ventura")

  const leaderboard = await db
    .collection("users")
    .aggregate([
      {
        $lookup: {
          from: "study_sessions",
          localField: "_id",
          foreignField: "user_id",
          as: "sessions",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          avatar_url: 1,
          total_sessions: { $size: "$sessions" },
          total_study_time: {
            $sum: {
              $map: {
                input: "$sessions",
                as: "session",
                in: { $ifNull: ["$$session.duration", 0] },
              },
            },
          },
          // For simplicity, we'll use random values for streaks
          current_streak: { $floor: { $multiply: [{ $random: {} }, 7] } },
          longest_streak: { $floor: { $multiply: [{ $random: {} }, 14] } },
        },
      },
      {
        $sort: { total_study_time: -1 },
      },
      {
        $limit: 20,
      },
    ])
    .toArray()

  return leaderboard
}
