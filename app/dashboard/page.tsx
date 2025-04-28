import type { Metadata } from "next"

import { StudySession } from "@/components/study-session"
import { Navbar } from "@/components/navbar"

export const metadata: Metadata = {
  title: "Dashboard | Ventura",
  description: "Manage your study sessions and track your progress",
}

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-2">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Welcome back!</h2>
              <p className="text-muted-foreground mb-6">
                Ready to start a new study session? Use the timer below to track your progress.
              </p>
              <StudySession />
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-2">Weekly Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Sessions</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Study Time</span>
                  <span className="font-medium">8h 45m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg. Session</span>
                  <span className="font-medium">45m</span>
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-2">Recent Subjects</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Mathematics</span>
                  <span className="font-medium">2h 30m</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Physics</span>
                  <span className="font-medium">1h 45m</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Computer Science</span>
                  <span className="font-medium">3h 15m</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
