import { v4 as uuidv4 } from "uuid"

// Mock user data
export type User = {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
}

// Mock study session data
export type StudySession = {
  id: string
  user_id: string
  subject: string | null
  session_name: string | null
  start_time: string
  end_time: string | null
  duration: number | null
  created_at: string
}

// Mock study room data
export type StudyRoom = {
  id: string
  name: string
  description: string | null
  created_by: string
  is_private: boolean
  room_code: string | null
  created_at: string
  participant_count: number
}

// Mock room participant data
export type RoomParticipant = {
  id: string
  room_id: string
  user_id: string
  joined_at: string
  profiles: {
    id: string
    name: string | null
    avatar_url: string | null
  }
}

// Mock chat message data
export type ChatMessage = {
  id: string
  room_id: string
  user_id: string
  message: string
  created_at: string
  profiles: {
    id: string
    name: string | null
    avatar_url: string | null
  }
}

// Mock leaderboard user data
export type LeaderboardUser = {
  id: string
  name: string | null
  avatar_url: string | null
  total_study_time: number
  total_sessions: number
  current_streak: number
  longest_streak: number
}

// Create mock users
export const mockUsers: User[] = [
  {
    id: "1",
    email: "user@example.com",
    name: "Demo User",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
  },
  {
    id: "2",
    email: "jane@example.com",
    name: "Jane Smith",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
  },
  {
    id: "3",
    email: "john@example.com",
    name: "John Doe",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
  },
  {
    id: "4",
    email: "alex@example.com",
    name: "Alex Johnson",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
  },
  {
    id: "5",
    email: "sam@example.com",
    name: "Sam Wilson",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
  },
]

// Create mock study sessions
export const createMockStudySessions = (userId: string): StudySession[] => {
  const now = new Date()
  const sessions: StudySession[] = []

  // Create sessions for the past 7 days
  for (let i = 0; i < 12; i++) {
    const date = new Date()
    date.setDate(now.getDate() - Math.floor(Math.random() * 7))
    date.setHours(Math.floor(Math.random() * 24))

    const duration = Math.floor(Math.random() * 120) + 30 // 30-150 minutes
    const endDate = new Date(date)
    endDate.setMinutes(endDate.getMinutes() + duration)

    const subjects = ["Mathematics", "Physics", "Computer Science", "Literature", "History"]
    const subject = subjects[Math.floor(Math.random() * subjects.length)]

    sessions.push({
      id: uuidv4(),
      user_id: userId,
      subject,
      session_name: `${subject} Study Session`,
      start_time: date.toISOString(),
      end_time: endDate.toISOString(),
      duration: duration * 60, // Convert to seconds
      created_at: date.toISOString(),
    })
  }

  return sessions
}

// Create mock study rooms
export const mockStudyRooms: StudyRoom[] = [
  {
    id: "1",
    name: "Mathematics Study Group",
    description: "A group for studying advanced mathematics topics",
    created_by: "2",
    is_private: false,
    room_code: null,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    participant_count: 5,
  },
  {
    id: "2",
    name: "Physics Discussion",
    description: "Discuss physics problems and concepts",
    created_by: "3",
    is_private: false,
    room_code: null,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    participant_count: 3,
  },
  {
    id: "3",
    name: "Computer Science Projects",
    description: "Work on programming projects together",
    created_by: "4",
    is_private: true,
    room_code: "CS1234",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    participant_count: 2,
  },
  {
    id: "4",
    name: "Literature Analysis",
    description: "Analyze classic literature works",
    created_by: "5",
    is_private: false,
    room_code: null,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    participant_count: 4,
  },
]

// Create mock room participants
export const createMockRoomParticipants = (roomId: string): RoomParticipant[] => {
  return mockUsers.slice(0, Math.floor(Math.random() * 4) + 1).map((user) => ({
    id: uuidv4(),
    room_id: roomId,
    user_id: user.id,
    joined_at: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString(),
    profiles: {
      id: user.id,
      name: user.name,
      avatar_url: user.avatar_url,
    },
  }))
}

// Create mock chat messages
export const createMockChatMessages = (roomId: string): ChatMessage[] => {
  const messages: ChatMessage[] = []
  const messageCount = Math.floor(Math.random() * 10) + 5

  for (let i = 0; i < messageCount; i++) {
    const user = mockUsers[Math.floor(Math.random() * mockUsers.length)]
    const date = new Date(Date.now() - Math.floor(Math.random() * 60) * 60 * 1000)

    messages.push({
      id: uuidv4(),
      room_id: roomId,
      user_id: user.id,
      message: getRandomMessage(),
      created_at: date.toISOString(),
      profiles: {
        id: user.id,
        name: user.name,
        avatar_url: user.avatar_url,
      },
    })
  }

  // Sort messages by created_at
  return messages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
}

// Create mock leaderboard data
export const mockLeaderboard: LeaderboardUser[] = mockUsers
  .map((user) => {
    const totalTime = Math.floor(Math.random() * 3000) + 500 // 500-3500 minutes
    return {
      id: user.id,
      name: user.name,
      avatar_url: user.avatar_url,
      total_study_time: totalTime,
      total_sessions: Math.floor(totalTime / 45),
      current_streak: Math.floor(Math.random() * 7) + 1,
      longest_streak: Math.floor(Math.random() * 14) + 7,
    }
  })
  .sort((a, b) => b.total_study_time - a.total_study_time)

// Helper function to get random messages
function getRandomMessage(): string {
  const messages = [
    "Has anyone started on the homework yet?",
    "I'm stuck on problem 3, any hints?",
    "Great session today!",
    "Can someone explain the concept we covered yesterday?",
    "I found a helpful resource for this topic: [link]",
    "When are we meeting next?",
    "I'll be a few minutes late to the study session",
    "Did anyone take notes from the last lecture?",
    "This is much easier to understand now, thanks!",
    "Should we focus on chapter 5 or 6 next?",
    "I'm making good progress on the project",
    "Does anyone have the formula sheet?",
    "Let's take a 5-minute break",
    "I think I understand it now",
    "Can we go over that one more time?",
  ]

  return messages[Math.floor(Math.random() * messages.length)]
}

// Local storage helpers
export const saveToLocalStorage = (key: string, data: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data))
  }
}

export const getFromLocalStorage = (key: string) => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  }
  return null
}

// Initialize local storage with mock data
export const initializeLocalStorage = (userId: string) => {
  // Check if data already exists
  if (!getFromLocalStorage("study_sessions")) {
    saveToLocalStorage("study_sessions", createMockStudySessions(userId))
  }

  if (!getFromLocalStorage("study_rooms")) {
    saveToLocalStorage("study_rooms", mockStudyRooms)
  }

  if (!getFromLocalStorage("leaderboard")) {
    saveToLocalStorage("leaderboard", mockLeaderboard)
  }

  // Initialize room participants and chat messages for each room
  mockStudyRooms.forEach((room) => {
    if (!getFromLocalStorage(`room_participants_${room.id}`)) {
      saveToLocalStorage(`room_participants_${room.id}`, createMockRoomParticipants(room.id))
    }

    if (!getFromLocalStorage(`chat_messages_${room.id}`)) {
      saveToLocalStorage(`chat_messages_${room.id}`, createMockChatMessages(room.id))
    }
  })
}
