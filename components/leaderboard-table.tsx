"use client"

import { useState, useEffect } from "react"
import { Trophy, Clock, Flame } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { getLeaderboard } from "@/app/actions/leaderboard"
import type { LeaderboardUser } from "@/app/actions/leaderboard"

export function LeaderboardTable() {
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const leaderboardData = await getLeaderboard()
      setUsers(leaderboardData)
    } catch (error) {
      console.error("Error fetching leaderboard:", error)
      toast({
        title: "Error",
        description: "Failed to load leaderboard data.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatStudyTime = (seconds: number) => {
    if (!seconds) return "0h 0m"

    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    return `${hours}h ${minutes}m`
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-6 bg-muted rounded w-1/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-16 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No study data available</h3>
        <p className="text-muted-foreground">Start studying to appear on the leaderboard!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {users.slice(0, 3).map((topUser, index) => (
          <Card key={topUser._id} className={index === 0 ? "border-yellow-500" : ""}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                {index === 0 && <Trophy className="h-5 w-5 text-yellow-500" />}
                {index === 1 && <Trophy className="h-5 w-5 text-gray-400" />}
                {index === 2 && <Trophy className="h-5 w-5 text-amber-700" />}
                {index + 1}. {topUser.name || "Anonymous"}
                {topUser._id === user?._id && <span className="text-sm text-muted-foreground ml-1">(You)</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={topUser.avatar_url || undefined} />
                  <AvatarFallback>{topUser.name?.charAt(0) || "A"}</AvatarFallback>
                </Avatar>
                <div className="grid grid-cols-2 gap-2 flex-1">
                  <div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Total Time</span>
                    </div>
                    <p className="font-medium">{formatStudyTime(topUser.total_study_time)}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Flame className="h-4 w-4 mr-1" />
                      <span>Streak</span>
                    </div>
                    <p className="font-medium">{topUser.current_streak} days</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b">
              <div className="col-span-1">#</div>
              <div className="col-span-5">User</div>
              <div className="col-span-2">Study Time</div>
              <div className="col-span-2">Sessions</div>
              <div className="col-span-2">Streak</div>
            </div>
            {users.map((leaderboardUser, index) => (
              <div
                key={leaderboardUser._id}
                className={`grid grid-cols-12 gap-2 p-4 items-center ${index % 2 === 0 ? "bg-muted/50" : ""} ${
                  leaderboardUser._id === user?._id ? "bg-primary/10" : ""
                }`}
              >
                <div className="col-span-1 font-medium">{index + 1}</div>
                <div className="col-span-5 flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={leaderboardUser.avatar_url || undefined} />
                    <AvatarFallback>{leaderboardUser.name?.charAt(0) || "A"}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">
                    {leaderboardUser.name || "Anonymous"}
                    {leaderboardUser._id === user?._id && (
                      <span className="text-sm text-muted-foreground ml-1">(You)</span>
                    )}
                  </span>
                </div>
                <div className="col-span-2">{formatStudyTime(leaderboardUser.total_study_time)}</div>
                <div className="col-span-2">{leaderboardUser.total_sessions}</div>
                <div className="col-span-2 flex items-center gap-1">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span>{leaderboardUser.current_streak} days</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
