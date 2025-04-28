"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Users, Clock, Lock, Unlock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { getStudyRooms, joinStudyRoom } from "@/app/actions/study-rooms"
import type { StudyRoom } from "@/app/actions/study-rooms"

export function StudyRoomsList() {
  const [rooms, setRooms] = useState<StudyRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [roomCode, setRoomCode] = useState("")
  const [joiningRoom, setJoiningRoom] = useState<string | null>(null)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      setLoading(true)
      const roomsData = await getStudyRooms()
      setRooms(roomsData)
    } catch (error) {
      console.error("Error fetching rooms:", error)
      toast({
        title: "Error",
        description: "Failed to load study rooms.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleJoinRoom = async (roomId: string, isPrivate: boolean, code: string | null) => {
    if (!user) {
      toast({
        title: "Not logged in",
        description: "Please log in to join study rooms.",
        variant: "destructive",
      })
      return
    }

    try {
      // If room is private, check code
      if (isPrivate) {
        setJoiningRoom(roomId)
        if (!roomCode) return

        if (roomCode !== code) {
          toast({
            title: "Invalid code",
            description: "The room code you entered is incorrect.",
            variant: "destructive",
          })
          return
        }
      }

      // Join the room
      await joinStudyRoom(roomId, roomCode)

      // Navigate to the room
      router.push(`/dashboard/study-rooms/${roomId}`)
    } catch (error) {
      console.error("Error joining room:", error)
      toast({
        title: "Error",
        description: "Failed to join study room.",
        variant: "destructive",
      })
    } finally {
      setJoiningRoom(null)
      setRoomCode("")
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/3"></div>
            </CardContent>
            <CardFooter>
              <div className="h-9 bg-muted rounded w-full"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (rooms.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No study rooms available</h3>
        <p className="text-muted-foreground mb-6">Create a new room to get started!</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <Card key={room._id.toString()}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {room.name}
              {room.is_private ? (
                <Lock className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Unlock className="h-4 w-4 text-muted-foreground" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{room.description || "No description provided."}</p>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-1" />
              <span>{room.participant_count || 0} participants</span>
              <Clock className="h-4 w-4 ml-4 mr-1" />
              <span>{new Date(room.created_at).toLocaleDateString()}</span>
            </div>
          </CardContent>
          <CardFooter>
            {joiningRoom === room._id.toString() && room.is_private ? (
              <div className="flex w-full gap-2">
                <Input placeholder="Enter room code" value={roomCode} onChange={(e) => setRoomCode(e.target.value)} />
                <Button onClick={() => handleJoinRoom(room._id.toString(), room.is_private, room.room_code)}>
                  Join
                </Button>
              </div>
            ) : (
              <Button
                className="w-full"
                onClick={() => handleJoinRoom(room._id.toString(), room.is_private, room.room_code)}
              >
                Join Room
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
