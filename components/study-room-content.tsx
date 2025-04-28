"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Send, Users, ArrowLeft } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StudySession } from "@/components/study-session"
import { toast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getStudyRoom, getRoomParticipants, getRoomMessages, sendRoomMessage } from "@/app/actions/study-rooms"
import type { StudyRoom, RoomParticipant, ChatMessage } from "@/app/actions/study-rooms"

export function StudyRoomContent({ roomId }: { roomId: string }) {
  const [room, setRoom] = useState<StudyRoom | null>(null)
  const [participants, setParticipants] = useState<RoomParticipant[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    fetchRoomData()

    // Set up interval to poll for new messages
    const interval = setInterval(() => {
      fetchMessages()
    }, 5000)

    return () => clearInterval(interval)
  }, [roomId, user])

  const fetchRoomData = async () => {
    try {
      setLoading(true)

      // Fetch room details
      const roomData = await getStudyRoom(roomId)
      setRoom(roomData)

      // Fetch participants
      const participantsData = await getRoomParticipants(roomId)
      setParticipants(participantsData)

      // Fetch messages
      await fetchMessages()
    } catch (error) {
      console.error("Error fetching room data:", error)
      toast({
        title: "Error",
        description: "Failed to load study room data.",
        variant: "destructive",
      })
      router.push("/dashboard/study-rooms")
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async () => {
    try {
      const messagesData = await getRoomMessages(roomId)
      setMessages(messagesData)
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    scrollToBottom()
    if (!user || !newMessage.trim()) return

    try {
      const message = await sendRoomMessage(roomId, newMessage.trim())

      // Update local state
      setMessages((prev) => [...prev, message])
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      })
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const leaveRoom = async () => {
    router.push("/dashboard/study-rooms")
  }

  if (loading) {
    return (
      <main className="flex-1 p-4 md:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </main>
    )
  }

  if (!room) {
    return (
      <main className="flex-1 p-4 md:p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Room not found</h3>
          <Button onClick={() => router.push("/dashboard/study-rooms")}>Back to Study Rooms</Button>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" size="icon" onClick={leaveRoom}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{room.name}</h1>
            <p className="text-sm text-muted-foreground">{room.description}</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Study Timer</h2>
          <StudySession />
        </div>

        <div className="rounded-lg border bg-card shadow-sm">
          <div className="p-4 border-b">
            <h2 className="font-medium">Chat</h2>
          </div>
          <div className="p-4 h-[300px] overflow-y-auto flex flex-col gap-3">
            {messages.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No messages yet. Start the conversation!</p>
            ) : (
              messages.map((message) => (
                <div
                  key={message._id.toString()}
                  className={`flex gap-2 ${message.user_id === user?._id ? "justify-end" : "justify-start"}`}
                >
                  {message.user_id !== user?._id && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.user?.avatar_url || undefined} />
                      <AvatarFallback>{message.user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.user_id === user?._id ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {message.user_id !== user?._id && (
                      <p className="text-xs font-medium mb-1">{message.user?.name || "Anonymous"}</p>
                    )}
                    <p className="text-sm">{message.message}</p>
                    <p className="text-xs opacity-70 mt-1 text-right">
                      {new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
            <Input placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Participants</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-1" />
              <span>{participants.length}</span>
            </div>
          </div>
          <div className="space-y-3">
            {participants.map((participant) => (
              <div key={participant._id.toString()} className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={participant.user?.avatar_url || undefined} />
                  <AvatarFallback>{participant.user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{participant.user?.name || "Anonymous"}</p>
                  <p className="text-xs text-muted-foreground">
                    Joined{" "}
                    {new Date(participant.joined_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {room.is_private && room.room_code && (
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="font-medium mb-2">Room Code</h3>
            <p className="text-sm mb-2">Share this code with others to join:</p>
            <div className="bg-muted p-2 rounded text-center font-mono">{room.room_code}</div>
          </div>
        )}

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="font-medium mb-2">Room Info</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created</span>
              <span>{new Date(room.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type</span>
              <span>{room.is_private ? "Private" : "Public"}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
