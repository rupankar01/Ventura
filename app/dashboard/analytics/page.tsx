import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { StudyAnalytics } from "@/components/study-analytics"

export const metadata: Metadata = {
  title: "Analytics | Ventura",
  description: "Analyze your study patterns and improve your productivity",
}

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">Study Analytics</h1>
        <StudyAnalytics />
      </main>
    </div>
  )
}
