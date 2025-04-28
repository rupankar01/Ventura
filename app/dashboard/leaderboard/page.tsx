import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { LeaderboardTable } from "@/components/leaderboard-table"

export const metadata: Metadata = {
  title: "Leaderboard | Ventura",
  description: "See who's studying the most and track your progress",
}

export default function LeaderboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">Leaderboard</h1>
        <LeaderboardTable />
      </main>
    </div>
  )
}
