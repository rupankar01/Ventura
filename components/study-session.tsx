"use client"

import { useState, useEffect } from "react"
import { Play, Pause, RotateCcw, BookOpen, Edit } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { createStudySession, updateStudySession } from "@/app/actions/study-sessions"

export function StudySession() {
  const [isRunning, setIsRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [subject, setSubject] = useState("Mathematics")
  const [sessionName, setSessionName] = useState("Study Session")
  const [sessionId, setSessionId] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1)
      }, 1000)
    } else if (interval) {
      clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning])

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      seconds.toString().padStart(2, "0"),
    ].join(":")
  }

  const startSession = async () => {
    if (!user) {
      toast({
        title: "Not logged in",
        description: "Please log in to track your study sessions.",
        variant: "destructive",
      })
      return
    }

    setIsRunning(true)

    try {
      const session = await createStudySession({
        subject,
        session_name: sessionName,
      })

      setSessionId(session._id.toString())
    } catch (error) {
      console.error("Error starting session:", error)
      toast({
        title: "Error",
        description: "Failed to start study session.",
        variant: "destructive",
      })
    }
  }

  const pauseSession = async () => {
    setIsRunning(false)

    if (!sessionId || !user) return

    try {
      await updateStudySession(sessionId, {
        end_time: new Date(),
        duration: seconds,
      })
    } catch (error) {
      console.error("Error pausing session:", error)
      toast({
        title: "Error",
        description: "Failed to update study session.",
        variant: "destructive",
      })
    }
  }

  const resetTimer = () => {
    setIsRunning(false)
    setSeconds(0)
    setSessionId(null)
  }

  const toggleTimer = () => {
    if (isRunning) {
      pauseSession()
    } else {
      startSession()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-medium">{sessionName}</h3>
            <p className="text-sm text-muted-foreground">{subject}</p>
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit Session
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Study Session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="session-name">Session Name</Label>
                <Input id="session-name" value={sessionName} onChange={(e) => setSessionName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Literature">Literature</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col items-center">
        <div className="text-6xl font-mono font-bold mb-6">{formatTime(seconds)}</div>
        <div className="flex gap-4">
          <Button variant={isRunning ? "destructive" : "default"} size="lg" onClick={toggleTimer}>
            {isRunning ? (
              <>
                <Pause className="mr-2 h-5 w-5" />
                Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" />
                Start
              </>
            )}
          </Button>
          <Button variant="outline" size="lg" onClick={resetTimer} disabled={seconds === 0}>
            <RotateCcw className="mr-2 h-5 w-5" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}
