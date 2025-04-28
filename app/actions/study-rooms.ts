"use server"

import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import { getCurrentUser } from "./auth"

export type StudyRoom = {
  _id: string | ObjectId
  name: string
  description: string | null
  created_by: string | ObjectId
  is_private: boolean
  room_code: string | null
  created_at: Date
  participant_count?: number
}

export type RoomParticipant = {
  _id: string | ObjectId
  room_id: string | ObjectId
  user_id: string | ObjectId
  joined_at: Date
  user?: {
    _id: string | ObjectId
    name: string | null
    avatar_url: string | null
  }
}

export type ChatMessage = {
  _id: string | ObjectId
  room_id: string | ObjectId
  user_id: string | ObjectId
  message: string
  created_at: Date
  user?: {
    _id: string | ObjectId
    name: string | null
    avatar_url: string | null
  }
}

// Get all study rooms
export async function getStudyRooms() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const client = await clientPromise
  const db = client.db("ventura")

  // Get public rooms and rooms the user is part of
  const rooms = await db
    .collection("study_rooms")
    .aggregate([
      {
        $match: {
          $or: [{ is_private: false }, { created_by: user._id }],
        },
      },
      {
        $lookup: {
          from: "room_participants",
          localField: "_id",
          foreignField: "room_id",
          as: "participants",
        },
      },
      {
        $addFields: {
          participant_count: { $size: "$participants" },
        },
      },
      {
        $project: {
          participants: 0,
        },
      },
    ])
    .toArray()

  return rooms
}

// Create a new study room
export async function createStudyRoom(data: {
  name: string
  description: string | null
  is_private: boolean
}) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const client = await clientPromise
  const db = client.db("ventura")

  // Generate a random room code if private
  const roomCode = data.is_private ? Math.random().toString(36).substring(2, 8).toUpperCase() : null

  const room = {
    name: data.name,
    description: data.description,
    created_by: user._id,
    is_private: data.is_private,
    room_code: roomCode,
    created_at: new Date(),
  }

  const result = await db.collection("study_rooms").insertOne(room)
  const roomId = result.insertedId

  // Add the creator as a participant
  await db.collection("room_participants").insertOne({
    room_id: roomId,
    user_id: user._id,
    joined_at: new Date(),
  })

  return {
    ...room,
    _id: roomId,
  }
}

// Join a study room
export async function joinStudyRoom(roomId: string, roomCode?: string) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const client = await clientPromise
  const db = client.db("ventura")

  // Check if room exists
  const room = await db.collection("study_rooms").findOne({ _id: new ObjectId(roomId) })

  if (!room) {
    throw new Error("Room not found")
  }

  // Check if room is private and verify code
  if (room.is_private && room.room_code !== roomCode) {
    throw new Error("Invalid room code")
  }

  // Check if user is already a participant
  const existingParticipant = await db.collection("room_participants").findOne({
    room_id: new ObjectId(roomId),
    user_id: user._id,
  })

  if (!existingParticipant) {
    // Add user as participant
    await db.collection("room_participants").insertOne({
      room_id: new ObjectId(roomId),
      user_id: user._id,
      joined_at: new Date(),
    })
  }

  return { success: true }
}

// Get room details
export async function getStudyRoom(roomId: string) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const client = await clientPromise
  const db = client.db("ventura")

  const room = await db.collection("study_rooms").findOne({ _id: new ObjectId(roomId) })

  if (!room) {
    throw new Error("Room not found")
  }

  return room
}

// Get room participants
export async function getRoomParticipants(roomId: string) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const client = await clientPromise
  const db = client.db("ventura")

  const participants = await db
    .collection("room_participants")
    .aggregate([
      {
        $match: { room_id: new ObjectId(roomId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 1,
          room_id: 1,
          user_id: 1,
          joined_at: 1,
          "user._id": 1,
          "user.name": 1,
          "user.avatar_url": 1,
        },
      },
    ])
    .toArray()

  return participants
}

// Get room messages
export async function getRoomMessages(roomId: string) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const client = await clientPromise
  const db = client.db("ventura")

  const messages = await db
    .collection("chat_messages")
    .aggregate([
      {
        $match: { room_id: new ObjectId(roomId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 1,
          room_id: 1,
          user_id: 1,
          message: 1,
          created_at: 1,
          "user._id": 1,
          "user.name": 1,
          "user.avatar_url": 1,
        },
      },
      {
        $sort: { created_at: 1 },
      },
    ])
    .toArray()

  return messages
}

// Send a message in a room
export async function sendRoomMessage(roomId: string, message: string) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const client = await clientPromise
  const db = client.db("ventura")

  // Check if room exists
  const room = await db.collection("study_rooms").findOne({ _id: new ObjectId(roomId) })

  if (!room) {
    throw new Error("Room not found")
  }

  // Check if user is a participant
  const isParticipant = await db.collection("room_participants").findOne({
    room_id: new ObjectId(roomId),
    user_id: user._id,
  })

  if (!isParticipant) {
    throw new Error("Not a participant in this room")
  }

  // Send message
  const result = await db.collection("chat_messages").insertOne({
    room_id: new ObjectId(roomId),
    user_id: user._id,
    message,
    created_at: new Date(),
  })

  // Get the message with user info
  const newMessage = await db
    .collection("chat_messages")
    .aggregate([
      {
        $match: { _id: result.insertedId },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 1,
          room_id: 1,
          user_id: 1,
          message: 1,
          created_at: 1,
          "user._id": 1,
          "user.name": 1,
          "user.avatar_url": 1,
        },
      },
    ])
    .toArray()

  return newMessage[0]
}
