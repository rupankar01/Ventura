"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { createStudyRoom } from "@/app/actions/study-rooms"

export function CreateRoomButton() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Not logged in",
        description: "Please log in to create study rooms.",
        variant: "destructive",
      })
      return
    }

    if (!name.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a room name.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      const room = await createStudyRoom({
        name,
        description: description || null,
        is_private: isPrivate,
      })

      // Navigate to the new room
      router.push(`/dashboard/study-rooms/${room._id}`)

      if (isPrivate) {
        toast({
          title: "Room created",
          description: `Your private room code is: ${room.room_code}`,
        })
      }

      setOpen(false)
    } catch (error) {
      console.error("Error creating room:", error)
      toast({
        title: "Error",
        description: "Failed to create study room.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Room
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Study Room</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Room Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Math Study Group"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will you be studying in this room?"
              rows={3}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="private" className="cursor-pointer">
              Private Room
            </Label>
            <Switch id="private" checked={isPrivate} onCheckedChange={setIsPrivate} />
          </div>
          {isPrivate && (
            <div className="text-sm text-muted-foreground">
              A random access code will be generated for your private room.
            </div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Room"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
