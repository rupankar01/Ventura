"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { getStudySessionsForAnalytics } from "@/app/actions/study-sessions"
import type { StudySession } from "@/app/actions/study-sessions"

type DayData = {
  day: string
  minutes: number
}

type SubjectData = {
  subject: string
  minutes: number
  percentage: number
}

type TimeOfDayData = {
  time: string
  minutes: number
}

export function StudyAnalytics() {
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week")
  const [loading, setLoading] = useState(true)
  const [dailyData, setDailyData] = useState<DayData[]>([])
  const [subjectData, setSubjectData] = useState<SubjectData[]>([])
  const [timeOfDayData, setTimeOfDayData] = useState<TimeOfDayData[]>([])
  const [totalStudyTime, setTotalStudyTime] = useState(0)
  const [averageSessionTime, setAverageSessionTime] = useState(0)
  const [mostProductiveDay, setMostProductiveDay] = useState("")
  const [mostProductiveTime, setMostProductiveTime] = useState("")

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  useEffect(() => {
    fetchStudySessions()
  }, [timeRange])

  const fetchStudySessions = async () => {
    try {
      setLoading(true)
      const sessionsData = await getStudySessionsForAnalytics(timeRange)
      setSessions(sessionsData)
      processData(sessionsData)
    } catch (error) {
      console.error("Error fetching study sessions:", error)
      toast({
        title: "Error",
        description: "Failed to load study analytics.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const processData = (sessions: StudySession[]) => {
    // Process daily data
    const dailyMap = new Map<string, number>()
    const subjectMap = new Map<string, number>()
    const timeOfDayMap = new Map<string, number>()

    let totalMinutes = 0

    sessions.forEach((session) => {
      if (!session.duration) return

      const minutes = Math.floor(session.duration / 60)
      totalMinutes += minutes

      // Daily data
      const date = new Date(session.start_time)
      const day = date.toLocaleDateString("en-US", { weekday: "short" })
      dailyMap.set(day, (dailyMap.get(day) || 0) + minutes)

      // Subject data
      const subject = session.subject || "Uncategorized"
      subjectMap.set(subject, (subjectMap.get(subject) || 0) + minutes)

      // Time of day data
      const hour = date.getHours()
      let timeOfDay = "Morning" // 5-11
      if (hour >= 12 && hour < 17)
        timeOfDay = "Afternoon" // 12-16
      else if (hour >= 17 && hour < 21)
        timeOfDay = "Evening" // 17-20
      else if (hour >= 21 || hour < 5) timeOfDay = "Night" // 21-4

      timeOfDayMap.set(timeOfDay, (timeOfDayMap.get(timeOfDay) || 0) + minutes)
    })

    // Format daily data
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const formattedDailyData = days.map((day) => ({
      day,
      minutes: dailyMap.get(day) || 0,
    }))

    // Format subject data
    const formattedSubjectData = Array.from(subjectMap.entries())
      .map(([subject, minutes]) => ({
        subject,
        minutes,
        percentage: totalMinutes > 0 ? Math.round((minutes / totalMinutes) * 100) : 0,
      }))
      .sort((a, b) => b.minutes - a.minutes)

    // Format time of day data
    const timeOrder = ["Morning", "Afternoon", "Evening", "Night"]
    const formattedTimeOfDayData = timeOrder.map((time) => ({
      time,
      minutes: timeOfDayMap.get(time) || 0,
    }))

    // Calculate insights
    const avgSessionTime = sessions.length > 0 ? Math.round(totalMinutes / sessions.length) : 0

    let mostProdDay = ""
    let maxDayMinutes = 0
    dailyMap.forEach((minutes, day) => {
      if (minutes > maxDayMinutes) {
        maxDayMinutes = minutes
        mostProdDay = day
      }
    })

    let mostProdTime = ""
    let maxTimeMinutes = 0
    timeOfDayMap.forEach((minutes, time) => {
      if (minutes > maxTimeMinutes) {
        maxTimeMinutes = minutes
        mostProdTime = time
      }
    })

    setDailyData(formattedDailyData)
    setSubjectData(formattedSubjectData)
    setTimeOfDayData(formattedTimeOfDayData)
    setTotalStudyTime(totalMinutes)
    setAverageSessionTime(avgSessionTime)
    setMostProductiveDay(mostProdDay)
    setMostProductiveTime(mostProdTime)
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (hours === 0) return `${mins}m`
    return `${hours}h ${mins}m`
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Study Insights</h2>
        <Select value={timeRange} onValueChange={(value) => setTimeRange(value as "week" | "month" | "year")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last 7 days</SelectItem>
            <SelectItem value="month">Last 30 days</SelectItem>
            <SelectItem value="year">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Study Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(totalStudyTime)}</div>
            <p className="text-xs text-muted-foreground">Over {sessions.length} sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(averageSessionTime)}</div>
            <p className="text-xs text-muted-foreground">Per study session</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Most Productive Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mostProductiveDay || "N/A"}</div>
            <p className="text-xs text-muted-foreground">Based on study time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Best Study Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mostProductiveTime || "N/A"}</div>
            <p className="text-xs text-muted-foreground">Most productive time of day</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily Study Time</CardTitle>
            <CardDescription>Minutes studied per day of the week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  minutes: {
                    label: "Minutes",
                    color: "hsl(var(--chart-1))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="minutes" fill="var(--color-minutes)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Study by Subject</CardTitle>
            <CardDescription>Distribution of study time by subject</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="minutes"
                    label={({ subject, percentage }) => `${subject}: ${percentage}%`}
                  >
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} minutes`, "Study Time"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Study Time by Time of Day</CardTitle>
          <CardDescription>When you study the most</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer
              config={{
                minutes: {
                  label: "Minutes",
                  color: "hsl(var(--chart-1))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeOfDayData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="minutes" fill="var(--color-minutes)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {sessions.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No study data available</h3>
          <p className="text-muted-foreground">Start studying to see your analytics!</p>
        </div>
      )}
    </div>
  )
}
